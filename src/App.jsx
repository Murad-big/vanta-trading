import { useEffect, useState } from 'react';
import { Brand, Coin, Icon } from './components/Icons.jsx';
import Terminal from './components/Terminal.jsx';
import { MARKETS, money } from './lib/markets.js';
import { copy } from './lib/i18n.js';

export default function App() {
  const [lang, setLang] = useState('en');
  const [paused, setPaused] = useState(false);
  const [menu, setMenu] = useState(false);
  const [symbol, setSymbol] = useState('BTC');
  const t = copy[lang];

  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  useEffect(() => {
    document.documentElement.style.scrollBehavior = paused ? 'auto' : '';
    return () => { document.documentElement.style.scrollBehavior = ''; };
  }, [paused]);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const chooseMarket = symbol => { setSymbol(symbol); const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches; document.getElementById('terminal').scrollIntoView({ behavior: paused || reducedMotion ? 'instant' : 'smooth' }); };

  return <div className={`site ${paused ? 'motion-paused' : ''} ${lang === 'ru' ? 'lang-ru' : ''}`}>
    <a className="skip-link" href="#main">{t.skip}</a>
    <header className="header" id="top">
      <a href="#top" className="brand-link" aria-label="Vanta home"><Brand /></a>
      <nav className={menu ? 'navigation is-open' : 'navigation'} aria-label={lang === 'en' ? 'Main navigation' : 'Главное меню'}>
        <a href="#markets" onClick={() => setMenu(false)}>{t.markets}</a>
        <a href="#why-vanta" onClick={() => setMenu(false)}>{t.why}</a>
        <a href="#terminal" onClick={() => setMenu(false)}>{t.terminal}</a>
      </nav>
      <div className="header-actions">
        <button className="language" onClick={() => setLang(lang === 'en' ? 'ru' : 'en')} aria-label={lang === 'en' ? 'Switch to Russian' : 'Switch to English'}>{lang.toUpperCase()}<Icon name="chevron" size={14}/></button>
        <a href="#terminal" className="button button-outline nav-cta">{t.launch}<Icon /></a>
        <button className="icon-button menu-toggle" aria-label={t.menu} aria-expanded={menu} onClick={() => setMenu(!menu)}><Icon name={menu ? 'close' : 'menu'} /></button>
      </div>
    </header>
    <main id="main">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <h1 id="hero-title"><span>{t.hero[0]}</span><span className="lime">{t.hero[1]}</span><span className="lime">{t.hero[2]}</span></h1>
          <p>{t.intro}<br/>{t.sub}</p>
          <div className="hero-actions"><a href="#terminal" className="button button-primary">{t.start}<Icon /></a><a href="#markets" className="text-link">{t.explore}<Icon name="down" /></a></div>
        </div>
        <div className="hero-art" aria-hidden="true"><img src={`${import.meta.env.BASE_URL}assets/hero-ribbon.webp`} alt="" fetchPriority="high" width="1448" height="1086" /></div>
        <a className="orbit-badge" href="#terminal" aria-label={t.launchTerminal}><svg viewBox="0 0 140 140" aria-hidden="true"><defs><path id="orbit" d="M70,70m-52,0a52,52 0 1,1 104,0a52,52 0 1,1 -104,0" /></defs><text><textPath href="#orbit" startOffset="0%">BUILT FOR THE NEXT MOVE · BUILT FOR THE NEXT MOVE · </textPath></text></svg><Icon size={35}/></a>
      </section>
      <section className="market-strip" id="markets" aria-label={t.sample}>
        <div className="ticker-window"><div className="ticker-track">{[0, 1].map(copyIndex => <div className="ticker-set" key={copyIndex} aria-hidden={copyIndex === 1 || undefined}>{MARKETS.map(market => <button key={market.symbol} className="ticker-item" tabIndex={copyIndex ? -1 : 0} onClick={() => chooseMarket(market.symbol)} aria-label={`${market.name} ${t.terminal}`}><Coin symbol={market.symbol}/><span>{market.symbol}</span><span className="ticker-price">{money(market.price)}</span><span className={market.change > 0 ? 'positive' : 'negative'}>{market.change > 0 ? '+' : ''}{market.change}%</span></button>)}</div>)}</div></div>
        <div className="ticker-label"><span>{t.sample}</span><button className="icon-button" aria-label={paused ? t.play : t.pause} onClick={() => setPaused(!paused)}><Icon name={paused ? 'play' : 'pause'} size={15}/></button></div>
      </section>
      <section className="terminal-section section-wrap" id="terminal" aria-labelledby="terminal-heading">
        <div className="section-heading reveal"><h2 id="terminal-heading">{t.marketTitle[0]}<br/><span className="lime">{t.marketTitle[1]}</span></h2><p>{t.marketIntro}<br/>{t.marketSub}</p></div>
        <Terminal t={t} symbol={symbol} setSymbol={setSymbol} paused={paused}/>
        <div className="terminal-caption"><span>{t.demoNote}</span><span className="mono">TRADE&nbsp; // &nbsp;TEST&nbsp; // &nbsp;IMPROVE</span></div>
      </section>
      <section className="why-section section-wrap" id="why-vanta" aria-labelledby="why-heading">
        <div className="eyebrow reveal">{t.focus}</div>
        <div className="section-heading reveal"><h2 id="why-heading">{t.less}<br/><span className="lime">{t.more}</span></h2><p>{t.whyIntro}</p></div>
        <div className="feature-band">{t.features.map(([title, description], i) => <article className="feature reveal" key={i}><span className="feature-number mono">0{i + 1}</span><Icon name={['chart', 'sliders', 'globe'][i]} size={46}/><h3>{title}</h3><p>{description}</p></article>)}</div>
        <div className="final-cta reveal"><h2>{t.next}<br/><span className="lime">{t.yours}</span></h2><a href="#terminal" className="button button-primary">{t.launchTerminal}<Icon size={26}/></a></div>
      </section>
    </main>
    <footer className="footer section-wrap"><div className="footer-main"><a href="#top" className="brand-link" aria-label="Vanta home"><Brand/></a><nav aria-label="Footer"><a href="#markets">{t.markets}</a><a href="#terminal">{t.terminal}</a><a href="#top">{t.top}<Icon size={16}/></a></nav></div><div className="footer-bottom"><span>© 2026 Vanta</span><button className="motion-control" onClick={() => setPaused(!paused)}><Icon name={paused ? 'play' : 'pause'} size={13}/>{paused ? t.play : t.pause}</button><span>{t.disclaimer}</span></div></footer>
  </div>;
}
