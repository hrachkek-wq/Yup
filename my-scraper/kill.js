const { chromium } = require('playwright');
 
(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
 
    // Step 1: Go to the website
    console.log('Going to sas.am...');
    await page.goto('https://www.sas.am/', { waitUntil: 'networkidle' });
 
    // Step 2: Click the menu icon
    console.log('Clicking menu icon...');
    await page.locator('.js-menu-toggler').first().click();
    await page.waitForTimeout(1000);
 
    // Step 3: Click "Ծաղիկներ"
    console.log('Clicking Ծաղիկներ...');
    await page.getByText('Ծաղիկներ', { exact: false }).first().click();
    await page.waitForTimeout(2000);
 
    // Step 4: Grab all flower names using the exact class from inspect element
    console.log('Grabbing flower names...\n');
    await page.waitForLoadState('networkidle');
 
    const flowers = await page.$$('.catalog-main__title');
 
    for (let i = 0; i < flowers.length; i++) {
        const name = await flowers[i].innerText();
        console.log(`${i + 1}. ${name.trim()}`);
    }
 
    await browser.close();
})();
 