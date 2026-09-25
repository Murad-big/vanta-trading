export function Icon({ name = 'arrow', size = 20, ...props }) {
  const paths = {
    arrow: <><path d="M5 19 19 5M5 5h14v14" /></>,
    down: <><path d="M12 4v16m-6-6 6 6 6-6" /></>,
    chevron: <path d="m7 10 5 5 5-5" />,
    chart: <><path d="M4 20h16M7 16V9m5 7V4m5 12v-6" /></>,
    sliders: <><path d="M4 7h6m4 0h6M4 17h10m4 0h2" /><circle cx="12" cy="7" r="2" /><circle cx="16" cy="17" r="2" /></>,
    globe: <><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18" /></>,
    expand: <path d="M4 9V4h5m6 0h5v5m0 6v5h-5M9 20H4v-5" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    menu: <path d="M4 8h16M4 16h16" />,
    document: <><path d="M6 3h9l4 4v14H6zM15 3v5h4M9 12h7m-7 4h5" /></>,
    pause: <><path d="M8 5v14M16 5v14" /></>,
    play: <path d="m8 5 11 7-11 7z" />,
    check: <path d="m5 12 4 4L19 6" />,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}

export function Brand({ compact = false }) {
  return <span className="brand"><svg viewBox="0 0 38 32" aria-hidden="true"><path d="M16 3h8L10 29H2zM29 3h8L23 29h-8z" fill="currentColor" /></svg>{!compact && <span>VANTA</span>}</span>;
}

export function Coin({ symbol }) {
  return <span className={`coin coin-${symbol.toLowerCase()}`} aria-hidden="true">{symbol === 'BTC' ? '₿' : symbol === 'ETH' ? <svg viewBox="0 0 20 30"><path d="m10 0 9 15-9 5-9-5z" fill="#f4f5ee"/><path d="m1 17 9 13 9-13-9 5z" fill="#a2a6a5"/></svg> : symbol === 'SOL' ? <svg viewBox="0 0 24 24"><path d="m5 3-4 4h18l4-4zM1 10l4 4h18l-4-4zM5 17l-4 4h18l4-4z" fill="currentColor"/></svg> : 'A'}</span>;
}
