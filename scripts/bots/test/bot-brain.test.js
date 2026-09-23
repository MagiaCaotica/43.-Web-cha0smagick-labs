import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dotenv before importing bot-brain
vi.mock('dotenv', () => ({ config: vi.fn() }));

// Import after mocks
const BRAIN = await import('../bot-brain.js');

describe('bot-brain — Catalog Integrity', () => {
  describe('BRAIN structure', () => {
    it('should have required top-level properties', () => {
      expect(BRAIN).toHaveProperty('version');
      expect(BRAIN).toHaveProperty('site');
      expect(BRAIN).toHaveProperty('social');
      expect(BRAIN).toHaveProperty('apps');
      expect(BRAIN).toHaveProperty('books');
      expect(BRAIN).toHaveProperty('bundle');
      expect(BRAIN).toHaveProperty('freeTools');
      expect(BRAIN).toHaveProperty('mailerLite');
      expect(BRAIN).toHaveProperty('blog');
      expect(BRAIN).toHaveProperty('helpers');
    });

    it('should have valid site configuration', () => {
      expect(BRAIN.site).toHaveProperty('name', 'Cha0smagick Labs');
      expect(BRAIN.site).toHaveProperty('url', 'https://cha0smagicklabs.com');
      expect(BRAIN.site).toHaveProperty('blog');
      expect(BRAIN.site).toHaveProperty('library');
      expect(typeof BRAIN.site.funnel).toBe('function');
    });

    it('should have valid social links', () => {
      expect(BRAIN.social.telegram).toHaveProperty('channel');
      expect(BRAIN.social.telegram).toHaveProperty('group');
      expect(BRAIN.social).toHaveProperty('discord');
      expect(BRAIN.social).toHaveProperty('twitter');
      expect(BRAIN.social).toHaveProperty('pinterest');
    });
  });

  describe('Apps catalog (10 apps)', () => {
    it('should have exactly 10 apps', () => {
      expect(BRAIN.apps).toHaveLength(10);
    });

    it('every app should have required fields', () => {
      const requiredFields = ['id', 'name', 'price', 'url', 'funnel', 'tags', 'shortDesc', 'category'];
      for (const app of BRAIN.apps) {
        for (const field of requiredFields) {
          expect(app).toHaveProperty(field);
          expect(app[field]).toBeTruthy();
        }
      }
    });

    it('every app should have category "app"', () => {
      for (const app of BRAIN.apps) {
        expect(app.category).toBe('app');
      }
    });

    it('no duplicate app IDs', () => {
      const ids = BRAIN.apps.map(a => a.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('no duplicate app URLs', () => {
      const urls = BRAIN.apps.map(a => a.url);
      const uniqueUrls = new Set(urls);
      expect(uniqueUrls.size).toBe(urls.length);
    });

    it('no duplicate app funnel URLs', () => {
      const funnels = BRAIN.apps.map(a => a.funnel);
      const uniqueFunnels = new Set(funnels);
      expect(uniqueFunnels.size).toBe(funnels.length);
    });

    it('all app prices should be strings in valid format ($X.XX USD)', () => {
      const priceRegex = /^\$\d+(\.\d{2})? USD$/;
      for (const app of BRAIN.apps) {
        expect(typeof app.price).toBe('string');
        expect(app.price).toMatch(priceRegex);
      }
    });

    it('all app URLs should match play.google.com domain', () => {
      for (const app of BRAIN.apps) {
        expect(app.url).toMatch(/^https:\/\/play\.google\.com\/store\/apps\/details\?id=/);
      }
    });

    it('all app funnel URLs should match cha0smagicklabs.com domain', () => {
      for (const app of BRAIN.apps) {
        expect(app.funnel).toMatch(/^https:\/\/cha0smagicklabs\.com\/apps\/.*\.html$/);
      }
    });

    it('all app tags should be non-empty arrays', () => {
      for (const app of BRAIN.apps) {
        expect(Array.isArray(app.tags)).toBe(true);
        expect(app.tags.length).toBeGreaterThan(0);
        for (const tag of app.tags) {
          expect(typeof tag).toBe('string');
          expect(tag.length).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('Books catalog (7 books)', () => {
    it('should have exactly 7 books', () => {
      expect(BRAIN.books).toHaveLength(7);
    });

    it('every book should have required fields', () => {
      const requiredFields = ['id', 'name', 'price', 'url', 'tags', 'shortDesc'];
      for (const book of BRAIN.books) {
        for (const field of requiredFields) {
          expect(book).toHaveProperty(field);
          expect(book[field]).toBeTruthy();
        }
      }
    });

    it('no duplicate book IDs', () => {
      const ids = BRAIN.books.map(b => b.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('no duplicate book URLs', () => {
      const urls = BRAIN.books.map(b => b.url);
      const uniqueUrls = new Set(urls);
      expect(uniqueUrls.size).toBe(urls.length);
    });

    it('all book prices should be strings in valid format ($X.XX USD)', () => {
      const priceRegex = /^\$\d+(\.\d{2})? USD$/;
      for (const book of BRAIN.books) {
        expect(typeof book.price).toBe('string');
        expect(book.price).toMatch(priceRegex);
      }
    });

    it('all book URLs should match cha0smagicklabs.com domain', () => {
      for (const book of BRAIN.books) {
        expect(book.url).toMatch(/^https:\/\/cha0smagicklabs\.com\/books\/.*\.html$/);
      }
    });

    it('all book tags should be non-empty arrays', () => {
      for (const book of BRAIN.books) {
        expect(Array.isArray(book.tags)).toBe(true);
        expect(book.tags.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Bundle', () => {
    it('should have required bundle properties', () => {
      expect(BRAIN.bundle).toHaveProperty('name', 'Esoteric Books Bundle');
      expect(BRAIN.bundle).toHaveProperty('price');
      expect(BRAIN.bundle).toHaveProperty('originalPrice');
      expect(BRAIN.bundle).toHaveProperty('url');
      expect(BRAIN.bundle).toHaveProperty('shortDesc');
    });

    it('bundle price should be valid format', () => {
      expect(BRAIN.bundle.price).toMatch(/^\$\d+(\.\d{2})? USD$/);
      expect(BRAIN.bundle.originalPrice).toMatch(/^\$\d+(\.\d{2})? USD$/);
    });

    it('bundle URL should match cha0smagicklabs.com', () => {
      expect(BRAIN.bundle.url).toMatch(/^https:\/\/cha0smagicklabs\.com\/bundle\.html$/);
    });
  });

  describe('Free Tools', () => {
    it('should have 10 free tools', () => {
      expect(BRAIN.freeTools).toHaveLength(10);
    });

    it('every tool should have name and url', () => {
      for (const tool of BRAIN.freeTools) {
        expect(tool).toHaveProperty('name');
        expect(tool).toHaveProperty('url');
        expect(typeof tool.name).toBe('string');
        expect(typeof tool.url).toBe('string');
        expect(tool.url).toMatch(/^https:\/\/cha0smagicklabs\.com\/tools\/.*\.html$/);
      }
    });
  });

  describe('Blog stats', () => {
    it('should have articleCount and categories', () => {
      expect(BRAIN.blog).toHaveProperty('articleCount');
      expect(typeof BRAIN.blog.articleCount).toBe('number');
      expect(BRAIN.blog.articleCount).toBeGreaterThan(0);
      expect(Array.isArray(BRAIN.blog.categories)).toBe(true);
      expect(BRAIN.blog.categories.length).toBeGreaterThan(0);
    });
  });

  describe('Helper functions', () => {
    it('formatApp should return formatted string with name, desc, price, funnel', () => {
      const app = BRAIN.apps[0];
      const formatted = BRAIN.helpers.formatApp(app);
      expect(formatted).toContain(app.name);
      expect(formatted).toContain(app.shortDesc);
      expect(formatted).toContain(app.price);
      expect(formatted).toContain(app.funnel);
    });

    it('formatBook should return formatted string with name, desc, price, url', () => {
      const book = BRAIN.books[0];
      const formatted = BRAIN.helpers.formatBook(book);
      expect(formatted).toContain(book.name);
      expect(formatted).toContain(book.shortDesc);
      expect(formatted).toContain(book.price);
      expect(formatted).toContain(book.url);
    });

    it('formatTool should return formatted string with name and url', () => {
      const tool = BRAIN.freeTools[0];
      const formatted = BRAIN.helpers.formatTool(tool);
      expect(formatted).toContain(tool.name);
      expect(formatted).toContain(tool.url);
      expect(formatted).toContain('FREE');
    });

    it('welcomeMessage should return platform-specific message', () => {
      const telegramMsg = BRAIN.helpers.welcomeMessage('telegram');
      const discordMsg = BRAIN.helpers.welcomeMessage('discord');
      expect(telegramMsg).toContain('/menu');
      expect(discordMsg).toContain('Explore our channels');
    });

    it('mainMenu should return menu with all command options', () => {
      const menu = BRAIN.helpers.mainMenu();
      expect(menu).toContain('/apps');
      expect(menu).toContain('/books');
      expect(menu).toContain('/tools');
      expect(menu).toContain('/bundle');
      expect(menu).toContain('/blog');
      expect(menu).toContain('/subscribe');
      expect(menu).toContain('/website');
      expect(menu).toContain('/contact');
    });

    it('blogCategories should return formatted categories list', () => {
      const categories = BRAIN.helpers.blogCategories();
      expect(categories).toContain('Chaos Magick');
      expect(categories).toContain('Tarot');
      expect(categories).toContain('Runes');
      expect(categories).toContain(BRAIN.site.blog);
    });

    it('smartReply should return null for empty query', async () => {
      const result = await BRAIN.helpers.smartReply('', 'fake-key');
      expect(result).toBeNull();
    });

    it('smartReply should return null for whitespace-only query', async () => {
      const result = await BRAIN.helpers.smartReply('   ', 'fake-key');
      expect(result).toBeNull();
    });

    it('autoReply should match tarot keywords', () => {
      const reply = BRAIN.helpers.autoReply('I love tarot cards');
      expect(reply).toContain('Rider-Waite Tarot');
      expect(reply).toContain('cha0smagicklabs.com');
    });

    it('autoReply should match runes keywords', () => {
      const reply = BRAIN.helpers.autoReply('Tell me about runes');
      expect(reply).toContain('Norse Rune Oracle');
    });

    it('autoReply should match sigil keywords', () => {
      const reply = BRAIN.helpers.autoReply('How to make sigils');
      expect(reply).toContain('Chaos Sigil Generator');
    });

    it('autoReply should match goetia keywords', () => {
      const reply = BRAIN.helpers.autoReply('What is goetia');
      expect(reply).toContain('Arcana Goetia');
    });

    it('autoReply should match dream/lucid keywords', () => {
      const reply = BRAIN.helpers.autoReply('lucid dreaming tips');
      expect(reply).toContain('Dream Machine');
    });

    it('autoReply should match astrology keywords', () => {
      const reply = BRAIN.helpers.autoReply('zodiac signs');
      expect(reply).toContain('Astral Lab');
    });

    it('autoReply should match moon/lunar keywords', () => {
      const reply = BRAIN.helpers.autoReply('moon phases');
      expect(reply).toContain('Lunar Phase Calculator');
    });

    it('autoReply should match free/tools keywords', () => {
      const reply = BRAIN.helpers.autoReply('free tools');
      expect(reply).toContain('I Ching');
      expect(reply).toContain('Runes');
      expect(reply).toContain('Sigil Generator');
    });

    it('autoReply should match book/pdf keywords', () => {
      const reply = BRAIN.helpers.autoReply('esoteric books');
      expect(reply).toContain('Codex Chaoticus');
      expect(reply).toContain('bundle');
    });

    it('autoReply should match bundle keywords', () => {
      const reply = BRAIN.helpers.autoReply('bundle offer');
      expect(reply).toContain('Esoteric Books Bundle');
      expect(reply).toContain('52% off');
    });

    it('autoReply should match price/subscription keywords', () => {
      const reply = BRAIN.helpers.autoReply('how much does it cost');
      expect(reply).toContain('One-time purchase');
      expect(reply).toContain('No subscriptions');
    });

    it('autoReply should match who/what is chaos magick keywords', () => {
      const reply = BRAIN.helpers.autoReply('what is chaos magick');
      expect(reply).toContain('Cha0smagick Labs');
      expect(reply).toContain('Grindho');
    });

    it('autoReply should return null for unmatched queries', () => {
      const reply = BRAIN.helpers.autoReply('random unrelated text xyz123');
      expect(reply).toBeNull();
    });
  });

  describe('MailerLite config', () => {
    it('should have EN and ES configurations', () => {
      expect(BRAIN.mailerLite).toHaveProperty('en');
      expect(BRAIN.mailerLite).toHaveProperty('es');
      expect(BRAIN.mailerLite.en).toHaveProperty('formId');
      expect(BRAIN.mailerLite.es).toHaveProperty('group');
    });
  });

  describe('getOfferImage (3.1.3)', () => {
    it('returns image when offer has one', () => {
      const app = BRAIN.apps[0];
      const original = app.image;
      app.image = 'https://example.com/test.png';
      expect(BRAIN.helpers.getOfferImage(app.id)).toBe('https://example.com/test.png');
      app.image = original;
    });
    it('returns null when offer has no image', () => {
      const app = BRAIN.apps[0];
      const original = app.image;
      app.image = null;
      expect(BRAIN.helpers.getOfferImage(app.id)).toBeNull();
      app.image = original;
    });
    it('returns null for unknown id', () => {
      expect(BRAIN.helpers.getOfferImage('nonexistent-xyz-123')).toBeNull();
    });
  });
});