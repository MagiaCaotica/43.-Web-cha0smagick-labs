import { describe, it, expect, beforeEach, vi } from 'vitest';

let ga4;

beforeEach(async () => {
  vi.resetModules();
  ga4 = await import('../../ga4-mp.js');
});

describe('ga4-mp purchase contract', () => {
  it('builds a purchase event with the required transaction fields', () => {
    const payload = ga4.buildPurchaseEvent({
      orderId: 'HP_TEST_123',
      totalValue: 29.99,
      currency: 'USD',
      productId: 'bundle_books',
      productName: 'Books Bundle',
      itemPrice: 29.99,
      affiliateId: 'aff_test',
    }, 'client_test.123');

    expect(payload).toMatchObject({
      client_id: 'client_test.123',
      events: [{
        name: 'purchase',
        params: {
          transaction_id: 'HP_TEST_123',
          value: 29.99,
          currency: 'USD',
          product_id: 'bundle_books',
          product_name: 'Books Bundle',
          affiliate_id: 'aff_test',
          items: [{
            item_id: 'bundle_books',
            item_name: 'Books Bundle',
            price: 29.99,
            quantity: 1,
          }],
        },
      }],
    });
  });

  it('hashes buyer email without including the raw address in the payload', () => {
    const payload = ga4.buildPurchaseEvent({
      orderId: 'HP_TEST_HASH',
      totalValue: 4.99,
      currency: 'USD',
      productId: 'codex-chaoticus',
      productName: 'Codex Chaoticus',
      buyerEmail: '  Buyer@Example.com  ',
    }, 'client_test.456');
    const serialized = JSON.stringify(payload);
    const hash = payload.events[0].params.buyer_email_hash;

    expect(hash).toMatch(/^[a-f0-9]{16}$/);
    expect(serialized).not.toContain('Buyer@Example.com');
    expect(serialized).not.toContain('buyer@example.com');
  });

  it('rejects a purchase without orderId or totalValue', async () => {
    const result = await ga4.sendPurchaseEvent(
      { orderId: '', totalValue: 0 },
      {
        dryRun: true,
        ga4MeasurementId: 'G-TEST',
        ga4MpApiSecret: 'test-secret',
        ga4ClientId: 'client_test.789',
      },
    );

    expect(result).toMatchObject({ success: false, clientId: 'client_test.789' });
    expect(result.error).toBe('Datos de compra incompletos');
  });

  it('supports a dry run without contacting GA4', async () => {
    const result = await ga4.sendPurchaseEvent(
      {
        orderId: 'HP_TEST_DRY',
        totalValue: 9.99,
        currency: 'USD',
        productId: 'psi-gym',
        productName: 'PSI GYM',
      },
      {
        dryRun: true,
        ga4MeasurementId: 'G-TEST',
        ga4MpApiSecret: 'test-secret',
        ga4ClientId: 'client_test.000',
      },
    );

    expect(result).toMatchObject({
      success: true,
      dryRun: true,
      clientId: 'client_test.000',
    });
  });
});
