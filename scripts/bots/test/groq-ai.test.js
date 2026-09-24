import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock dotenv before importing groq-ai
vi.mock('dotenv', () => ({ config: vi.fn() }));

// Mock global fetch for Groq API calls
const mockFetch = vi.fn();
global.fetch = mockFetch;

const { askGroq, needsGroq, SYSTEM_PROMPT } = await import('../groq-ai.js');

describe('groq-ai — Classifier + Prompt Building', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('SYSTEM_PROMPT', () => {
    it('should be a non-empty string', () => {
      expect(typeof SYSTEM_PROMPT).toBe('string');
      expect(SYSTEM_PROMPT.length).toBeGreaterThan(100);
    });

    it('should contain key product information', () => {
      expect(SYSTEM_PROMPT).toContain('Cha0smagick Labs');
      expect(SYSTEM_PROMPT).toContain('Grindho');
      expect(SYSTEM_PROMPT).toContain('one-time purchase');
      expect(SYSTEM_PROMPT).toContain('no subscriptions');
    });

    it('should mention all 12 apps by name', () => {
      const appNames = [
        'PSI GYM',
        'Arcana Goetia',
        'Norse Rune Oracle',
        'Dream Machine',
        'Chaos Sigil Generator',
        'Astral Lab',
        'Eerie Roads',
        'I Ching Oracle',
        'Lucid Dream',
        'Lunar Phase Calculator',
        'Rider-Waite Tarot',
        'NOCTEM',
      ];
      for (const name of appNames) {
        expect(SYSTEM_PROMPT).toContain(name);
      }
    });

    it('should mention all 7 books by name', () => {
      const bookNames = [
        'Codex Chaoticus',
        'Tarot Chaos',
        'Magical Servitors Manual',
        'Treatise of Chaos Hunter Runes',
        'Ouija Cazadora',
        'Liber Lvpinux',
        'Mind The Gap',
      ];
      for (const name of bookNames) {
        expect(SYSTEM_PROMPT).toContain(name);
      }
    });

    it('should mention bundle price and discount', () => {
      expect(SYSTEM_PROMPT).toContain('$19.99');
      expect(SYSTEM_PROMPT).toContain('52%');
    });

    it('should mention free tools URLs', () => {
      expect(SYSTEM_PROMPT).toContain('iching-online.html');
      expect(SYSTEM_PROMPT).toContain('runes-online.html');
      expect(SYSTEM_PROMPT).toContain('sigil-generator.html');
    });

    it('should contain BTL sales strategy rules', () => {
      expect(SYSTEM_PROMPT).toContain('ESCUCHA');
      expect(SYSTEM_PROMPT).toContain('RECOMIENDA');
      expect(SYSTEM_PROMPT).toContain('VALOR');
      expect(SYSTEM_PROMPT).toContain('CTA');
    });
  });

  describe('needsGroq — Query Classifier', () => {
    it('should return false for short queries (< 3 words)', () => {
      expect(needsGroq('hi')).toBe(false);
      expect(needsGroq('hello there')).toBe(false);
      expect(needsGroq('tarot')).toBe(false);
      expect(needsGroq('runes')).toBe(false);
    });

    it('should return true for questions starting with question words (English)', () => {
      expect(needsGroq('what is tarot')).toBe(true);
      expect(needsGroq('how to use sigils')).toBe(true);
      expect(needsGroq('why choose this app')).toBe(true);
      expect(needsGroq('can you recommend')).toBe(true);
      expect(needsGroq('could you help me')).toBe(true);
      expect(needsGroq('would this work')).toBe(true);
      expect(needsGroq('should I buy')).toBe(true);
      expect(needsGroq('do you have')).toBe(true);
      expect(needsGroq('does it work')).toBe(true);
      expect(needsGroq('is it good')).toBe(true);
      expect(needsGroq('are there any')).toBe(true);
      expect(needsGroq('tell me about')).toBe(true);
      expect(needsGroq('explain how to')).toBe(true);
      expect(needsGroq('describe the app')).toBe(true);
    });

    it('should return true for questions starting with question words (Spanish)', () => {
      expect(needsGroq('qué es tarot')).toBe(true);
      expect(needsGroq('cómo usar sigilos')).toBe(true);
      expect(needsGroq('por qué elegir')).toBe(true);
      expect(needsGroq('cuál es mejor')).toBe(true);
      expect(needsGroq('cuándo sale nuevo')).toBe(true);
      expect(needsGroq('dónde comprar app')).toBe(true);
      expect(needsGroq('quién es grindho')).toBe(true);
      expect(needsGroq('puedes ayudarme por favor')).toBe(true);
      expect(needsGroq('quiero comprar app')).toBe(true);
      expect(needsGroq('necesito ayuda ya')).toBe(true);
      expect(needsGroq('busco información sobre')).toBe(true);
    });

    it('should return true for complex topic keywords (English)', () => {
      expect(needsGroq('difference between apps')).toBe(true);
      expect(needsGroq('recommend best app')).toBe(true);
      expect(needsGroq('comparison of books')).toBe(true);
      expect(needsGroq('your opinion on')).toBe(true);
      expect(needsGroq('help me choose')).toBe(true);
      expect(needsGroq('best for beginner')).toBe(true);
      expect(needsGroq('learning chaos magick')).toBe(true);
      expect(needsGroq('how to start')).toBe(true);
    });

    it('should return true for complex topic keywords (Spanish)', () => {
      expect(needsGroq('diferencia entre apps')).toBe(true);
      expect(needsGroq('recomiendas algo bueno')).toBe(true);
      expect(needsGroq('mejor opción para')).toBe(true);
      expect(needsGroq('comparación de libros')).toBe(true);
      expect(needsGroq('tu opinión sobre')).toBe(true);
      expect(needsGroq('cómo se usa esto')).toBe(true);
      expect(needsGroq('para qué sirve esto')).toBe(true);
      expect(needsGroq('principiante en magia')).toBe(true);
      expect(needsGroq('empezar con esto')).toBe(true);
      expect(needsGroq('aprender runas ahora')).toBe(true);
    });

    it('should return false for simple keyword queries', () => {
      expect(needsGroq('tarot app')).toBe(false);
      expect(needsGroq('runes price')).toBe(false);
      expect(needsGroq('sigil generator')).toBe(false);
      expect(needsGroq('goetia book')).toBe(false);
    });
  });

  describe('askGroq — API Call', () => {
    it('should throw error if apiKey is not provided', async () => {
      await expect(askGroq('test query', '')).rejects.toThrow('GROQ_API_KEY is required');
      await expect(askGroq('test query', null)).rejects.toThrow('GROQ_API_KEY is required');
      await expect(askGroq('test query', undefined)).rejects.toThrow('GROQ_API_KEY is required');
    });

    it('should call Groq API with correct parameters', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          choices: [{ message: { content: 'Test response from Groq' } }],
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await askGroq('What is tarot?', 'test-api-key');

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[0]).toBe('https://api.groq.com/openai/v1/chat/completions');
      expect(callArgs[1].method).toBe('POST');
      expect(callArgs[1].headers['Content-Type']).toBe('application/json');
      expect(callArgs[1].headers['Authorization']).toBe('Bearer test-api-key');

      const body = JSON.parse(callArgs[1].body);
      expect(body.model).toBe('llama-3.3-70b-versatile');
      expect(body.messages).toHaveLength(2);
      expect(body.messages[0].role).toBe('system');
      expect(body.messages[0].content).toBe(SYSTEM_PROMPT);
      expect(body.messages[1].role).toBe('user');
      expect(body.messages[1].content).toBe('What is tarot?');
      expect(body.temperature).toBe(0.7);
      expect(body.max_tokens).toBe(1024);

      expect(result).toBe('Test response from Groq');
    });

    it('should use custom options when provided', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          choices: [{ message: { content: 'Custom response' } }],
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await askGroq('test', 'key', { model: 'mixtral-8x7b-32768', temperature: 0.5, maxTokens: 512 });

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.model).toBe('mixtral-8x7b-32768');
      expect(body.temperature).toBe(0.5);
      expect(body.max_tokens).toBe(512);
    });

    it('should throw error on non-ok HTTP response', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
        text: async () => 'Unauthorized',
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(askGroq('test', 'key')).rejects.toThrow('Groq API error 401: Unauthorized');
    });

    it('should throw error on empty response content', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          choices: [{ message: { content: '' } }],
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(askGroq('test', 'key')).rejects.toThrow('Empty response from Groq API');
    });

    it('should throw error on missing choices in response', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ choices: [] }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(askGroq('test', 'key')).rejects.toThrow('Empty response from Groq API');
    });

    it('should throw error on network failure', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      await expect(askGroq('test', 'key')).rejects.toThrow('Groq query failed: Network error');
    });

    it('should re-throw Groq API errors without wrapping', async () => {
      const mockResponse = {
        ok: false,
        status: 429,
        text: async () => 'Rate limited',
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(askGroq('test', 'key')).rejects.toThrow('Groq API error 429: Rate limited');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty string query in askGroq', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          choices: [{ message: { content: 'Response to empty' } }],
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await askGroq('', 'key');
      expect(result).toBe('Response to empty');
    });

    it('should handle very long queries', async () => {
      const longQuery = 'a'.repeat(5000);
      const mockResponse = {
        ok: true,
        json: async () => ({
          choices: [{ message: { content: 'Response' } }],
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await askGroq(longQuery, 'key');
      expect(result).toBe('Response');
    });

    it('should handle special characters in query', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          choices: [{ message: { content: 'Response' } }],
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await askGroq('¿Cómo se usa? ¡Gracias! 🌟', 'key');
      expect(result).toBe('Response');
    });
  });
});