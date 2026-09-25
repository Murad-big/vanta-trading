# VANTA — Your edge. Never offline.

A responsive trading website with an original visual identity, motion design, English/Russian UI and a working paper-trading terminal. Inspired by the visual energy of [Reya](https://reya.xyz/), built independently with React and Vite.

## Run locally

Requires Node.js 20.19+ or 22.12+ and npm.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite, normally `http://127.0.0.1:5173`.

```sh
npm test        # Trading calculation and order lifecycle tests
npm run build  # Production build in dist/
npm run preview
```

## Included

- Original metallic ribbon artwork, floating animation, rotating type, scrolling market ticker and section reveals.
- Four demo markets: BTC, ETH, SOL and AVAX; four chart timeframes with candle inspection.
- A $10,000 virtual balance, long/short positions and leverage presets.
- Market orders, pending limit orders, automatic simulated fills, cancellation, closing and order history.
- Input validation, margin reservation, live simulated P&L and reset.
- English and Russian, mobile navigation, keyboard focus states, expandable terminal and reduced-motion support.
- Self-hosted fonts and a 73 KB WebP hero image. No analytics, cookies, API keys or external runtime requests.

## Demo boundaries

All market data is generated locally. Prices are not current market quotes. The sample ticker and 24-hour changes are fixed illustrative values; terminal prices move within a small simulated range every four seconds. Pause motion also pauses these updates. Orders, balance and history live in memory and reset when the page reloads. History retains the 50 most recent records; at most 20 positions/orders can be active.

There are no deposits, wallets, real trades, accounts or server storage. This deliberately simplified simulator does not model funding, fees, slippage, liquidation, matching-engine priority or exchange risk rules. A production exchange requires backend services, live market feeds and exchange integration.

## Structure

```text
src/App.jsx                Landing page, language and motion controls
src/components/Terminal.jsx  Trading workspace and position management
src/components/Chart.jsx     SVG candlestick chart
src/components/OrderForm.jsx Order inputs and validation feedback
src/lib/trading.js           Pure demo order engine
src/lib/trading.test.js      Order lifecycle and balance tests
src/lib/markets.js           Deterministic market fixtures
src/lib/i18n.js              English and Russian copy
src/styles.css              Responsive design and animation system
public/assets/              Original production artwork
docs/design.md              Design direction and fidelity notes
```

## Deployment

The production output is a static website in `dist/`. Relative asset paths support deployment at a domain root or a repository subpath. Deploy `dist/` to any static host. CI runs the tests and production build for pushes and pull requests.

## Artwork

The hero is original AI-generated artwork created with the built-in image generation tool. Production file: `public/assets/hero-ribbon.webp`.

Asset prompt: “Extract and recreate only the lime metallic continuous folded infinity ribbon sculpture. Preserve loop geometry, chrome-lime material, black reflections, highlights and blurred motion tail. Landscape 4:3 with modest negative edges on uniform #080a09. No UI, text, logos, badges, charts, coins or borders.”

No Reya logos, proprietary assets, investor claims or performance statistics are reused.
