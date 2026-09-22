/**
 * webhook-flash-sale.test.js — Tests Flash Sale 20-slot limit enforcement (plan 2.4.10)
 *
 * Cubre: isFlashSalePurchase, readSlots, recordSlot (idempotente), enforceFlashSaleSlots
 * Aislamiento: CONFIG.slotFile/logDir redirigidos a tmpdir por test.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';

const ORIGINAL_ENV = { ...process.env };

let receiver;
let tmpDir;

async function loadReceiver() {
  vi.stubEnv('WEBHOOK_DRYRUN', 'true');
  vi.resetModules();
  receiver = await import('../../webhook-receiver.js');
}

describe('webhook-receiver Flash Sale slots (2.4.10)', () => {
  beforeEach(async () => {
    await loadReceiver();
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'flash-sale-test-'));
    // Redirigir persistencia del contador al tmpdir (CONFIG es objeto mutable)
    receiver.CONFIG.slotFile = path.join(tmpDir, 'flash-sale-slots.json');
    receiver.CONFIG.logDir = tmpDir;
    receiver.CONFIG.logFile = path.join(tmpDir, 'hotmart-purchases.jsonl');
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    process.env = { ...ORIGINAL_ENV };
    vi.unstubAllEnvs();
  });

  const purchase = (productId, orderId) => ({
    valid: true,
    orderId,
    productId,
    buyerEmail: 'test@example.com',
    buyerName: 'Test',
  });

  it('isFlashSalePurchase: true para el producto flash sale', () => {
    const productId = receiver.CONFIG.flashSaleProductId;
    expect(receiver.isFlashSalePurchase(purchase(productId, 'HP_1'))).toBe(true);
  });

  it('isFlashSalePurchase: false para otros productos o compras inválidas', () => {
    expect(receiver.isFlashSalePurchase(purchase('bundle_complete_apps', 'HP_2'))).toBe(false);
    expect(receiver.isFlashSalePurchase({ valid: false, productId: receiver.CONFIG.flashSaleProductId })).toBe(false);
  });

  it('readSlots: estado limpio cuando el archivo no existe', () => {
    const state = receiver.readSlots();
    expect(state).toEqual({ count: 0, orders: [], updatedAt: null });
  });

  it('recordSlot: incrementa el contador y persiste el estado', () => {
    const result = receiver.recordSlot(purchase(receiver.CONFIG.flashSaleProductId, 'HP_10'));
    expect(result.allowed).toBe(true);
    expect(result.alreadyCounted).toBe(false);
    expect(result.count).toBe(1);

    const state = JSON.parse(fs.readFileSync(receiver.CONFIG.slotFile, 'utf8'));
    expect(state.count).toBe(1);
    expect(state.orders).toEqual(['HP_10']);
    expect(typeof state.updatedAt).toBe('string');
  });

  it('recordSlot: idempotente para reintentos de la misma orden', () => {
    const productId = receiver.CONFIG.flashSaleProductId;
    receiver.recordSlot(purchase(productId, 'HP_20'));
    const retry = receiver.recordSlot(purchase(productId, 'HP_20'));
    expect(retry.alreadyCounted).toBe(true);
    expect(retry.count).toBe(1);

    const state = receiver.readSlots();
    expect(state.count).toBe(1);
    expect(state.orders.filter((id) => id === 'HP_20')).toHaveLength(1);
  });

  it('enforceFlashSaleSlots: permite mientras count < max', () => {
    const productId = receiver.CONFIG.flashSaleProductId;
    receiver.recordSlot(purchase(productId, 'HP_30'));
    const result = receiver.enforceFlashSaleSlots(purchase(productId, 'HP_31'));
    expect(result.allowed).toBe(true);
    expect(result.soldOut).toBe(false);
    expect(result.max).toBe(receiver.CONFIG.flashSaleMaxSlots);
  });

  it('enforceFlashSaleSlots: soldOut cuando count alcanza el límite', () => {
    receiver.CONFIG.slotFile = path.join(tmpDir, 'flash-sale-full.json');
    fs.writeFileSync(
      receiver.CONFIG.slotFile,
      JSON.stringify({ count: receiver.CONFIG.flashSaleMaxSlots, orders: ['HP_A'], updatedAt: new Date().toISOString() })
    );
    const result = receiver.enforceFlashSaleSlots(purchase(receiver.CONFIG.flashSaleProductId, 'HP_B'));
    expect(result.allowed).toBe(false);
    expect(result.soldOut).toBe(true);
    expect(result.count).toBe(receiver.CONFIG.flashSaleMaxSlots);
  });

  it('readSlots: estado limpio ante archivo corrupto (no lanza)', () => {
    receiver.CONFIG.slotFile = path.join(tmpDir, 'corrupt.json');
    fs.writeFileSync(receiver.CONFIG.slotFile, '{ no es json');
    expect(receiver.readSlots()).toEqual({ count: 0, orders: [], updatedAt: null });
  });
});
