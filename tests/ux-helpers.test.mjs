import test from 'node:test';
import assert from 'node:assert/strict';
import { codeFromName, formatDateTime, formatMoney, formatPhone, splitFullName, toNumber } from '../src/lib/format.ts';
import { computeTotals, filterProducts, parseAmount, productForEnter } from '../src/lib/pos.ts';
import { axisRequired, eyeFormula, normalizeDiopter, normalizePd, validateAxis, validateDiopter, validatePd } from '../src/lib/prescription.ts';
import { translateApiMessage } from '../src/lib/api-messages.ts';
import { auditActionLabel, auditActorName, auditDetail } from '../src/lib/audit-events.ts';

// Intl output uses narrow/no-break spaces in some ICU versions; compare on plain spaces.
const plain = (text) => text.replace(/[  ]/g, ' ');

test('money and numbers are formatted the Turkish way', () => {
  assert.equal(plain(formatMoney(1234.5)), '₺1.234,50');
  assert.equal(plain(formatMoney('99.9')), '₺99,90');
  assert.equal(formatMoney(null), '-');
  assert.equal(toNumber('12,5'), 12.5);
  assert.equal(toNumber('1.499,90'), 1499.9);
  assert.equal(toNumber('1499.90'), 1499.9, 'API decimals keep working');
  assert.equal(toNumber(' 250 '), 250);
  assert.equal(toNumber('abc'), null);
});

test('only ISO timestamps are treated as dates', () => {
  assert.match(formatDateTime('2026-11-10T09:30:00Z'), /2026/);
  assert.equal(formatDateTime('FIS-0001'), 'FIS-0001');
  assert.equal(formatDateTime(undefined), '-');
});

test('phone numbers are shown in the usual Turkish grouping', () => {
  assert.equal(formatPhone('05321112233'), '0532 111 22 33');
  assert.equal(formatPhone('+90 532 111 2233'), '+90 532 111 22 33');
  assert.equal(formatPhone('212-555'), '212-555', 'unknown shapes stay as typed');
  assert.equal(formatPhone(null), '');
});

test('names and codes', () => {
  assert.deepEqual(splitFullName('  Ayşe  Nur Yılmaz '), { firstName: 'Ayşe Nur', lastName: 'Yılmaz' });
  assert.equal(splitFullName('Ayşe'), null);
  assert.equal(codeFromName('Reçeteli Gözlük'), 'RECETELI_GOZLUK');
  assert.equal(codeFromName('  Işık / İnce  '), 'ISIK_INCE');
});

test('POS totals: prices include KDV, discounts never go below zero', () => {
  const lines = [{ unitPrice: 1000, quantity: 1 }, { unitPrice: 250, quantity: 2 }];
  assert.deepEqual(computeTotals(lines, 'PERCENT', 10, 20), { subtotal: 1500, discount: 150, total: 1350, tax: 225, net: 1125 });
  assert.equal(computeTotals(lines, 'FIXED', 5000, 20).total, 0, 'fixed discount is capped at the subtotal');
  assert.equal(computeTotals(lines, 'PERCENT', 150, 20).total, 0, 'percent is capped at 100');
  assert.equal(computeTotals(lines, 'PERCENT', 0, 0).tax, 0);
  assert.equal(computeTotals([{ unitPrice: 0.1, quantity: 3 }], 'FIXED', 0, 20).subtotal, 0.3, 'no float noise');
});

test('POS search and barcode Enter', () => {
  const products = [
    { id: '1', sku: 'RB-3025', name: 'Ray-Ban Aviator', category: 'Güneş Gözlüğü' },
    { id: '2', sku: 'RB-2140', name: 'Ray-Ban Wayfarer', category: 'Güneş Gözlüğü' },
    { id: '3', sku: 'LNS-1', name: 'Günlük Lens', category: 'Kontak Lens' },
  ];
  assert.equal(filterProducts(products, 'gunes').length, 2, 'accent-insensitive');
  assert.equal(filterProducts(products, '').length, 3);
  assert.equal(productForEnter(products, 'rb-2140')?.id, '2', 'exact SKU wins, any case');
  assert.equal(productForEnter(products, 'lens')?.id, '3', 'single match');
  assert.equal(productForEnter(products, 'ray'), null, 'ambiguous');
  assert.equal(parseAmount('1.234,50'), 1234.5);
  assert.equal(parseAmount('1234.5'), 1234.5);
  assert.ok(Number.isNaN(parseAmount('')));
});

test('prescription values are normalized and validated', () => {
  assert.equal(normalizeDiopter('1,25'), '+1.25');
  assert.equal(normalizeDiopter('-0.5'), '-0.50');
  assert.equal(normalizeDiopter('0'), '0.00');
  assert.equal(normalizePd('31 / 31'), '31/31');
  assert.equal(validateDiopter('-1.25'), null);
  assert.match(validateDiopter('-1.30'), /0.25/);
  assert.match(validateDiopter('+31'), /30/);
  assert.equal(validateAxis('180'), null);
  assert.ok(validateAxis('181'));
  assert.equal(validatePd('62'), null);
  assert.equal(validatePd('31/31'), null);
  assert.ok(validatePd('6'));
  assert.ok(axisRequired('-0.50', ''));
  assert.equal(axisRequired('0', ''), null);
  assert.equal(eyeFormula('-1.25', '-0.50', '90'), '-1.25 -0.50 × 90');
  assert.equal(eyeFormula('', '', ''), '—');
});

test('API errors are shown in Turkish', () => {
  assert.equal(translateApiMessage('SKU already exists'), 'Bu SKU / barkod başka bir üründe kullanılıyor.');
  assert.equal(translateApiMessage('Invalid status transition: RECEIVED -> DELIVERED'), 'Kayıt bu duruma doğrudan geçirilemez.');
  assert.equal(translateApiMessage('Something new'), null);
});

test('audit rows read as plain sentences', () => {
  const countRow = { action: 'INVENTORY_STOCK_CHANGED', resourceId: 'RB-1', afterJson: '{"movement":"ADJUST","delta":4}' };
  assert.equal(auditActionLabel(countRow), 'Stok sayımı yapıldı');
  assert.equal(auditDetail(countRow), 'RB-1, yeni stok 4');
  assert.equal(auditDetail({ action: 'INVENTORY_STOCK_CHANGED', resourceId: 'RB-1', afterJson: '{"movement":"OUT","delta":-2}' }), 'RB-1, 2 çıkış');
  assert.equal(auditDetail({ action: 'USER_ROLE_UPDATED', resourceId: 'mert', afterJson: '{"role":"ADMIN"}' }), 'mert, yeni rol: Yönetici');
  assert.equal(plain(auditDetail({ action: 'SALE_TRANSACTION_REFUNDED', resourceId: '0b6e1c1a-1111-4c4c-8888-123456789abc', afterJson: '{"refundAmount":150.5}' })), '₺150,50 iade');
  assert.equal(auditDetail({ action: 'CUSTOMER_DELETED', resourceId: '0b6e1c1a-1111-4c4c-8888-123456789abc', afterJson: '{"deleted":true}' }), null, 'no raw ids');
  assert.equal(auditDetail({ action: 'LOGIN_FAILED', resourceId: 'ayse', afterJson: 'not json' }), 'ayse');
  assert.equal(auditActionLabel({ action: 'SOMETHING_NEW' }), 'something new');
  assert.equal(auditActorName({ actorUserId: 'u1', actorRole: 'OWNER' }, { u1: 'owner' }), 'owner');
  assert.equal(auditActorName({ actorUserId: 'x', actorRole: 'SYSTEM' }, { x: 'ghost' }), null);
});
