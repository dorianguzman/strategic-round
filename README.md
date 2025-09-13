# QStarLabs

<div align="center">
  <img src="assets/qstarlabs-logo.svg" alt="QStarLabs" width="300" style="margin-bottom: 20px;">
  
  
  ### Ready to explore something amazing?
  
  <a href="https://dorianguzman.github.io/strategic-round/">
    <img src="assets/portal-button.svg" alt="Enter the Portal" width="280" />
  </a>
  
  
  <sub>Be part of PERSONAS platform</sub>
  
</div>

---

## Repository Structure

```
strategic-round/
├── index.html              # Entry portal with email wall
├── deck.html               # Main presentation
├── assets/                 # Font files and graphics
│   ├── Youth-Light.woff2
│   ├── Youth-Light.otf
│   ├── Youth-Medium.woff2
│   ├── Youth-Medium.otf
│   ├── qstarlabs-logo.svg
│   └── portal-button.svg
├── images/                 # Visual assets and graphics
├── google-script.js        # Google Apps Script for email service
├── generate-pdf.js         # Automated PDF generation script
├── package.json            # Node.js dependencies
├── .github/
│   └── workflows/
│       └── generate-pdf.yml # GitHub Actions workflow
└── QStarLabs_Strategic_Deck_2025.pdf # Auto-generated PDF
```

## Features

### Email Wall System
- **Required fields**: Name, Email, Company/Organization
- **Automatic email notifications** sent to designated recipients
- **Google Sheets logging** for visitor analytics
- **Failure protection** with automatic retry mechanism
- **No external dependencies** - runs on Google Apps Script

### Data Collection & Analytics
- **Google Sheets**: Centralized database accessible from anywhere
- **localStorage backup**: Temporary storage for failed submissions
- **Automatic retry**: Failed submissions retry up to 5 times over 7 days
- **No data loss**: All submissions preserved even if API fails

## Quick Start

```bash
# Clone the repository
git clone https://github.com/dorianguzman/strategic-round.git

# Install dependencies (for PDF generation)
cd strategic-round
npm install

# Open locally
open index.html

# Generate PDF locally
npm run generate-pdf
```

## Technical Implementation

### Google Apps Script Setup
The email wall uses Google Apps Script to handle form submissions:
1. Sends notification emails to specified recipients
2. Creates/updates Google Sheets with visitor data
3. No API keys or external services required
4. Deployment URL configured in `index.html`

### Automatic PDF Generation
- GitHub Actions workflow triggers on push to main
- Puppeteer captures deck at 1920x1080 resolution
- PDF automatically committed back to repository

## Contact

For inquiries, please contact the QStarLabs team.

---

© 2025 QStarLabs. All rights reserved.