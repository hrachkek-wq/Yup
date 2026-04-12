const { chromium } = require('playwright'); // chromium = browser 

(async () => { 
    const browser = await chromium.launch({ headless: false }); // launches the browser, headless: true means it won't open a visible window 
    const page = await browser.newPage(); // opens a new tab

    // Step 1: Go to the website
    console.log('Going to sas.am...');
    await page.goto('https://www.sas.am/', { waitUntil: 'networkidle' }); // this opens the website, and waituntill: networkidle means the page has fully loaded

    // Step 2: Click the menu icon 
    console.log('Clicking menu icon...');
    await page.locator('.js-menu-toggler').first().click();
    await page.waitForTimeout(1000);

    

    // Step 3: Click "Ծաղիկներ" (Flowers in Armenian)
    console.log('Clicking Ծաղիկներ...');
    await page.getByText('Ծաղիկներ', { exact: false }).first().click();
    await page.waitForTimeout(2000);

    // Step 4: Wait for products to load and grab all flower names
    console.log('Grabbing flower names...\n'); 
    await page.waitForLoadState('networkidle');

    const flowers = await page.$$eval(
        '.product__name, .product-name, .product__title, .product-title, [class*="product"] h2, [class*="product"] h3, [class*="product"] a',
        els => [...new Set(els.map(el => el.innerText.trim()).filter(t => t.length > 0))] 
    );

    if (flowers.length === 0) {
        // fallback: print all visible text links in the product area
        const fallback = await page.$$eval('a', els =>
            [...new Set(els.map(el => el.innerText.trim()).filter(t => t.length > 2))] 
        );
        console.log('Flowers found (fallback):\n');
        fallback.forEach((name, i) => console.log(`${i + 1}. ${name}`));
    } else {
        console.log(`Found ${flowers.length} flowers:\n`);
        flowers.forEach((name, i) => console.log(`${i + 1}. ${name}`));
    }

    await browser.close();
})();
