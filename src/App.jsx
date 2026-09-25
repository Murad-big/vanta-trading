import { useEffect, useRef, useState } from 'react';
import { Brand, Coin, Icon } from './components/Icons.jsx';
import Terminal from './components/Terminal.jsx';
import { MARKETS, money } from './lib/markets.js';
import { copy } from './lib/i18n.js';
import MotionText from './motion/MotionText.jsx';
import ParticleField from './motion/ParticleField.jsx';
import useMotionScene from './motion/useMotionScene.js';
import { useMotionPreferences } from './motion/useMotionPreferences.js';

export default function App() {
  const [lang, setLang] = useState('en');
  const [paused, setPaused] = useState(false);
  const [menu, setMenu] = useState(false);
  const [symbol, setSymbol] = useState('BTC');
  const rootRef = useRef(null);
  const reducedMotion = useMotionPreferences();
  const motionEnabled = !paused && !reducedMotion;
  const t = copy[lang];
  useMotionScene(rootRef, motionEnabled);

  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  useEffect(() => {
    document.documentElement.style.scrollBehavior = !motionEnabled ? 'auto' : '';
    return () => { document.documentElement.style.scrollBehavior = ''; };
  }, [motionEnabled]);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); }
    }), { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const chooseMarket = symbol => { setSymbol(symbol); const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches; document.getElementById('terminal').scrollIntoView({ behavior: paused || reducedMotion ? 'instant' : 'smooth' }); };

  return <div ref={rootRef} className={`site ${!motionEnabled ? 'motion-paused' : ''} ${lang === 'ru' ? 'lang-ru' : ''}`}>
    <div className="scroll-progress" aria-hidden="true" />
    <div className="cursor-halo" aria-hidden="true"><div /></div>
    <a className="skip-link" href="#main">{t.skip}</a>
    <header className="header" id="top">
      <a href="#top" className="brand-link" aria-label="Vanta home"><Brand /></a>
      <nav className={menu ? 'navigation is-open' : 'navigation'} aria-label={lang === 'en' ? 'Main navigation' : 'Главное меню'}>
        <a href="#markets" onClick={() => setMenu(false)}>{t.markets}</a>
        <a href="#why-vanta" onClick={() => setMenu(false)}>{t.why}</a>
        <a href="#terminal" onClick={() => setMenu(false)}>{t.terminal}</a>
      </nav>
      <div className="header-actions">
        <button className="icon-button motion-toggle" aria-label={paused ? t.play : t.pause} aria-pressed={paused} onClick={() => setPaused(!paused)}><Icon name={paused ? 'play' : 'pause'} size={15}/></button>
        <button className="language" onClick={() => setLang(lang === 'en' ? 'ru' : 'en')} aria-label={lang === 'en' ? 'Switch to Russian' : 'Switch to English'}>{lang.toUpperCase()}<Icon name="chevron" size={14}/></button>
        <a href="#terminal" className="button button-outline nav-cta">{t.launch}<Icon /></a>
        <button className="icon-button menu-toggle" aria-label={t.menu} aria-expanded={menu} onClick={() => setMenu(!menu)}><Icon name={menu ? 'close' : 'menu'} /></button>
      </div>
    </header>
    <main id="main">
      <section className="hero" aria-labelledby="hero-title">
        <ParticleField enabled={motionEnabled}/>
        <div className="hero-copy">
          <h1 id="hero-title" key={lang}><MotionText>{t.hero[0]}</MotionText><MotionText className="lime" delay={160}>{t.hero[1]}</MotionText><MotionText className="lime" delay={290}>{t.hero[2]}</MotionText></h1>
          <p>{t.intro}<br/>{t.sub}</p>
          <div className="hero-actions"><a href="#terminal" className="button button-primary">{t.start}<Icon /></a><a href="#markets" className="text-link">{t.explore}<Icon name="down" /></a></div>
        </div>
        <div className="hero-art" aria-hidden="true"><div className="ribbon-perspective"><img src={`${import.meta.env.BASE_URL}assets/hero-ribbon.webp`} alt="" fetchPriority="high" width="1448" height="1086" /></div></div>
        <div className="orbital-markets" aria-hidden="true">{['BTC', 'ETH', 'SOL'].map((asset, i) => <div className={`market-orbit market-orbit-${i}`} key={asset}><div className="orbital-coin"><Coin symbol={asset}/><span>{asset}</span></div></div>)}</div>
        <a className="orbit-badge" href="#terminal" aria-label={t.launchTerminal}><svg viewBox="0 0 140 140" aria-hidden="true"><defs><path id="orbit" d="M70,70m-52,0a52,52 0 1,1 104,0a52,52 0 1,1 -104,0" /></defs><text><textPath href="#orbit" startOffset="0%">BUILT FOR THE NEXT MOVE · BUILT FOR THE NEXT MOVE · </textPath></text></svg><Icon size={35}/></a>
      </section>
      <section className="market-strip" id="markets" aria-label={t.sample}>
        <div className="ticker-window"><div className="ticker-track">{[0, 1].map(copyIndex => <div className="ticker-set" key={copyIndex} aria-hidden={copyIndex === 1 || undefined}>{MARKETS.map(market => <button key={market.symbol} className="ticker-item" tabIndex={copyIndex ? -1 : 0} onClick={() => chooseMarket(market.symbol)} aria-label={`${market.name} ${t.terminal}`}><Coin symbol={market.symbol}/><span>{market.symbol}</span><span className="ticker-price">{money(market.price)}</span><span className={market.change > 0 ? 'positive' : 'negative'}>{market.change > 0 ? '+' : ''}{market.change}%</span></button>)}</div>)}</div></div>
        <div className="ticker-label"><span>{t.sample}</span><button className="icon-button" aria-label={paused ? t.play : t.pause} onClick={() => setPaused(!paused)}><Icon name={paused ? 'play' : 'pause'} size={15}/></button></div>
      </section>
      <section className="terminal-section section-wrap" id="terminal" aria-labelledby="terminal-heading">
        <div className="section-heading reveal"><h2 id="terminal-heading"><MotionText words>{t.marketTitle[0]}</MotionText><MotionText words className="lime" delay={130}>{t.marketTitle[1]}</MotionText></h2><p>{t.marketIntro}<br/>{t.marketSub}</p></div>
        <div className="terminal-entry reveal"><Terminal t={t} symbol={symbol} setSymbol={setSymbol} paused={!motionEnabled}/></div>
        <div className="terminal-caption"><span>{t.demoNote}</span><span className="mono">TRADE&nbsp; // &nbsp;TEST&nbsp; // &nbsp;IMPROVE</span></div>
      </section>
      <section className="why-section section-wrap" id="why-vanta" aria-labelledby="why-heading">
        <div className="eyebrow reveal">{t.focus}</div>
        <div className="section-heading reveal"><h2 id="why-heading"><MotionText words>{t.less}</MotionText><MotionText words className="lime" delay={130}>{t.more}</MotionText></h2><p>{t.whyIntro}</p></div>
        <div className="feature-band">{t.features.map(([title, description], i) => <article className="feature reveal" key={i}><span className="feature-number mono">0{i + 1}</span><Icon name={['chart', 'sliders', 'globe'][i]} size={46}/><h3>{title}</h3><p>{description}</p></article>)}</div>
        <div className="final-cta reveal"><h2><MotionText words>{t.next}</MotionText><MotionText words className="lime" delay={140}>{t.yours}</MotionText></h2><a href="#terminal" className="button button-primary">{t.launchTerminal}<Icon size={26}/></a></div>
      </section>
    </main>
    <footer className="footer section-wrap"><div className="footer-main"><a href="#top" className="brand-link" aria-label="Vanta home"><Brand/></a><nav aria-label="Footer"><a href="#markets">{t.markets}</a><a href="#terminal">{t.terminal}</a><a href="#top">{t.top}<Icon size={16}/></a></nav></div><div className="footer-bottom"><span>© 2026 Vanta</span><button className="motion-control" onClick={() => setPaused(!paused)}><Icon name={paused ? 'play' : 'pause'} size={13}/>{paused ? t.play : t.pause}</button><span>{t.disclaimer}</span></div></footer>
  </div>;
}
