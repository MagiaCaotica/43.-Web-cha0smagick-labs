import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import crypto from 'crypto';

const ORIGINAL_ENV = { ...process.env };
let receiver;

async function loadReceiver() {
  vi.stubEnv('WEBHOOK_DRYRUN', 'true');
  vi.resetModules();
  receiver = await import('../../webhook-receiver.js');
}

function approvedPayload(overrides = {}) {
  return {
    event: 'PURCHASE_COMPLETE',
    data: {
      order: {
        id: 'HP_CONTRACT_1',
        status: 'APPROVED',
        date: '2026-09-24T00:00:00.000Z',
        total_price: { value: 19.99, currency: 'USD' },
        buyer: { email: 'buyer@example.com', name: 'Test Buyer' },
        items: [{ product_id: 'bundle_test', name: 'Test Bundle', price: { value: 19.99 } }],
        affiliate_id: 'affiliate_1',
        ...overrides,
      },
    },
  };
}

describe('webhook-receiver purchase contract', () => {
  beforeEach(async () => {
    await loadReceiver();
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
    vi.unstubAllEnvs();
  });

  it('accepts the exact HMAC signature for the raw payload', () => {
    receiver.CONFIG.hotmartSecret = 'contract-secret';
    const payload = JSON.stringify(approvedPayload());
    const signature = `sha256=${crypto.createHmac('sha256', 'contract-secret').update(payload).digest('hex')}`;

    expect(receiver.validateHotmartSignature(payload, signature)).toBe(true);
    expect(receiver.validateHotmartSignature(`${payload} `, signature)).toBe(false);
  });

  it('extracts the approved purchase fields used by downstream actions', () => {
    const result = receiver.extractPurchaseData(JSON.stringify(approvedPayload()));

    expect(result.valid).toBe(true);
    expect(result.orderId).toBe('HP_CONTRACT_1');
    expect(result.totalValue).toBe(19.99);
    expect(result.currency).toBe('USD');
    expect(result.productId).toBe('bundle_test');
    expect(result.buyerEmail).toBe('buyer@example.com');
    expect(result.affiliateId).toBe('affiliate_1');
  });

  it('ignores events that are not approved purchase completions', () => {
    const result = receiver.extractPurchaseData(JSON.stringify({
      event: 'PURCHASE_COMPLETE',
      data: { order: { ...approvedPayload().data.order, status: 'PENDING' } },
    }));

    expect(result.valid).toBe(false);
    expect(result.reason).toContain('APPROVED');
  });

  it('returns a parse failure instead of throwing on malformed JSON', () => {
    const result = receiver.extractPurchaseData('{not-json');

    expect(result.valid).toBe(false);
    expect(result.reason).toContain('Error parseando JSON');
  });
});
