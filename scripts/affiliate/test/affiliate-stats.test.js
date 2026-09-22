import { describe, it, expect } from 'vitest';
import mod from '../../affiliate-stats.js';

const { pseudoId, rateFor, aggregateEvents } = mod;

describe('affiliate-stats — agregación y anonimización (2.5.3)', () => {
  const rates = { rates: { apps: 0.30, 'books-bundle': 0.40 }, default_rate: 0.30 };

  it('pseudoId es estable, anónimo y sensible a mayúsculas/espacios', () => {
    const id1 = pseudoId('a@example.com');
    const id2 = pseudoId('A@Example.com ');
    expect(id1).toBe(id2);
    expect(id1).toHaveLength(10);
    expect(id1).not.toContain('@');
    expect(id1).toMatch(/^[0-9a-f]{10}$/);
  });

  it('rateFor usa la tasa del producto y cae a default_rate', () => {
    expect(rateFor('apps', rates)).toBe(0.30);
    expect(rateFor('books-bundle', rates)).toBe(0.40);
    expect(rateFor('unknown-product', rates)).toBe(0.30);
    expect(rateFor(undefined, rates)).toBe(0.30);
  });

  it('agrega clicks, conversiones y earnings por afiliado', () => {
    const events = [
      { type: 'click', affiliate: 'a@example.com' },
      { type: 'click', affiliate: 'a@example.com' },
      { type: 'conversion', affiliate: 'a@example.com', product: 'apps', amount: 3.99 },
      { type: 'conversion', affiliate: 'a@example.com', product: 'books-bundle', amount: 19.99 },
    ];
    const { affiliates, totals } = aggregateEvents(events, rates);
    expect(affiliates).toHaveLength(1);
    expect(affiliates[0].clicks).toBe(2);
    expect(affiliates[0].conversions).toBe(2);
    expect(affiliates[0].earnings).toBe(9.19); // 3.99*0.30 + 19.99*0.40
    expect(affiliates[0].convRate).toBe(1);
    expect(totals.clicks).toBe(2);
    expect(totals.conversions).toBe(2);
    expect(totals.earnings).toBe(9.19);
  });

  it('producto desconocido usa default_rate y convRate 0 sin clicks', () => {
    const events = [
      { type: 'conversion', affiliate: 'b@example.com', product: 'unknown', amount: 50 },
      { type: 'conversion', affiliate: 'c@example.com', product: 'apps', amount: 10 },
    ];
    const { affiliates } = aggregateEvents(events, rates);
    const b = affiliates.find((s) => s.id === pseudoId('b@example.com'));
    const c = affiliates.find((s) => s.id === pseudoId('c@example.com'));
    expect(b.earnings).toBe(15); // 50 × default 0.30
    expect(c.convRate).toBe(0); // guard división por cero
  });

  it('ignora eventos inválidos y no revienta con entrada vacía', () => {
    expect(aggregateEvents([], rates).affiliates).toHaveLength(0);
    expect(aggregateEvents(null, rates).totals.clicks).toBe(0);
    const { affiliates } = aggregateEvents([{ type: 'click' }, { foo: 'bar' }], rates);
    expect(affiliates).toHaveLength(0);
  });

  it('ordena afiliados por earnings descendente', () => {
    const events = [
      { type: 'conversion', affiliate: 'low@example.com', product: 'apps', amount: 3.99 },
      { type: 'conversion', affiliate: 'high@example.com', product: 'books-bundle', amount: 19.99 },
    ];
    const { affiliates } = aggregateEvents(events, rates);
    expect(affiliates[0].id).toBe(pseudoId('high@example.com'));
    expect(affiliates[1].id).toBe(pseudoId('low@example.com'));
  });
});
