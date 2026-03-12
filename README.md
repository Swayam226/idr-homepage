# IDR Homepage (single page)

## What this includes
- `index.html`: semantic HTML5 sections (hero, about, model, community, contact)
- `styles.css`: responsive layout (Grid/Flex), accessible contrast, hover/focus states
- `script.js`: mobile menu toggle, sticky nav styling, section highlighting, demo form feedback
- `assets/idr-icon.svg`: cube-inspired icon (icon-only variant)
- `assets/idr-lockup.svg`: icon + text lockup (logo variant)

## Run locally
Open `idr-homepage/index.html` in a browser.

If you want a local server (optional), from the workspace root:
```powershell
python -m http.server 5500
```
Then open `http://localhost:5500/idr-homepage/`.

## Short design note (logo + brand)
The cube icon communicates structure, resilience, and “risk blocks” through a simple geometric form that stays legible at small sizes. Orange is used as the primary accent to signal energy and forward motion, while black/near‑black backgrounds and white text keep the system crisp and high-contrast. Typography is set in Inter for a clean, modern tech/education feel. The lockup pairs a compact “IDR” abbreviation with the full institute name to work across headers, footers, and favicon contexts.

