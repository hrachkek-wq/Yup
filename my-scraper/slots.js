const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    // Step 1: Go to the slots page
    console.log('Going to virusbet...');
    await page.goto('https://www.virusbet.net/en/casino/slots/-1', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    // Step 2: Click Pragmatic Play using its exact class and title
    console.log('Clicking Pragmatic Play...');
    await page.locator('[title="Pragmatic Play"].providerItemsInner').first().click();
    await page.waitForTimeout(2000);

    // Step 3: Scroll down until all games are loaded
    console.log('Scrolling to load all games...');
    let previousCount = 0;
    while (true) {
        // Scroll down
        await page.evaluate(() => window.scrollBy(0, 1000));
        await page.waitForTimeout(1000);

        // Count how many games are loaded
        const currentCount = await page.$$eval('.casinoGameItem img', els => els.length);

        // If no new games loaded after scrolling, we're done
        if (currentCount === previousCount) break;
        previousCount = currentCount;
    }

    // Step 4: Grab all game names using the title attribute on the images
    console.log('Grabbing game names...\n');
    const games = await page.$$eval('.casinoGameItem img', els =>
        els.map(el => el.getAttribute('title') || el.getAttribute('alt')).filter(name => name && name.length > 0)
    );

    console.log(`Found ${games.length} games:\n`);
    games.forEach((name, i) => console.log(`${i + 1}. ${name}`));

    await browser.close();
})();