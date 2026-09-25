# Vanta design direction

Original trader website inspired by the visual energy and 24/7 market theme of Reya. No Reya trademarks, logos, investor claims or proprietary assets are reused.

Three generated design references: hero and market strip; trading terminal; editorial feature band and footer. The implementation uses a near-black #080a09 ground, lime #c5fa67, ivory #f4f5ee, gray #8e958d, 1px neutral borders, Manrope typography and IBM Plex Mono numerical labels. Desktop gutter: 4.5vw, content maximum width: 1400px. Headlines: tight tracking and 1.0–1.08 line-height. Buttons: rounded pill for page CTAs, small radius inside the terminal.

Hero copy: “Your edge. Never offline.”; “Markets don’t sleep. Neither does your ambition.”; “One workspace. Every opportunity. Always on.” Navigation: Markets, Why Vanta, The terminal, EN, Launch app. CTAs: Start trading, Explore markets.

Motion: softly floating original metallic ribbon, rotating circular type, scroll reveals, rolling sample market strip, animated chart changes. A global pause control and prefers-reduced-motion disable nonessential movement.

Intentional implementation adjustments: keep the same navigation throughout (the terminal concept invented unrelated navigation); make limit orders, order history, closing and cancelling usable; provide Russian translation, accessible mobile navigation and motion controls. Display demo labels and virtual balances clearly. No real trading, real-time data claim or wallet authorization is implied.

All text, chart candles, order forms and controls are native accessible UI. Only the sculpture is a raster asset. The generated concept screenshots are references, not shipped as website content.

## Visual verification

Compared generated section concepts with Browser plugin screenshots, using `view_image` for both reference and implementation. The desktop reference dimensions are 1536×1024. Also inspected the normal desktop viewport, 390×844 mobile and 320×740 mobile. No horizontal page overflow was observed.

Reference images in this task's generated-image folder:

- Hero: `exec-7480b17b-537a-4893-ab77-4cb9ec752086.png`
- Terminal: `exec-a401cccc-fb45-4a44-85cb-9a31d852416e.png`
- Feature band and footer: `exec-ab92f104-faac-42da-85bb-23bd8b1ccc50.png`

Fidelity ledger:

| Comparison | Resolution |
| --- | --- |
| Three-line headline and primary/secondary CTAs | Copy and ordering preserved; adjusted heading weight, line spacing and CTA size after screenshot comparison. |
| Near-black/lime palette | Matched tokens; removed visible image-background edges with blending and an edge mask, without recoloring the sculpture. |
| Metallic ribbon | Used a dedicated generated asset from the concept, optimized to WebP, with gentle transform animation. |
| Page rhythm | Preserved hero, ticker, terminal, open three-column band, large final CTA and footer; adjusted hero height to reveal the next section. |
| Terminal anatomy | Preserved chart/order panel/positions arrangement; added functional order lifecycle controls. |
| Typography and icon treatment | Used self-hosted Manrope and IBM Plex Mono; enlarged desktop editorial type and matched the thin chart, sliders and globe icons. |
| Responsive chart | Changed SVG coordinate space and candle count on narrow screens instead of shrinking desktop labels to unreadable sizes. |
| Motion/accessibility | Pause control, system reduced-motion CSS, keyboard navigation, Escape exit and focus containment in expanded terminal. |

Above-the-fold English copy matches the hero reference. Intentional additions are the motion control and Russian translation. The ticker contents move continuously, so their screenshot positions vary. The exact generated font is approximated with Manrope; demo chart data is deterministic and the last candle updates with simulated prices. No material layout or missing-asset issues remained in the verified screens.

Functional browser checks covered opening/closing a position, P&L and balance display, pending limit placement/cancellation, invalid amounts, changing markets/timeframes/leverage/side, language switching, mobile navigation, terminal expansion and Escape, and demo reset. A fresh production-preview tab reported no browser warnings or errors. Seven automated order-engine tests passed; the GitHub workflow also passed.
