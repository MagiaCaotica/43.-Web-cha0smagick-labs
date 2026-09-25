import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../../..');

/* The bridge resolves consent from the cookie_consent cookie -- the same cookie
   shared.js and conversion.js use -- so the harness has to model a real cookie
   jar. `jar.cookie` is a mutable string, exactly like document.cookie. */
function loadBridge(options = {}) {
  const source = fs.readFileSync(path.join(root, 'js', 'analytics-bridge.js'), 'utf8');
  const storage = new Map(Object.entries(options.localStorage || {}));
  const listeners = [];
  const context = {
    localStorage: {
      getItem: (key) => (storage.has(key) ? storage.get(key) : null),
      setItem: (key, value) => storage.set(key, String(value)),
      removeItem: (key) => storage.delete(key),
    },
    document: {
      cookie: options.cookie || '',
      addEventListener: (type, handler) => { listeners.push({ type, handler }); },
    },
  };
  context.window = context;
  vm.runInNewContext(source, context);
  return { context, bridge: context.Cha0Analytics, listeners, storage };
}

function click(listeners, attributeValue) {
  const target = {
    getAttribute: (name) => (name === 'data-analytics-event' ? attributeValue : null),
  };
  const event = { target: { closest: (selector) => (selector === '[data-analytics-event]' ? target : null) } };
  listeners.filter((l) => l.type === 'click').forEach((l) => l.handler(event));
}

describe('analytics bridge -- consent', () => {
  it('records events for a first-time visitor (site is granted unless declined)', () => {
    const { context, bridge } = loadBridge();
    expect(bridge.isConsentGranted()).toBe(true);
    expect(bridge.track('tool_start', { tool_id: 'A01' })).toBe(true);
    expect(context.dataLayer.at(-1).event).toBe('tool_start');
  });

  it('blocks events when the visitor declined via cookie_consent', () => {
    const { context, bridge } = loadBridge({ cookie: 'cookie_consent=declined; path=/' });
    expect(bridge.isConsentGranted()).toBe(false);
    expect(bridge.track('tool_start', { tool_id: 'A01' })).toBe(false);
    expect(context.dataLayer ?? []).toEqual([]);
  });

  it('records events when the visitor accepted via cookie_consent', () => {
    const { context, bridge } = loadBridge({ cookie: 'cookie_consent=accepted; path=/' });
    expect(bridge.track('tool_start', { tool_id: 'A01' })).toBe(true);
    expect(context.dataLayer.at(-1).tool_id).toBe('A01');
  });

  it('honours a stored denial from a previous visit', () => {
    const { context, bridge } = loadBridge({ localStorage: { cha0_analytics_consent: 'denied' } });
    expect(bridge.isConsentGranted()).toBe(false);
    expect(bridge.track('tool_start', { tool_id: 'A01' })).toBe(false);
  });

  it('lets an explicit setConsent(false) override a granted cookie', () => {
    const { context, bridge } = loadBridge({ cookie: 'cookie_consent=accepted' });
    bridge.setConsent(false);
    expect(bridge.track('tool_start', { tool_id: 'A01' })).toBe(false);
    expect(context.dataLayer ?? []).toEqual([]);
  });

  it('re-reads the cookie so a late decline is honoured', () => {
    const { context, bridge } = loadBridge();
    expect(bridge.isConsentGranted()).toBe(true);
    context.document.cookie = 'cookie_consent=declined';
    expect(bridge.isConsentGranted()).toBe(false);
    expect(bridge.track('tool_start', { tool_id: 'A01' })).toBe(false);
  });
});

describe('analytics bridge -- payload', () => {
  it('keeps every field the call sites send, including the ones it used to drop', () => {
    const { context, bridge } = loadBridge();
    bridge.track('tool_start', { tool_id: 'tarot-journal', category: 'Tarot', source: 'atomic_tool' });
    bridge.track('tool_complete', {
      tool_id: 'tarot-journal',
      category: 'Tarot',
      result_present: true,
      duration_bucket: '0-30',
      source: 'atomic_tool',
    });
    const [start, complete] = context.dataLayer;
    expect(start.source).toBe('atomic_tool');
    expect(complete.result_present).toBe(true);
    expect(complete.duration_bucket).toBe('0-30');
    expect(complete.source).toBe('atomic_tool');
  });

  it('removes PII and keeps allowlisted fields', () => {
    const { context, bridge } = loadBridge();
    bridge.track('tool_start', {
      tool_id: 'A01',
      category: 'astrology',
      email: 'person@example.com',
      secret: 'do-not-send',
    });
    const event = context.dataLayer.at(-1);
    expect(event.tool_id).toBe('A01');
    expect(event.category).toBe('astrology');
    expect(event.email).toBeUndefined();
    expect(event.secret).toBeUndefined();
  });

  it('drops values that are not finite scalars and strips angle brackets', () => {
    const { context, bridge } = loadBridge();
    bridge.track('cta_click', { tool_id: '<b>x</b>', cta_type: '   ', placement: 42 });
    const event = context.dataLayer.at(-1);
    expect(event.tool_id).toBe('bx/b');
    expect(event.cta_type).toBeUndefined();
    expect(event.placement).toBe(42);
  });

  it('rejects event names outside the contract', () => {
    const { context, bridge } = loadBridge();
    expect(bridge.track('totally_made_up', { tool_id: 'A01' })).toBe(false);
    expect(context.dataLayer ?? []).toEqual([]);
  });

  it('accepts every funnel event conversion.js emits', () => {
    const { context, bridge } = loadBridge();
    const emitted = [
      ['tool_funnel_view', { tool_id: 'tarot-journal', category: 'Tarot', apps: 1, has_book: true, related: 3, source: 'tool_funnel' }],
      ['tool_funnel_click', { tool_id: 'tarot-journal', product_type: 'book', product_id: 'tarot-chaos-pdf', source: 'tool_funnel' }],
      ['purchase_click', { currency: 'USD', value: 3.99, destination: 'hotmart', link_url: 'https://pay.hotmart.com/X', page: '/tools/tarot-journal.html' }],
      ['begin_checkout', { currency: 'USD', value: 3.99 }],
      ['lead_magnet_view', { form_name: 'google_forms_lead_magnet', page_type: 'tools' }],
      ['popup_view', { trigger: 'timer_30s', page_type: 'tools' }],
      ['popup_close', { reason: 'button' }],
      ['share', { method: 'x', content_type: 'blog', item_id: '/blog/x' }],
      ['affiliate_click', { affiliate_id: 'abc', product: 'psi-gym' }],
    ];
    for (const [name, params] of emitted) {
      expect(bridge.track(name, params), `${name} fue rechazado`).toBe(true);
    }
    expect(context.dataLayer.map((e) => e.event)).toEqual(emitted.map(([n]) => n));
    const click = context.dataLayer.find((e) => e.event === 'tool_funnel_click');
    expect(click.product_id).toBe('tarot-chaos-pdf');
    const purchase = context.dataLayer.find((e) => e.event === 'purchase_click');
    expect(purchase.value).toBe(3.99);
  });

  it('drops the items array from purchase_click instead of stringifying it', () => {
    const { context, bridge } = loadBridge();
    bridge.track('purchase_click', {
      currency: 'USD',
      value: 9.99,
      destination: 'google_play',
      items: [{ item_id: 'tarot-chaos', item_name: 'Tarot Chaos', price: 9.99 }],
    });
    const event = context.dataLayer.at(-1);
    expect(event.items).toBeUndefined();
    expect(event.value).toBe(9.99);
  });

  it('auto-binds the declarative channel and records clicked attributes', () => {
    const { context, listeners } = loadBridge();
    expect(listeners.filter((l) => l.type === 'click').length).toBeGreaterThan(0);
    click(listeners, 'book_click');
    expect(context.dataLayer.at(-1).event).toBe('book_click');
  });
});

describe('conversion.js mirroring', () => {
  it('mirrors every event through the bridge and keeps the gtag call', () => {
    const source = fs.readFileSync(path.join(root, 'js', 'conversion.js'), 'utf8');
    const body = source.slice(source.indexOf('function track(eventName, params)'));
    const fn = body.slice(0, body.indexOf('\n  }'));
    expect(fn, 'track() no llama al bridge').toContain('window.Cha0Analytics.track(eventName, params)');
    expect(fn, 'track() perdio la llamada a gtag').toContain("window.gtag('event', eventName, params || {})");
    // The mirror must not be able to take the page down.
    expect(fn).toContain('catch');
  });

  it('mirrors only events the bridge declares', () => {
    const source = fs.readFileSync(path.join(root, 'js', 'conversion.js'), 'utf8');
    const names = new Set();
    for (const m of source.matchAll(/\btrack\('([a-z_]+)'/g)) names.add(m[1]);
    const { bridge } = loadBridge();
    for (const name of names) {
      expect(bridge.events, `conversion.js emite ${name} y el bridge no lo declara`).toContain(name);
    }
  });
});

describe('atomic tool integration', () => {
  it('declares atomic lifecycle events without form values', () => {
    const source = fs.readFileSync(path.join(root, 'js', 'atomic-tools.js'), 'utf8');
    expect(source).toContain("track('tool_start'");
    expect(source).toContain("track('tool_complete'");
    expect(source).toContain('result_present');
    expect(source).toContain('duration_bucket');
    expect(source).not.toContain('email');
    expect(source).not.toContain('password');
  });

  it('keeps the event contract and the bridge allowlist in sync', () => {
    const spec = JSON.parse(fs.readFileSync(path.join(root, 'data', 'analytics-events.json'), 'utf8'));
    const bridgeSource = fs.readFileSync(path.join(root, 'js', 'analytics-bridge.js'), 'utf8');
    const block = bridgeSource.slice(
      bridgeSource.indexOf('var ALLOWED_KEYS'),
      bridgeSource.indexOf('var CONSENT_COOKIE')
    );
    for (const event of Object.keys(spec.events)) {
      expect(block.includes(`${event}:`), `event ${event} missing from the bridge allowlist`).toBe(true);
      for (const field of [...spec.events[event].required, ...spec.events[event].optional]) {
        expect(block.includes(`'${field}'`), `${event}.${field} is in the spec but not allowed by the bridge`).toBe(true);
      }
    }
  });

  /* Regression: `global` is a Node global, not a browser one. Using it as a free
     variable in a page script throws ReferenceError, which silently kills the
     whole click or submit handler that touched it -- that is how the atomic
     tools stopped producing a result at all.
     js/analytics-bridge.js is exempt: its IIFE is `(function (global) { ... }(window))`,
     so there `global` is a parameter aliasing window, not the Node global. It is
     covered at runtime by every test in this file, which evaluate the script in a
     context that deliberately has no `global`. */
  it('uses no Node-only globals in browser scripts', () => {
    const exempt = new Set(['js/analytics-bridge.js']);
    for (const file of ['js/atomic-tools.js', 'js/analytics-bridge.js', 'js/conversion.js']) {
      if (exempt.has(file)) continue;
      const source = fs.readFileSync(path.join(root, file), 'utf8');
      const offenders = source
        .split('\n')
        .map((line, index) => ({ line: line.trim(), at: index + 1 }))
        .filter((entry) => /(?<![\w.$])global\s*[.[]/.test(entry.line));
      expect(
        offenders.map((o) => `${file}:${o.at} ${o.line}`),
        'Node-only "global" in browser script'
      ).toEqual([]);
    }
  });

  it('reaches the bridge from atomic-tools through the browser global', () => {
    const source = fs.readFileSync(path.join(root, 'js', 'atomic-tools.js'), 'utf8');
    expect(source).toContain('window.Cha0Analytics');
  });
});
