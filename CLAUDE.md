# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the QStarLabs Strategic Round funding deck repository - a static HTML presentation for investor outreach. The deck showcases QStarLabs' AI-powered micro-influencer platform PERSONAS for iGaming operators.

## Repository Structure

- `index.html` - Main presentation deck (single-file HTML with embedded CSS and JavaScript)
- `assets/` - Font files (Youth-Light and Youth-Medium in .otf and .woff2 formats)
- `images/` - Visual assets for the presentation including team photos and graphics
- `README.md` - Public-facing repository documentation

## Development Commands

```bash
# View the deck locally
open index.html

# Or serve locally with Python
python3 -m http.server 8000
# Then navigate to http://localhost:8000

# Or serve with Node.js (if available)
npx serve .
```

## Architecture Notes

This is a static single-page HTML presentation with:
- Embedded CSS styling for slide layouts and animations
- Inline JavaScript for slide navigation and interactive features
- External dependencies loaded from CDNs:
  - html2canvas (for screenshot functionality)
  - jspdf (for PDF export capabilities)
- Custom Youth font family loaded from local assets
- Responsive design optimized for full-screen presentation viewing

## Key Technical Details

- No build process required - pure HTML/CSS/JavaScript
- Slide navigation implemented via JavaScript
- PDF export functionality available through browser
- All assets are self-contained within the repository
- Designed to be hosted on GitHub Pages (accessible at https://dorianguzman.github.io/strategic-round/)

## Working with the Presentation

When modifying the deck:
- All content and styling is in `index.html`
- Slides are structured as `<div class="slide">` elements
- Navigation controls and keyboard shortcuts are handled via JavaScript event listeners
- Images should be optimized for web before adding to `images/` directory