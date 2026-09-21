import { describe, it, expect } from 'vitest';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  PIN_CALENDAR,
  TWEET_CALENDAR,
  loadState,
  saveState,
  listBlogArticles,
  buildBlogPostText,
  selectFreshArticles,
  pickCalendarItem,
} from '../../social-publish.js';

describe('social-publish calendars', () => {
  it('has 13 pins with all required fields', () => {
    expect(PIN_CALENDAR.length).toBe(13);
    for (const p of PIN_CALENDAR) {
      expect(typeof p.day).toBe('number');
      expect(typeof p.board).toBe('string');
      expect(typeof p.title).toBe('string');
      expect(typeof p.file).toBe('string');
      expect(p.link.startsWith('https://')).toBe(true);
    }
  });

  it('has 30 tweets as strings', () => {
    expect(TWEET_CALENDAR.length).toBe(30);
    for (const t of TWEET_CALENDAR) expect(typeof t).toBe('string');
  });
});

describe('selectFreshArticles (3.3.3)', () => {
  const now = new Date('2026-09-21T12:00:00Z');
  const articles = [
    { file: 'a.html', mtime: Date.parse('2026-09-20T10:00:00Z') },
    { file: 'b.html', mtime: Date.parse('2026-09-21T11:00:00Z') },
    { file: 'c.html', mtime: Date.parse('2026-09-19T10:00:00Z') },
    { file: 'd.html', mtime: Date.parse('2026-09-21T09:00:00Z') },
  ];

  it('returns empty before seeding (first-run backfill protection)', () => {
    const state = { seeded: false, lastRun: null, published: {} };
    expect(selectFreshArticles(articles, state, now, 3)).toEqual([]);
  });

  it('selects unpublished articles newer than lastRun, newest first', () => {
    const state = { seeded: true, lastRun: '2026-09-20T00:00:00Z', published: { 'blog/d.html': 'x' } };
    const picked = selectFreshArticles(articles, state, now, 3);
    expect(picked.map((a) => a.file)).toEqual(['b.html', 'a.html']);
  });

  it('caps at maxPosts', () => {
    const state = { seeded: true, lastRun: '2026-09-01T00:00:00Z', published: {} };
    expect(selectFreshArticles(articles, state, now, 2).length).toBe(2);
  });
});

describe('pickCalendarItem (3.3.2 evergreen + 3.3.4 feedback loop)', () => {
  const cal = ['one', 'two', 'three'];

  it('rotates evergreen when no scores recorded (tie broken by index)', () => {
    const d0 = new Date('2026-09-21T00:00:00Z');
    const d1 = new Date('2026-09-22T00:00:00Z');
    const e0 = pickCalendarItem(cal, {}, d0, 'cal');
    const e1 = pickCalendarItem(cal, {}, d1, 'cal');
    expect(e1.index).toBe((e0.index + 1) % 3);
  });

  it('boosts high performers: weighted rotation favors top scorer over 12 days', () => {
    const counts = { one: 0, two: 0, three: 0 };
    for (let d = 0; d < 12; d++) {
      const day = new Date(Date.UTC(2026, 8, 21) + d * 86400000);
      const e = pickCalendarItem(cal, { 'cal-3': { score: 9 } }, day, 'cal');
      counts[e.item]++;
    }
    expect(counts.three).toBe(10);
    expect(counts.one).toBe(1);
    expect(counts.two).toBe(1);
  });

  it('weighted rotation with partial scores (unscored items rotate once per cycle)', () => {
    const counts = { one: 0, two: 0, three: 0 };
    let sawScore = null;
    for (let d = 0; d < 8; d++) {
      const day = new Date(Date.UTC(2026, 8, 21) + d * 86400000);
      const e = pickCalendarItem(cal, { 'cal-1': { score: 5 } }, day, 'cal');
      counts[e.item]++;
      if (e.item === 'one') sawScore = e.score;
    }
    expect(counts.one).toBe(6);
    expect(counts.two).toBe(1);
    expect(counts.three).toBe(1);
    expect(sawScore).toBe(5);
  });
});

describe('buildBlogPostText', () => {
  it('formats title, description and site link', () => {
    expect(
      buildBlogPostText({ title: 'T', desc: 'D', file: 't.html' })
    ).toBe('📖 T\nD\n→ https://cha0smagicklabs.com/blog/t.html');
  });
});

describe('listBlogArticles', () => {
  it('extracts title/description and mtime from html files, skips others', () => {
    const dir = mkdtempSync(join(tmpdir(), 'social-blog-'));
    writeFileSync(
      join(dir, 'x.html'),
      '<html><head><title>Test X</title><meta name="description" content="Desc X"></head><body></body></html>'
    );
    writeFileSync(join(dir, 'y.txt'), 'not html');
    const arts = listBlogArticles(dir);
    expect(arts.length).toBe(1);
    expect(arts[0].file).toBe('x.html');
    expect(arts[0].title).toBe('Test X');
    expect(arts[0].desc).toBe('Desc X');
    expect(typeof arts[0].mtime).toBe('number');
  });
});

describe('state persistence (3.3.1)', () => {
  it('defaults on missing file and roundtrips via tmp file', () => {
    const file = join(mkdtempSync(join(tmpdir(), 'social-state-')), 'state.json');
    const s = loadState(file);
    expect(s).toEqual({ version: 1, lastRun: null, seeded: false, published: {} });
    s.seeded = true;
    s.lastRun = '2026-09-21T00:00:00Z';
    s.published['blog/x.html'] = '2026-09-21T00:00:00Z';
    saveState(s, file);
    const reloaded = loadState(file);
    expect(reloaded.seeded).toBe(true);
    expect(reloaded.lastRun).toBe('2026-09-21T00:00:00Z');
    expect(reloaded.published['blog/x.html']).toBe('2026-09-21T00:00:00Z');
  });
});
