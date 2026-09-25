import { MARKETS } from './markets.js';

export const INITIAL_BALANCE = 10000;
export const initialState = () => ({ balance: INITIAL_BALANCE, positions: [], orders: [], history: [], prices: Object.fromEntries(MARKETS.map(m => [m.symbol, m.price])), tick: 0, notice: null });
export const pnl = (position, price) => (price - position.entry) * position.quantity * (position.side === 'long' ? 1 : -1);
export const shouldFill = (order, price) => order.side === 'long' ? price <= order.limit : price >= order.limit;

export function validateOrder(order, balance) {
  if (!Number.isFinite(order.margin) || order.margin < 1 || order.margin > balance || ![1, 2, 3, 5, 10].includes(order.leverage) || !['long', 'short'].includes(order.side) || !MARKETS.some(m => m.symbol === order.symbol)) return 'invalid';
  if (!['market', 'limit'].includes(order.type) || (order.type === 'limit' && (!Number.isFinite(order.limit) || order.limit <= 0))) return 'invalidLimit';
  return null;
}

const positionFrom = (order, price) => ({ ...order, entry: price, quantity: order.margin * order.leverage / price });

export function tradingReducer(state, action) {
  if (action.type === 'reset') return { ...initialState(), notice: 'resetNotice' };
  if (action.type === 'clearNotice') return { ...state, notice: null };
  if (action.type === 'open') {
    const order = action.order;
    const error = validateOrder(order, state.balance);
    if (error) return { ...state, notice: error };
    if (state.positions.length + state.orders.length >= 20) return { ...state, notice: 'maxOrders' };
    const price = state.prices[order.symbol];
    const immediate = order.type === 'market' || shouldFill(order, price);
    return { ...state, balance: state.balance - order.margin, positions: immediate ? [...state.positions, positionFrom(order, price)] : state.positions, orders: immediate ? state.orders : [...state.orders, order], notice: immediate ? 'opened' : 'placed' };
  }
  if (action.type === 'close') {
    const position = state.positions.find(p => p.id === action.id);
    if (!position) return state;
    const profit = pnl(position, state.prices[position.symbol]);
    return { ...state, balance: state.balance + position.margin + profit, positions: state.positions.filter(p => p.id !== action.id), history: [{ ...position, status: 'closed', profit }, ...state.history].slice(0, 50), notice: 'closeNotice' };
  }
  if (action.type === 'cancel') {
    const order = state.orders.find(o => o.id === action.id);
    if (!order) return state;
    return { ...state, balance: state.balance + order.margin, orders: state.orders.filter(o => o.id !== action.id), history: [{ ...order, status: 'cancelled', profit: 0 }, ...state.history].slice(0, 50), notice: 'cancelNotice' };
  }
  if (action.type === 'tick') {
    const tick = state.tick + 1;
    const prices = Object.fromEntries(MARKETS.map((m, i) => [m.symbol, m.price * (1 + Math.sin(tick * 0.37 + i) * 0.0009 + Math.sin(tick * 0.11) * 0.0005)]));
    const filled = state.orders.filter(order => shouldFill(order, prices[order.symbol]));
    return { ...state, tick, prices, orders: state.orders.filter(order => !shouldFill(order, prices[order.symbol])), positions: [...state.positions, ...filled.map(order => positionFrom(order, prices[order.symbol]))], notice: filled.length ? 'opened' : state.notice };
  }
  return state;
}
