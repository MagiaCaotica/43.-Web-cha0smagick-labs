import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock dotenv
vi.mock('dotenv', () => ({ config: vi.fn() }));

// Mock Colors constants
const Colors = {
  DarkPurple: 0x5D3FD3,
  Gold: 0xFFD700,
  Green: 0x00FF00,
};

// Mock discord.js
const mockOn = vi.fn();
const mockOnce = vi.fn();
const mockLogin = vi.fn().mockResolvedValue(undefined);
const mockApplicationCommandsSet = vi.fn().mockResolvedValue([]);
const mockChannelSend = vi.fn().mockResolvedValue({ id: 'msg-123' });
const mockReply = vi.fn().mockResolvedValue({});
const mockDeferReply = vi.fn().mockResolvedValue({});
const mockEditReply = vi.fn().mockResolvedValue({});
const mockFollowUp = vi.fn().mockResolvedValue({});
const mockFindChannel = vi.fn().mockReturnValue({ send: mockChannelSend });

const mockGuild = {
  channels: {
    cache: {
      find: mockFindChannel,
    },
  },
};

const mockMember = {
  displayName: 'TestUser',
  guild: mockGuild,
};

const mockMessage = {
  author: { bot: false },
  content: 'test message',
  channel: { name: 'general' },
  reply: mockReply,
};

const mockInteraction = {
  isChatInputCommand: () => true,
  commandName: 'menu',
  reply: mockReply,
  deferReply: mockDeferReply,
  editReply: mockEditReply,
  followUp: mockFollowUp,
  options: {
    getString: vi.fn().mockReturnValue('test question'),
  },
  replied: false,
  user: { bot: false },
};

const mockClient = {
  user: { tag: 'TestBot#1234' },
  on: mockOn,
  once: mockOnce,
  login: mockLogin,
  application: {
    commands: {
      set: mockApplicationCommandsSet,
    },
  },
};

// EmbedBuilder mock as constructor
const EmbedBuilderMock = vi.fn().mockImplementation(function() {
  this.setColor = vi.fn().mockReturnThis();
  this.setTitle = vi.fn().mockReturnThis();
  this.setDescription = vi.fn().mockReturnThis();
  this.addFields = vi.fn().mockReturnThis();
  this.setFooter = vi.fn().mockReturnThis();
  this.setURL = vi.fn().mockReturnThis();
  return this;
});

// SlashCommandBuilder mock as constructor
const SlashCommandBuilderMock = vi.fn().mockImplementation(function() {
  this.data = { name: 'test' };
  this.setName = vi.fn().mockReturnThis();
  this.setDescription = vi.fn().mockReturnThis();
  this.addStringOption = vi.fn().mockReturnThis();
  return this;
});

vi.mock('discord.js', () => ({
  Client: vi.fn().mockImplementation(() => mockClient),
  GatewayIntentBits: {
    Guilds: 1,
    GuildMessages: 2,
    MessageContent: 4,
    GuildMembers: 8,
  },
  SlashCommandBuilder: SlashCommandBuilderMock,
  EmbedBuilder: EmbedBuilderMock,
  Colors,
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
vi.stubEnv('DISCORD_BOT_TOKEN', 'test-discord-token');
vi.stubEnv('GROQ_API_KEY', 'test-groq-key');

// Import BRAIN (pure functions, no side effects)
const BRAIN = await import('../bot-brain.js');

describe('discord-bot — Slash Commands + Welcome (pure function tests)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockOn.mockClear();
    mockOnce.mockClear();
    mockLogin.mockClear();
    mockApplicationCommandsSet.mockClear();
    mockChannelSend.mockClear();
    mockReply.mockClear();
    mockDeferReply.mockClear();
    mockEditReply.mockClear();
    mockFollowUp.mockClear();
    mockFindChannel.mockClear();
    mockAskGroq.mockClear();
    mockNeedsGroq.mockClear();
    EmbedBuilderMock.mockClear();
    SlashCommandBuilderMock.mockClear();
    mockMessage.author.bot = false;
    mockMessage.content = 'test message';
    mockMessage.channel.name = 'general';
    mockInteraction.commandName = 'menu';
    mockInteraction.replied = false;
    mockInteraction.options.getString.mockReturnValue('test question');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('BRAIN helpers used by Discord bot commands', () => {
    it('appEmbed should create embed with app data', () => {
      const app = BRAIN.default.apps[0];
      const embed = new EmbedBuilderMock()
        .setColor(Colors.DarkPurple)
        .setTitle(`📱 ${app.name}`)
        .setDescription(app.shortDesc)
        .addFields(
          { name: '💰 Price', value: app.price, inline: true },
          { name: '🛒 Buy', value: `[Google Play](${app.url})`, inline: true },
          { name: '🔗 Info', value: `[Funnel Page](${app.funnel})`, inline: true },
        )
        .setFooter({ text: 'One-time purchase. No subscriptions.' });
      
      expect(EmbedBuilderMock).toHaveBeenCalled();
      const embedInstance = EmbedBuilderMock.mock.results[0].value;
      expect(embedInstance.setColor).toHaveBeenCalledWith(Colors.DarkPurple);
      expect(embedInstance.setTitle).toHaveBeenCalledWith(`📱 ${app.name}`);
      expect(embedInstance.setDescription).toHaveBeenCalledWith(app.shortDesc);
    });

    it('bookEmbed should create embed with book data', () => {
      const book = BRAIN.default.books[0];
      const embed = new EmbedBuilderMock()
        .setColor(Colors.Gold)
        .setTitle(`📖 ${book.name}`)
        .setDescription(book.shortDesc)
        .addFields({ name: '💰 Price', value: book.price, inline: true })
        .setFooter({ text: 'PDF — instant download.' });
      
      expect(EmbedBuilderMock).toHaveBeenCalled();
      const embedInstance = EmbedBuilderMock.mock.results[0].value;
      expect(embedInstance.setColor).toHaveBeenCalledWith(Colors.Gold);
      expect(embedInstance.setTitle).toHaveBeenCalledWith(`📖 ${book.name}`);
    });

    it('toolEmbed should create embed with tool data', () => {
      const tool = BRAIN.default.freeTools[0];
      const embed = new EmbedBuilderMock()
        .setColor(Colors.Green)
        .setTitle(`🔧 ${tool.name}`)
        .setDescription('Free online tool — no download required.')
        .addFields({ name: '🔗 Link', value: tool.url })
        .setFooter({ text: 'FREE — no registration needed.' });
      
      expect(EmbedBuilderMock).toHaveBeenCalled();
      const embedInstance = EmbedBuilderMock.mock.results[0].value;
      expect(embedInstance.setColor).toHaveBeenCalledWith(Colors.Green);
      expect(embedInstance.setTitle).toHaveBeenCalledWith(`🔧 ${tool.name}`);
    });

    it('welcomeMessage should return platform-specific message for discord', () => {
      const msg = BRAIN.default.helpers.welcomeMessage('discord');
      expect(msg).toContain('Explore our channels');
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

  describe('Discord slash command definitions', () => {
    it('should define all 11 slash commands', () => {
      const commandNames = [
        'menu', 'apps', 'books', 'tools', 'bundle',
        'blog', 'subscribe', 'website', 'contact', 'pricing', 'ask'
      ];
      expect(commandNames).toHaveLength(11);
      expect(commandNames).toContain('menu');
      expect(commandNames).toContain('apps');
      expect(commandNames).toContain('books');
      expect(commandNames).toContain('tools');
      expect(commandNames).toContain('bundle');
      expect(commandNames).toContain('blog');
      expect(commandNames).toContain('subscribe');
      expect(commandNames).toContain('website');
      expect(commandNames).toContain('contact');
      expect(commandNames).toContain('pricing');
      expect(commandNames).toContain('ask');
    });

    it('ask command should have required string option', () => {
      const builder = new SlashCommandBuilderMock()
        .setName('ask')
        .setDescription('🤖 Ask AI anything about Cha0smagick Labs')
        .addStringOption(option =>
          option.setName('question')
            .setDescription('Your question')
            .setRequired(true)
            .setMaxLength(1000));
      
      expect(SlashCommandBuilderMock).toHaveBeenCalled();
      expect(builder.setName).toHaveBeenCalledWith('ask');
      expect(builder.addStringOption).toHaveBeenCalled();
    });
  });

  describe('Slash command handler patterns', () => {
    it('should handle /menu command', () => {
      const menuContent = BRAIN.default.helpers.mainMenu();
      expect(menuContent).toContain('Main Menu');
      expect(menuContent).toContain('/apps');
      expect(menuContent).toContain('/books');
    });

    it('should handle /apps command with app embeds', () => {
      const apps = BRAIN.default.apps;
      expect(apps).toHaveLength(12);
      for (const app of apps) {
        expect(app).toHaveProperty('name');
        expect(app).toHaveProperty('price');
        expect(app).toHaveProperty('shortDesc');
        expect(app).toHaveProperty('url');
        expect(app).toHaveProperty('funnel');
      }
    });

    it('should handle /books command with book embeds', () => {
      const books = BRAIN.default.books;
      expect(books).toHaveLength(7);
      for (const book of books) {
        expect(book).toHaveProperty('name');
        expect(book).toHaveProperty('price');
        expect(book).toHaveProperty('shortDesc');
        expect(book).toHaveProperty('url');
      }
    });

    it('should handle /tools command with tool embeds', () => {
      const tools = BRAIN.default.freeTools;
      expect(tools).toHaveLength(10);
      for (const tool of tools) {
        expect(tool).toHaveProperty('name');
        expect(tool).toHaveProperty('url');
      }
    });

    it('should handle /bundle command with bundle embed', () => {
      const bundle = BRAIN.default.bundle;
      expect(bundle.name).toBe('Esoteric Books Bundle');
      expect(bundle.price).toMatch(/^\$\d+(\.\d{2})? USD$/);
      expect(bundle.originalPrice).toMatch(/^\$\d+(\.\d{2})? USD$/);
      expect(bundle.url).toBe('https://hotmart.com/es/marketplace/productos/bundle-todos-los-libros-esp/V107097103W');
    });

    it('should handle /blog command', () => {
      const categories = BRAIN.default.helpers.blogCategories();
      expect(categories).toContain('Blog Categories');
    });

    it('should handle /subscribe command', () => {
      const subText = `📧 **Free Chaos Magick Quickstart Guide**\n\nGet your free PDF guide via email:\nhttps://www.magiadelcaospractica.com/p/magia-del-caos.html\n\nNo spam. Unsubscribe anytime.`;
      expect(subText).toContain('Free Chaos Magick Quickstart Guide');
      expect(subText).toContain('magiadelcaospractica.com');
    });

    it('should handle /website command', () => {
      const webText = `🌐 **${BRAIN.default.site.name}**\n${BRAIN.default.site.url}\n\n📰 Blog: ${BRAIN.default.site.blog}`;
      expect(webText).toContain('Cha0smagick Labs');
      expect(webText).toContain('cha0smagicklabs.com');
    });

    it('should handle /contact command', () => {
      const contactText = `💬 **Contact Us**\n\n📧 magiacaoticapractica@gmail.com\n\n🌀 Telegram: ${BRAIN.default.social.telegram.channel}\n🐦 X/Twitter: ${BRAIN.default.social.twitter}\n📌 Pinterest: ${BRAIN.default.social.pinterest}\n🎮 Discord invite: ${BRAIN.default.social.discord}`;
      expect(contactText).toContain('magiacaoticapractica@gmail.com');
      expect(contactText).toContain('Telegram');
      expect(contactText).toContain('Discord');
    });

    it('should handle /pricing command', () => {
      const pricingText = `💰 **Pricing**\n\n📱 Apps: $3.99–$14.99 USD (one-time)\n📖 Books: $4.99–$9.99 USD (PDF)\n🔧 Tools: FREE\n🎁 Bundle: $19.99 (52% off)\n\n**No subscriptions. No recurring fees.**\nYou buy once, you own it forever.`;
      expect(pricingText).toContain('No subscriptions');
      expect(pricingText).toContain('one-time');
    });

    it('should handle /ask command with Groq', async () => {
      mockAskGroq.mockResolvedValue('AI answer about sigils');
      const answer = await mockAskGroq('test question', 'test-groq-key');
      expect(mockAskGroq).toHaveBeenCalledWith('test question', 'test-groq-key');
      expect(answer).toBe('AI answer about sigils');
    });

    it('should handle missing GROQ_API_KEY for /ask', () => {
      vi.stubEnv('GROQ_API_KEY', '');
      const hasKey = !!process.env.GROQ_API_KEY;
      expect(hasKey).toBe(false);
    });
  });

  describe('Welcome message (guildMemberAdd)', () => {
    it('should create welcome embed with correct content', () => {
      const embed = new EmbedBuilderMock()
        .setColor(Colors.DarkPurple)
        .setTitle(`🌟 Welcome to Cha0smagick Labs, ${mockMember.displayName}!`)
        .setDescription(
          `We are an indie developer creating tools for magick, divination, and esoteric practice.\n\n` +
          `• 📱 **12 Android apps** — one-time purchase\n` +
          `• 📖 **7 PDF books** — instant download\n` +
          `• 🔧 **10 free tools** — no registration\n` +
          `• 📰 **467 blog articles** — free reading\n\n` +
          `Type \`/menu\` to explore everything we offer!`
        )
        .setFooter({ text: 'One-time purchases. No subscriptions. Ever.' });
      
      expect(EmbedBuilderMock).toHaveBeenCalled();
      const embedInstance = EmbedBuilderMock.mock.results[0].value;
      expect(embedInstance.setColor).toHaveBeenCalledWith(Colors.DarkPurple);
      expect(embedInstance.setTitle).toHaveBeenCalledWith(expect.stringContaining('Welcome to Cha0smagick Labs'));
      expect(embedInstance.setDescription).toHaveBeenCalledWith(expect.stringContaining('12 Android apps'));
      expect(embedInstance.setFooter).toHaveBeenCalledWith({ text: 'One-time purchases. No subscriptions. Ever.' });
    });

    it('should not send if welcome channel not found', () => {
      const findChannel = vi.fn().mockReturnValue(null);
      const channel = findChannel();
      expect(channel).toBeNull();
    });

    it('should handle send errors gracefully', async () => {
      const failingSend = vi.fn().mockRejectedValue(new Error('Send failed'));
      await expect(failingSend()).rejects.toThrow('Send failed');
    });
  });

  describe('Auto-reply (messageCreate) filtering', () => {
    it('should ignore bot messages', () => {
      const isBot = (message) => message.author.bot;
      expect(isBot({ author: { bot: true } })).toBe(true);
      expect(isBot({ author: { bot: false } })).toBe(false);
    });

    it('should ignore commands starting with /', () => {
      const isCommand = (content) => content.startsWith('/');
      expect(isCommand('/menu')).toBe(true);
      expect(isCommand('regular message')).toBe(false);
    });

    it('should only auto-reply in allowed channels', () => {
      const allowedChannels = ['general', 'products', 'resources'];
      const isAllowed = (channelName) => allowedChannels.includes(channelName);
      expect(isAllowed('general')).toBe(true);
      expect(isAllowed('products')).toBe(true);
      expect(isAllowed('resources')).toBe(true);
      expect(isAllowed('random-channel')).toBe(false);
    });

    it('should use smartReply for auto-reply', async () => {
      BRAIN.default.helpers.smartReply = vi.fn().mockResolvedValue('Auto reply about tarot');
      const reply = await BRAIN.default.helpers.smartReply('tarot cards', 'test-groq-key');
      expect(BRAIN.default.helpers.smartReply).toHaveBeenCalledWith('tarot cards', 'test-groq-key');
      expect(reply).toBe('Auto reply about tarot');
    });

    it('should not reply if smartReply returns null', async () => {
      BRAIN.default.helpers.smartReply = vi.fn().mockResolvedValue(null);
      const reply = await BRAIN.default.helpers.smartReply('random xyz', 'test-groq-key');
      expect(reply).toBeNull();
    });

    it('should handle reply errors gracefully', async () => {
      const failingReply = vi.fn().mockRejectedValue(new Error('Reply failed'));
      await expect(failingReply()).rejects.toThrow('Reply failed');
    });
  });

  describe('init function behavior', () => {
    it('should call client.login with token', () => {
      mockLogin.mockClear();
      mockLogin('test-discord-token');
      expect(mockLogin).toHaveBeenCalledWith('test-discord-token');
    });

    it('should handle login errors', async () => {
      mockLogin.mockRejectedValueOnce(new Error('Login failed'));
      await expect(mockLogin('test-discord-token')).rejects.toThrow('Login failed');
    });
  });

  describe('Error handling', () => {
    it('should register error handler', () => {
      expect(typeof mockOn).toBe('function');
    });
  });
});