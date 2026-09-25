/* End-to-end guard for the atomic tool engine in a real DOM.
   The bug this locks: js/atomic-tools.js referenced the Node-only global
   `global`, so the submit handler threw ReferenceError before rendering a
   result. Every one of the 40 atomic tools silently produced nothing.
   A static grep cannot catch that class of failure on its own, so this test
   actually mounts the page, fills the form and submits it. */
import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { JSDOM } from 'jsdom';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../../..');

const atomicSource = fs.readFileSync(path.join(root, 'js', 'atomic-tools.js'), 'utf8');
const bridgeSource = fs.readFileSync(path.join(root, 'js', 'analytics-bridge.js'), 'utf8');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'data', 'atomic-tools.json'), 'utf8'));

const TOOL_ID = 'A09';
const TOOL = catalog.tools[TOOL_ID];

function mountTool(toolId) {
  const tool = catalog.tools[toolId];
  const dom = new JSDOM(
    `<!doctype html><html lang="es"><body data-atomic-tool="${toolId}"><div id="atomic-app"></div></body></html>`,
    { runScripts: 'outside-only', url: 'https://example.test/tools/probe.html' }
  );
  const { window } = dom;

  // jsdom ships no fetch and no scrollIntoView; both are used by the engine.
  window.fetch = async () => ({ ok: true, json: async () => catalog });
  window.HTMLElement.prototype.scrollIntoView = function scrollIntoView() {};
  if (!window.CSS) window.CSS = {};
  if (typeof window.CSS.escape !== 'function') {
    window.CSS.escape = (value) => String(value).replace(/[^a-zA-Z0-9_-]/g, '\\$&');
  }

  // Evaluate the real files in the jsdom window. The bridge is evaluated with
  // its own IIFE argument, so `window.Cha0Analytics` becomes available exactly
  // as it does in a browser.
  const errors = [];
  window.addEventListener('error', (event) => errors.push(String(event.error || event.message)));

  const run = (code) => vm.runInContext(code, dom.getInternalVMContext());
  run(bridgeSource);
  // Consented, so the engine's track() calls are observable.
  window.Cha0Analytics.setConsent(true);
  run(atomicSource);

  // The bridge writes to the jsdom window's dataLayer, not to a local array.
  const events = () => (window.dataLayer || []).filter((e) => e && e.event);
  return { window, document: window.document, events, errors, tool };
}

function fillAndSubmit(window, document) {
  const form = document.getElementById('atomic-form');
  form.querySelectorAll('input, select, textarea').forEach((el) => {
    if (el.type === 'checkbox') el.checked = true;
    else if (el.tagName === 'SELECT') {
      const first = Array.from(el.options).find((o) => o.value !== '');
      if (first) el.value = first.value;
    } else el.value = 'Carta del Dia';
  });
  form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
}

describe('atomic tool engine', () => {
  it('renders a result when the form is submitted', async () => {
    const { window, document, errors } = mountTool(TOOL_ID);
    await new Promise((resolve) => setImmediate(resolve));

    const form = document.getElementById('atomic-form');
    expect(form, 'el formulario no se renderizo').toBeTruthy();
    expect(document.getElementById('atomic-result').hidden).toBe(true);

    fillAndSubmit(window, document);

    expect(errors, 'la pagina lanzo errores').toEqual([]);
    const result = document.getElementById('atomic-result');
    expect(result.hidden, 'el resultado sigo oculto: el handler de submitmurio').toBe(false);
    expect(result.textContent).toContain(TOOL.name);
    expect(document.getElementById('atomic-form-status').textContent).toBe('Resultado generado.');
  });

  it('records tool_start and tool_complete with the full payload', async () => {
    const { window, document, events } = mountTool(TOOL_ID);
    await new Promise((resolve) => setImmediate(resolve));
    fillAndSubmit(window, document);

    const dataLayer = events();
    const names = dataLayer.map((e) => e.event);
    expect(names).toContain('tool_start');
    expect(names).toContain('tool_complete');

    const start = dataLayer.find((e) => e.event === 'tool_start');
    expect(start.tool_id).toBe(TOOL_ID);
    expect(start.category).toBe(TOOL.category);
    expect(start.source).toBe('atomic_tool');

    const complete = dataLayer.find((e) => e.event === 'tool_complete');
    expect(complete.result_present).toBe(true);
    expect(complete.duration_bucket).toBe('0-30');
    expect(complete.source).toBe('atomic_tool');
  });

  it('never sends raw field values to dataLayer', async () => {
    const { window, document, events } = mountTool(TOOL_ID);
    await new Promise((resolve) => setImmediate(resolve));
    fillAndSubmit(window, document);
    expect(JSON.stringify(events())).not.toContain('Carta del Dia');
  });

  it('shows the validation error and fires no event when a required field is empty', async () => {
    const { window, document, events } = mountTool(TOOL_ID);
    await new Promise((resolve) => setImmediate(resolve));
    const form = document.getElementById('atomic-form');
    form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));

    expect(document.getElementById('atomic-result').hidden).toBe(true);
    expect(document.getElementById('atomic-form-status').className).toContain('is-error');
    expect(events()).toEqual([]);
  });

  it('works for every tool in the catalog', async () => {
    for (const toolId of Object.keys(catalog.tools)) {
      const { window, document, errors } = mountTool(toolId);
      await new Promise((resolve) => setImmediate(resolve));
      fillAndSubmit(window, document);
      expect(errors, `${toolId} lanzo errores`).toEqual([]);
      const missing = (catalog.tools[toolId].fields || []).filter((f) => f.required).length;
      if (missing === 0) {
        expect(document.getElementById('atomic-result').hidden, `${toolId} no genero resultado`).toBe(false);
      }
    }
  });
});
