import { useEffect, useMemo, useState } from 'react';
import { candles, number } from '../lib/markets.js';

export default function Chart({ market, timeframe, price, t }) {
  const baseData = useMemo(() => candles(market, timeframe), [market, timeframe]);
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width:680px)').matches);
  useEffect(() => {
    const media = window.matchMedia('(max-width:680px)');
    const change = event => setMobile(event.matches);
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, []);
  const series = mobile ? baseData.slice(-36) : baseData;
  const data = series.map((candle, i) => i === series.length - 1 ? { ...candle, close: price, high: Math.max(candle.high, price), low: Math.min(candle.low, price) } : candle);
  const [hover, setHover] = useState(null);
  const width = mobile ? 390 : 820;
  const plotRight = width - 74;
  const gap = (plotRight - 36) / (data.length - 1);
  const min = Math.min(...data.map(d => d.low)) * 0.995;
  const max = Math.max(...data.map(d => d.high)) * 1.008;
  const y = value => 24 + (max - value) / (max - min) * 262;
  const current = hover === null ? data.at(-1) : data[hover] ?? data.at(-1);
  const labels = { '1H': ['09:00', '09:15', '09:30', '09:45', '10:00'], '4H': ['06:00', '07:00', '08:00', '09:00', '10:00'], '1D': ['00:00', '06:00', '12:00', '18:00', '23:59'], '1W': ['MON', 'TUE', 'WED', 'THU', 'FRI'] };
  return <div className="chart" onMouseLeave={() => setHover(null)}>
    <div className="chart-ohlc mono"><span>O <b>{number(current.open)}</b></span><span>H <b>{number(current.high)}</b></span><span>L <b>{number(current.low)}</b></span><span>C <b className="positive">{number(current.close)}</b></span></div>
    <svg viewBox={`0 0 ${width} 390`} role="img" aria-label={`${market.name}: ${t.chart}, ${timeframe}, ${number(price)} USD`} className="price-chart">
      <title>{market.name} · {timeframe} · {t.demo}</title>
      {[0, 1, 2, 3, 4, 5].map(i => <g key={i}><line x1="14" y1={25 + i * 52} x2={plotRight} y2={25 + i * 52} className="grid-line"/><text x={plotRight + 12} y={29 + i * 52} className="axis-label">{Math.round(max - i / 5 * (max - min)).toLocaleString('en-US')}</text></g>)}
      {[0, 1, 2, 3, 4, 5, 6].map(i => <line key={i} x1={25 + i * (plotRight - 44) / 6} y1="15" x2={25 + i * (plotRight - 44) / 6} y2="352" className="grid-line"/>)}
      <g className="candles" key={`${market.symbol}-${timeframe}`}>{data.map((d, i) => {
        const x = 22 + i * gap;
        const up = d.close >= d.open;
        return <g key={i} fill={up ? '#c5fa67' : '#8a8f8b'}><line x1={x} y1={y(d.high)} x2={x} y2={y(d.low)} stroke={up ? '#c5fa67' : '#8a8f8b'} strokeWidth="1"/><rect x={x - 3.1} y={y(Math.max(d.open, d.close))} width="6.2" height={Math.max(1.5, Math.abs(y(d.open) - y(d.close)))}/><rect x={x - 3.4} y={352 - d.volume * 0.62} width="6.8" height={d.volume * 0.62} opacity={up ? '.26' : '.18'}/><rect x={x - 5.5} y="0" width="11.1" height="354" fill="transparent" onMouseEnter={() => setHover(i)}/></g>;
      })}</g>
      <line x1="14" y1={y(price)} x2={plotRight} y2={y(price)} stroke="#c5fa67" strokeDasharray="3 5" opacity=".45"/>
      <rect x={plotRight + 3} y={y(price) - 10} width="71" height="20" rx="3" fill="#c5fa67"/><text x={plotRight + 38} y={y(price) + 3.5} textAnchor="middle" className="price-label">{number(price)}</text>
      {hover !== null && hover < data.length && <line x1={22 + hover * gap} y1="15" x2={22 + hover * gap} y2="352" stroke="#adb5a9" strokeDasharray="3 4" opacity=".5"/>}
      {labels[timeframe].map((label, i) => <text key={label} x={22 + i * (plotRight - 38) / 4} y="378" className="axis-label">{label}</text>)}
    </svg>
  </div>;
}
