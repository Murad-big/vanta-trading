import { useState } from 'react';
import { money } from '../lib/markets.js';
import { validateOrder } from '../lib/trading.js';

export default function OrderForm({ t, balance, symbol, price, onOrder }) {
  const [side, setSide] = useState('long');
  const [type, setType] = useState('market');
  const [amount, setAmount] = useState('100');
  const [limit, setLimit] = useState(String(price.toFixed(2)));
  const [leverage, setLeverage] = useState(2);
  const [error, setError] = useState(null);
  const margin = Number(amount);
  const submit = event => {
    event.preventDefault();
    const order = { id: crypto.randomUUID(), symbol, side, type, margin, leverage, limit: Number(limit) };
    const invalid = validateOrder(order, balance);
    setError(invalid);
    if (!invalid) onOrder(order);
  };
  return <form className="order-form" onSubmit={submit} noValidate>
    <div className={`segmented side-selector ${side}`} role="group" aria-label={t.buy + ' / ' + t.sell}>
      <button type="button" aria-pressed={side === 'long'} className={side === 'long' ? 'selected' : ''} onClick={() => setSide('long')}>{t.buy}</button><button type="button" aria-pressed={side === 'short'} className={side === 'short' ? 'selected' : ''} onClick={() => setSide('short')}>{t.sell}</button>
    </div>
    <div className="order-type" role="group" aria-label={t.market + ' / ' + t.limit}>{['market', 'limit'].map(v => <button type="button" key={v} className={type === v ? 'active' : ''} aria-pressed={type === v} onClick={() => setType(v)}>{t[v]}</button>)}</div>
    <div className="balance-row"><span>{t.available}</span><span className="mono">{money(balance)}</span></div>
    <label className="input-label" htmlFor="order-size">{t.size}</label><div className={`input-wrap ${error === 'invalid' ? 'input-error' : ''}`}><input id="order-size" type="number" inputMode="decimal" min="1" step="0.01" value={amount} onChange={e => { setAmount(e.target.value); setError(null); }} aria-invalid={error === 'invalid'} aria-describedby={error ? 'order-error' : undefined}/><span>USD</span><button type="button" className="max-button" onClick={() => setAmount((Math.floor(balance * 100) / 100).toFixed(2))}>MAX</button></div>
    {type === 'limit' && <div className="limit-input"><label className="input-label" htmlFor="limit-price">{t.limitPrice}</label><div className="input-wrap"><input id="limit-price" type="number" inputMode="decimal" min="0.01" step="0.01" value={limit} onChange={e => { setLimit(e.target.value); setError(null); }}/><span>USD</span></div></div>}
    <label className="input-label leverage-label">{t.leverage}</label><div className="segmented leverage-selector" role="group" aria-label={t.leverage}>{[1, 2, 3, 5, 10].map(value => <button type="button" key={value} aria-pressed={leverage === value} className={leverage === value ? 'selected' : ''} onClick={() => setLeverage(value)}>{value}x</button>)}</div>
    <div className="order-summary"><div><span>{t.margin}</span><span className="mono">{money(Number.isFinite(margin) && margin > 0 ? margin : 0)}</span></div><div><span>{t.positionSize}</span><span className="mono">{money(Number.isFinite(margin) && margin > 0 ? margin * leverage : 0)}</span></div></div>
    {error && <p className="form-error" id="order-error" role="alert">{t[error]}</p>}
    <button type="submit" className={`submit-order ${side === 'short' ? 'short' : ''}`}>{type === 'market' ? t.open : t.place}</button>
  </form>;
}
