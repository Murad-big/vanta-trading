import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, pnl, shouldFill, tradingReducer, validateOrder } from './trading.js';

const order = (overrides = {}) => ({ id: 'test-1', symbol: 'BTC', side: 'long', type: 'market', margin: 100, leverage: 2, limit: 67000, ...overrides });

test('opening and closing a market position conserves virtual balance at an unchanged price', () => {
  const opened = tradingReducer(initialState(), { type: 'open', order: order() });
  assert.equal(opened.balance, 9900);
  assert.equal(opened.positions.length, 1);
  assert.equal(opened.positions[0].quantity, 200 / opened.prices.BTC);
  const closed = tradingReducer(opened, { type: 'close', id: 'test-1' });
  assert.equal(closed.balance, 10000);
  assert.equal(closed.positions.length, 0);
  assert.equal(closed.history[0].status, 'closed');
  assert.deepEqual(tradingReducer(closed, { type: 'close', id: 'test-1' }), closed);
});

test('long and short P&L move in opposite directions', () => {
  const position = { side: 'long', entry: 100, quantity: 2 };
  assert.equal(pnl(position, 110), 20);
  assert.equal(pnl({ ...position, side: 'short' }, 110), -20);
});

test('pending limits reserve margin and cancellation releases it exactly once', () => {
  const opened = tradingReducer(initialState(), { type: 'open', order: order({ type: 'limit', limit: 60000 }) });
  assert.equal(opened.positions.length, 0);
  assert.equal(opened.orders.length, 1);
  assert.equal(opened.balance, 9900);
  const cancelled = tradingReducer(opened, { type: 'cancel', id: 'test-1' });
  assert.equal(cancelled.balance, 10000);
  assert.equal(cancelled.orders.length, 0);
  assert.deepEqual(tradingReducer(cancelled, { type: 'cancel', id: 'test-1' }), cancelled);
});

test('limit buy fills at or below limit, limit sell at or above limit', () => {
  assert.equal(shouldFill(order({ side: 'long', limit: 100 }), 99), true);
  assert.equal(shouldFill(order({ side: 'long', limit: 100 }), 101), false);
  assert.equal(shouldFill(order({ side: 'short', limit: 100 }), 101), true);
  assert.equal(shouldFill(order({ side: 'short', limit: 100 }), 99), false);
  const immediate = tradingReducer(initialState(), { type: 'open', order: order({ type: 'limit', limit: 70000 }) });
  assert.equal(immediate.positions.length, 1);
  assert.equal(immediate.orders.length, 0);
});

test('price tick fills a pending limit without charging margin twice', () => {
  const state = initialState();
  const limit = state.prices.BTC + 1;
  const pending = tradingReducer(state, { type: 'open', order: order({ type: 'limit', side: 'short', limit }) });
  assert.equal(pending.orders.length, 1);
  const filled = tradingReducer(pending, { type: 'tick' });
  assert.equal(filled.orders.length, 0);
  assert.equal(filled.positions.length, 1);
  assert.equal(filled.balance, 9900);
});

test('invalid and unaffordable orders never consume funds', () => {
  for (const margin of [-1, 0, 0.5, NaN, Infinity, 10001]) {
    assert.equal(validateOrder(order({ margin }), 10000), 'invalid');
    const state = tradingReducer(initialState(), { type: 'open', order: order({ margin }) });
    assert.equal(state.balance, 10000);
    assert.equal(state.positions.length, 0);
  }
  assert.equal(validateOrder(order({ type: 'limit', limit: 0 }), 10000), 'invalidLimit');
  assert.equal(validateOrder(order({ leverage: 100 }), 10000), 'invalid');
});

test('reset clears virtual orders, positions and history', () => {
  const state = tradingReducer(tradingReducer(initialState(), { type: 'open', order: order() }), { type: 'reset' });
  assert.equal(state.balance, 10000);
  assert.deepEqual(state.positions, []);
  assert.deepEqual(state.orders, []);
  assert.deepEqual(state.history, []);
});
