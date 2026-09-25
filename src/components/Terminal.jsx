import { useEffect, useReducer, useRef, useState } from 'react';
import { Brand, Coin, Icon } from './Icons.jsx';
import Chart from './Chart.jsx';
import OrderForm from './OrderForm.jsx';
import { MARKETS, money } from '../lib/markets.js';
import { initialState, pnl, shouldFill, tradingReducer } from '../lib/trading.js';
import AnimatedNumber from '../motion/AnimatedNumber.jsx';

export default function Terminal({ t, symbol, setSymbol, paused }) {
  const [state, dispatch] = useReducer(tradingReducer, undefined, initialState);
  const [timeframe, setTimeframe] = useState('1D');
  const [tab, setTab] = useState('positions');
  const [expanded, setExpanded] = useState(false);
  const frameRef = useRef(null);
  const market = MARKETS.find(m => m.symbol === symbol);
  const price = state.prices[symbol];
  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => { if (!document.hidden) dispatch({ type: 'tick' }); }, 4000);
    return () => clearInterval(interval);
  }, [paused]);
  useEffect(() => {
    if (!expanded) return;
    const previous = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = 'hidden';
    frameRef.current.querySelector('.expand-control').focus();
    const escape = event => {
      if (event.key === 'Escape') setExpanded(false);
      if (event.key === 'Tab') {
        const focusable = [...frameRef.current.querySelectorAll('button, input, select, a[href]')].filter(el => !el.disabled && el.getClientRects().length);
        const first = focusable[0], last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', escape);
    return () => { document.body.style.overflow = previous; document.removeEventListener('keydown', escape); previousFocus?.focus(); };
  }, [expanded]);
  const rows = state[tab];
  return <div ref={frameRef} role={expanded ? 'dialog' : undefined} aria-modal={expanded ? true : undefined} aria-label={expanded ? t.terminal : undefined} className={`terminal-frame ${expanded ? 'expanded' : ''}`}>
    <div className="terminal-topbar"><div className="terminal-brand"><Brand compact/><span>VANTA TERMINAL</span></div><div className="terminal-status"><span className="status-dot"/>{t.demo}</div><button className="icon-button expand-control" aria-label={expanded ? t.exitFull : t.full} aria-pressed={expanded} onClick={() => setExpanded(!expanded)}><Icon name={expanded ? 'close' : 'expand'} size={19}/></button></div>
    <div className="terminal-workspace"><div className="chart-panel"><div className="chart-toolbar"><div className="market-select"><Coin symbol={symbol}/><select aria-label={t.markets} value={symbol} onChange={e => setSymbol(e.target.value)}>{MARKETS.map(m => <option key={m.symbol} value={m.symbol}>{m.symbol} / USD</option>)}</select><Icon name="chevron" size={14}/></div><div className="market-detail"><span>{market.name} {t.perpetual}</span><strong className="mono"><AnimatedNumber key={symbol} value={price} paused={paused}/></strong><span className={market.change > 0 ? 'positive' : 'negative'}>{market.change > 0 ? '+' : ''}{market.change}%</span></div></div>
      <div className="chart-subbar"><span className="mono">{symbol}USD <span className="muted">· {t.demo}</span></span><div className="timeframes" role="group" aria-label="Timeframe">{['1H', '4H', '1D', '1W'].map(tf => <button key={tf} className={timeframe === tf ? 'active' : ''} aria-pressed={timeframe === tf} onClick={() => setTimeframe(tf)}>{tf}</button>)}</div></div>
      <Chart market={market} timeframe={timeframe} price={price} t={t}/>
    </div><OrderForm key={symbol} t={t} symbol={symbol} price={price} balance={state.balance} onOrder={order => { dispatch({ type: 'open', order }); setTab(order.type === 'limit' && !shouldFill(order, price) ? 'orders' : 'positions'); }}/></div>
    <div className="positions-panel"><div className="positions-toolbar"><div className="position-tabs" role="group" aria-label={t.positions}>{['positions', 'orders', 'history'].map(v => <button key={v} className={tab === v ? 'active' : ''} aria-pressed={tab === v} onClick={() => setTab(v)}>{t[v]}{v !== 'history' && <span>({state[v].length})</span>}</button>)}</div><button className="reset-button" onClick={() => dispatch({ type: 'reset' })}>{t.reset}</button></div>
      {rows.length === 0 ? <div className="empty-position" key={tab}><Icon name="document" size={29}/><p>{tab === 'positions' ? t.empty : tab === 'orders' ? t.noOrders : t.noHistory}</p>{tab === 'positions' && <span>{t.emptySub}</span>}</div> : <div className="positions-list">{rows.map(row => {
        const profit = tab === 'positions' ? pnl(row, state.prices[row.symbol]) : row.profit;
        return <div className="position-row" key={row.id}><div className="position-asset"><Coin symbol={row.symbol}/><div><strong>{row.symbol} / USD</strong><span className={row.side === 'long' ? 'positive' : 'negative'}>{row.side === 'long' ? t.buy : t.sell} · {row.leverage}x</span></div></div><div><span className="row-label">{tab === 'orders' ? t.limitPrice : t.entry}</span><span className="mono">{money(row.entry ?? row.limit)}</span></div><div><span className="row-label">{t.margin}</span><span className="mono">{money(row.margin)}</span></div><div><span className="row-label">{tab === 'positions' ? t.pnl : tab === 'orders' ? t.orders : t[row.status]}</span><span className={`mono ${profit >= 0 ? 'positive' : 'negative'}`}>{tab === 'orders' ? t.pending : `${profit >= 0 ? '+' : ''}${money(profit)}`}</span></div>{tab !== 'history' && <button className="row-action" onClick={() => dispatch({ type: tab === 'positions' ? 'close' : 'cancel', id: row.id })}>{tab === 'positions' ? t.close : t.cancel}<Icon name="close" size={12}/></button>}</div>;
      })}</div>}
    </div>
    {state.notice && <div className="terminal-notice" role="status"><Icon name="check" size={16}/><span>{t[state.notice]}</span><button className="icon-button" aria-label={t.close} onClick={() => dispatch({ type: 'clearNotice' })}><Icon name="close" size={14}/></button></div>}
  </div>;
}
