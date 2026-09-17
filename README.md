# Agave Foot & Ankle — Homepage Prototype

Static, single-page prototype of the Agave Foot & Ankle Surgeons homepage, used for
client review. No build step, no dependencies: it is one HTML file, one JS file and
a folder of images.

Deployed as a **preview** on Vercel under the project `agave-foot-ankle-prototype`.

## Files

| Path          | What it is                                                        |
| ------------- | ----------------------------------------------------------------- |
| `index.html`  | The whole page: markup plus all CSS in one `<style>` block         |
| `app.js`      | Scroll reveals, sticky header, scrollspy, mobile menu, FAQ, carousel |
| `images/`     | Hero, four surgeon headshots, two office exteriors, CT scanner     |
| `robots.txt`  | Disallows all crawlers — this is a prototype, not the live site    |

## Running it locally

No tooling needed. Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

## How it works

One responsive page for every screen size. Layout switches on the page's own width
using CSS container queries at 1240px, 960px and 760px — not on the viewport — so the
same file covers desktop, tablet and phone.

Motion is progressive enhancement. All content is present and visible in the HTML;
`app.js` adds a class that hides elements only once IntersectionObserver is ready, then
reveals them on scroll. If the JS fails to load, the full page still renders. Every
animation is disabled for visitors whose OS is set to reduce motion.

## Known placeholders

- Six condition cards (bunions, hammertoes, fractures, sports injuries, arthritis,
  heel pain) still show labelled placeholder boxes.
- `[HOURS]` on both location cards.
- `[CREDENTIALS]` on Dr. Lemon's card.
- Every CTA points at `#`. No request form or patient portal is wired up.
- Hero image is AI-generated and both office photos show the pre-rebrand signage.
  All three need replacing with real photography before launch.

## Source of truth

The design lives in a Claude design canvas, which holds the approved static homepage
comps (desktop and mobile) plus this prototype and the design team's notes:
https://claude.ai/artifact/6TE4AUYL4NpCAXFjE41QDR

`index.html` here was generated from that canvas artboard. When the canvas changes,
this file needs regenerating — they are not linked automatically.
