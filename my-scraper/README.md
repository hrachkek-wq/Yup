# Amazon Search Scraper

This script uses Playwright to automate searching for "protein powder" on Amazon.

## Prerequisites

- Node.js installed
- Dependencies installed: `npm install`

## Usage

Run the script with:

```bash
npm run search
```

This will:
- Launch a Chromium browser (visible window)
- Navigate to Amazon.com
- Search for "protein powder"
- Wait for results to load
- Take a screenshot of the results page
- Keep the browser open for 10 seconds so you can view the results
- Save the screenshot as `amazon-search-results.png`

## Troubleshooting

- Ensure Playwright browsers are installed: `npx playwright install`
- If the script fails, check your internet connection and Amazon's page structure (selectors might change)