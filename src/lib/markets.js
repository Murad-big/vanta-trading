export const MARKETS = [
  { symbol: 'BTC', name: 'Bitcoin', price: 67432.8, change: 2.84, seed: 17 },
  { symbol: 'ETH', name: 'Ethereum', price: 3521.64, change: 1.67, seed: 31 },
  { symbol: 'SOL', name: 'Solana', price: 172.38, change: 5.21, seed: 53 },
  { symbol: 'AVAX', name: 'Avalanche', price: 36.92, change: -0.82, seed: 73 },
];

export const money = (value, digits = 2) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);
export const number = value => new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(value);

export function candles(market, timeframe) {
  let seed = market.seed + ['1H', '4H', '1D', '1W'].indexOf(timeframe) * 41;
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const rows = [];
  let last = market.price * 0.83;
  for (let i = 0; i < 65; i++) {
    const open = last;
    const close = open + (random() - 0.42) * market.price * 0.028;
    rows.push({ open, close, high: Math.max(open, close) + random() * market.price * 0.012, low: Math.min(open, close) - random() * market.price * 0.01, volume: 10 + random() * 65 });
    last = close;
  }
  const scale = market.price / rows.at(-1).close;
  return rows.map(row => ({ ...row, open: row.open * scale, close: row.close * scale, high: row.high * scale, low: row.low * scale }));
}
