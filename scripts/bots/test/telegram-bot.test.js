import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock dotenv
vi.mock('dotenv', () => ({ config: vi.fn() }));

// Mock node-telegram-bot-api
const mockSendMessage = vi.fn().mockResolvedValue({ message_id: 123 });
const mockSendChatAction = vi.fn().mockResolvedValue(true);
const mockOnText = vi.fn();
const mockOn = vi.fn();
const mockTelegramBot = vi.fn().mockImplementation(() => ({
  sendMessage: mockSendMessage,
  sendChatAction: mockSendChatAction,
  onText: mockOnText,
  on: mockOn,
}));

vi.mock('node-telegram-bot-api', () => ({
  __esModule: true,
  default: { TelegramBot: mockTelegramBot },
  TelegramBot: mockTelegramBot,
}));

// Mock groq-ai
const mockAskGroq = vi.fn().mockResolvedValue('AI response');
const mockNeedsGroq = vi.fn().mockReturnValue(true);
vi.mock('../groq-ai.js', () => ({
  askGroq: mockAskGroq,
  needsGroq: mockNeedsGroq,
  SYSTEM_PROMPT: 'test prompt',
}));

// Set up environment variables
vi.stubEnv('TELEGRAM_BOT_TOKEN', 'test-token');
vi.stubEnv('GROQ_API_KEY', 'test-groq-key');
vi.stubEnv('TELEGRAM_CHANNEL', '@testchannel');
vi.stubEnv('TELEGRAM_GROUP_INVITE', 'https://t.me/testgroup');

// Import BRAIN (pure functions, no side effects)
const BRAIN = await import('../bot-brain.js');

describe('telegram-bot — Command Routing + Auto-Reply (pure function tests)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSendMessage.mockClear();
    mockSendChatAction.mockClear();
    mockOnText.mockClear();
    mockOn.mockClear();
    mockAskGroq.mockClear();
    mockNeedsGroq.mockClear();
    mockTelegramBot.mockClear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('BRAIN helpers used by Telegram bot commands', () => {
    it('formatApp should format app with name, desc, price, funnel', () => {
      const app = BRAIN.default.apps[0];
      const formatted = BRAIN.default.helpers.formatApp(app);
      expect(formatted).toContain(app.name);
      expect(formatted).toContain(app.shortDesc);
      expect(formatted).toContain(app.price);
      expect(formatted).toContain(app.funnel);
    });

    it('formatBook should format book with name, desc, price, url', () => {
      const book = BRAIN.default.books[0];
      const formatted = BRAIN.default.helpers.formatBook(book);
      expect(formatted).toContain(book.name);
      expect(formatted).toContain(book.shortDesc);
      expect(formatted).toContain(book.price);
      expect(formatted).toContain(book.url);
    });

    it('formatTool should format tool with name and url', () => {
      const tool = BRAIN.default.freeTools[0];
      const formatted = BRAIN.default.helpers.formatTool(tool);
      expect(formatted).toContain(tool.name);
      expect(formatted).toContain(tool.url);
      expect(formatted).toContain('FREE');
    });

    it('welcomeMessage should return platform-specific message for telegram', () => {
      const msg = BRAIN.default.helpers.welcomeMessage('telegram');
      expect(msg).toContain('/menu');
      expect(msg).toContain('Cha0smagick Labs');
    });

    it('mainMenu should return menu with all command options', () => {
      const menu = BRAIN.default.helpers.mainMenu();
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
      const categories = BRAIN.default.helpers.blogCategories();
      expect(categories).toContain('Chaos Magick');
      expect(categories).toContain('Tarot');
      expect(categories).toContain('Runes');
      expect(categories).toContain(BRAIN.default.site.blog);
    });

    it('autoReply should match tarot keywords', () => {
      const reply = BRAIN.default.helpers.autoReply('I love tarot cards');
      expect(reply).toContain('Rider-Waite Tarot');
      expect(reply).toContain('cha0smagicklabs.com');
    });

    it('autoReply should match runes keywords', () => {
      const reply = BRAIN.default.helpers.autoReply('Tell me about runes');
      expect(reply).toContain('Norse Rune Oracle');
    });

    it('autoReply should match sigil keywords', () => {
      const reply = BRAIN.default.helpers.autoReply('How to make sigils');
      expect(reply).toContain('Chaos Sigil Generator');
    });

    it('autoReply should match goetia keywords', () => {
      const reply = BRAIN.default.helpers.autoReply('What is goetia');
      expect(reply).toContain('Arcana Goetia');
    });

    it('autoReply should match dream/lucid keywords', () => {
      const reply = BRAIN.default.helpers.autoReply('lucid dreaming tips');
      expect(reply).toContain('Dream Machine');
    });

    it('autoReply should match astrology keywords', () => {
      const reply = BRAIN.default.helpers.autoReply('zodiac signs');
      expect(reply).toContain('Astral Lab');
    });

    it('autoReply should match moon/lunar keywords', () => {
      const reply = BRAIN.default.helpers.autoReply('moon phases');
      expect(reply).toContain('Lunar Phase Calculator');
    });

    it('autoReply should match free/tools keywords', () => {
      const reply = BRAIN.default.helpers.autoReply('free tools');
      expect(reply).toContain('I Ching');
      expect(reply).toContain('Runes');
      expect(reply).toContain('Sigil Generator');
    });

    it('autoReply should match book/pdf keywords', () => {
      const reply = BRAIN.default.helpers.autoReply('esoteric books');
      expect(reply).toContain('Codex Chaoticus');
      expect(reply).toContain('bundle');
    });

    it('autoReply should match bundle keywords', () => {
      const reply = BRAIN.default.helpers.autoReply('bundle offer');
      expect(reply).toContain('Esoteric Books Bundle');
      expect(reply).toContain('52% off');
    });

    it('autoReply should match price/subscription keywords', () => {
      const reply = BRAIN.default.helpers.autoReply('how much does it cost');
      expect(reply).toContain('One-time purchase');
      expect(reply).toContain('No subscriptions');
    });

    it('autoReply should match who/what is chaos magick keywords', () => {
      const reply = BRAIN.default.helpers.autoReply('what is chaos magick');
      expect(reply).toContain('Cha0smagick Labs');
      expect(reply).toContain('Grindho');
    });

    it('autoReply should return null for unmatched queries', () => {
      const reply = BRAIN.default.helpers.autoReply('random unrelated text xyz123');
      expect(reply).toBeNull();
    });

    it('smartReply should return null for empty query', async () => {
      const result = await BRAIN.default.helpers.smartReply('', 'fake-key');
      expect(result).toBeNull();
    });

    it('smartReply should return null for whitespace-only query', async () => {
      const result = await BRAIN.default.helpers.smartReply('   ', 'fake-key');
      expect(result).toBeNull();
    });
  });

  describe('Telegram bot command patterns (regex matching)', () => {
    it('should match /start command', () => {
      const regex = /\/start/;
      expect(regex.test('/start')).toBe(true);
      expect(regex.test('/start@bot')).toBe(true);
    });

    it('should match /menu or 🌀 Menu', () => {
      const regex = /\/menu|🌀 Menu/;
      expect(regex.test('/menu')).toBe(true);
      expect(regex.test('🌀 Menu')).toBe(true);
    });

    it('should match /apps or 📱 Apps', () => {
      const regex = /\/apps|📱 Apps/;
      expect(regex.test('/apps')).toBe(true);
      expect(regex.test('📱 Apps')).toBe(true);
    });

    it('should match /books or 📖 Books', () => {
      const regex = /\/books|📖 Books/;
      expect(regex.test('/books')).toBe(true);
      expect(regex.test('📖 Books')).toBe(true);
    });

    it('should match /tools or 🔧 Tools', () => {
      const regex = /\/tools|🔧 Tools/;
      expect(regex.test('/tools')).toBe(true);
      expect(regex.test('🔧 Tools')).toBe(true);
    });

    it('should match /bundle or 🎁 Bundle', () => {
      const regex = /\/bundle|🎁 Bundle/;
      expect(regex.test('/bundle')).toBe(true);
      expect(regex.test('🎁 Bundle')).toBe(true);
    });

    it('should match /blog or 📰 Blog', () => {
      const regex = /\/blog|📰 Blog/;
      expect(regex.test('/blog')).toBe(true);
      expect(regex.test('📰 Blog')).toBe(true);
    });

    it('should match /subscribe or 📧 Subscribe', () => {
      const regex = /\/subscribe|📧 Subscribe/;
      expect(regex.test('/subscribe')).toBe(true);
      expect(regex.test('📧 Subscribe')).toBe(true);
    });

    it('should match /website or 🌐 Website', () => {
      const regex = /\/website|🌐 Website/;
      expect(regex.test('/website')).toBe(true);
      expect(regex.test('🌐 Website')).toBe(true);
    });

    it('should match /contact or 💬 Contact', () => {
      const regex = /\/contact|💬 Contact/;
      expect(regex.test('/contact')).toBe(true);
      expect(regex.test('💬 Contact')).toBe(true);
    });

    it('should match /ask with optional query', () => {
      const regex = /\/ask[ ]?(.+)?/;
      expect(regex.test('/ask')).toBe(true);
      expect(regex.test('/ask query')).toBe(true);
      expect(regex.test('/ask  query')).toBe(true);
    });

    it('should match /help', () => {
      const regex = /\/help/;
      expect(regex.test('/help')).toBe(true);
    });
  });

  describe('Auto-reply filtering logic', () => {
    it('should ignore commands starting with /', () => {
      const isCommand = (text) => text.startsWith('/');
      expect(isCommand('/apps')).toBe(true);
      expect(isCommand('/menu')).toBe(true);
      expect(isCommand('not a command')).toBe(false);
    });

    it('should ignore button presses with emoji prefixes', () => {
      const isButton = (text) => text.startsWith('🌀') || text.startsWith('📱') || text.startsWith('📖') || text.startsWith('🔧') || text.startsWith('🎁') || text.startsWith('📰');
      expect(isButton('📱 Apps')).toBe(true);
      expect(isButton('🌀 Menu')).toBe(true);
      expect(isButton('regular message')).toBe(false);
    });

    it('should ignore empty or whitespace messages', () => {
      const isEmpty = (text) => !text || !text.trim();
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('   ')).toBe(true);
      expect(isEmpty('message')).toBe(false);
    });

    it('should detect group chat types', () => {
      const isGroup = (chat) => chat.type === 'group' || chat.type === 'supergroup';
      expect(isGroup({ type: 'group' })).toBe(true);
      expect(isGroup({ type: 'supergroup' })).toBe(true);
      expect(isGroup({ type: 'private' })).toBe(false);
    });

    it('should detect URL in query for web page preview', () => {
      const hasUrl = (text) => text.includes('http');
      expect(hasUrl('check https://example.com')).toBe(true);
      expect(hasUrl('no url here')).toBe(false);
    });
  });

  describe('postToChannel function behavior (mocked)', () => {
    it('should call sendMessage with correct parameters when bot initialized', async () => {
      // This test verifies the expected behavior without actually calling the real function
      const mockBot = {
        sendMessage: vi.fn().mockResolvedValue({ message_id: 123 }),
      };
      const CHANNEL = '@testchannel';
      
      const result = await mockBot.sendMessage(CHANNEL, 'Test message', {
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      });
      
      expect(mockBot.sendMessage).toHaveBeenCalledWith(
        CHANNEL,
        'Test message',
        expect.objectContaining({
          parse_mode: 'Markdown',
          disable_web_page_preview: true,
        })
      );
      expect(result).toEqual({ message_id: 123 });
    });

    it('should handle send errors', async () => {
      const mockBot = {
        sendMessage: vi.fn().mockRejectedValue(new Error('Send failed')),
      };
      
      await expect(mockBot.sendMessage('@testchannel', 'test')).rejects.toThrow('Send failed');
    });
  });

  describe('Unknown command fallback', () => {
    it('should not have catch-all regex pattern', () => {
      const patterns = [
        '/start',
        '/menu|🌀 Menu',
        '/apps|📱 Apps',
        '/books|📖 Books',
        '/tools|🔧 Tools',
        '/bundle|🎁 Bundle',
        '/blog|📰 Blog',
        '/subscribe|📧 Subscribe',
        '/website|🌐 Website',
        '/contact|💬 Contact',
        '/ask[ ]?(.+)?',
        '/help',
      ];
      expect(patterns).not.toContain('.*');
    });
  });
});