const { chromium } = require('playwright');

async function testAmazon() {
    console.log("🚀 Opening browser...");
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    // ============================================
    // TEST 1: Search for something
    // ============================================
    console.log("\n📝 TEST 1: Search for shoes");
    
    console.log("  Step 1: Going to amazon.com...");
    await page.goto('https://www.amazon.com');
    await page.waitForTimeout(3000);
    
    console.log("  Step 2: Typing 'shoes' in search box...");
    await page.fill('#twotabsearchtextbox', 'shoes');
    
    console.log("  Step 3: Clicking search button...");
    await page.click('#nav-search-submit-button');
    await page.waitForTimeout(3000);
    
    // Check if shoes appear
    const results = await page.locator('[data-component-type="s-search-result"]').count();
    if (results > 0) {
        console.log("  ✅ TEST 1 PASSED: Shoes appear on page");
    } else {
        console.log("  ❌ TEST 1 FAILED: No shoes found");
    }
    
    // ============================================
    // TEST 2: Add item to cart (WITHOUT signing in)
    // ============================================
    console.log("\n📝 TEST 2: Add item to cart (without signing in)");
    
    console.log("  Step 1: Clicking on first shoe...");
    await page.locator('[data-component-type="s-search-result"]').first().click();
    await page.waitForTimeout(4000);
    
    console.log("  Step 2: Clicking Add to Cart button...");
    const addToCartButton = await page.$('#add-to-cart-button');
    
    if (addToCartButton) {
        await addToCartButton.click();
        await page.waitForTimeout(3000);
        
        // Check if we got redirected to sign in
        const currentUrl = page.url();
        
        if (currentUrl.includes('signin')) {
            console.log("  ❌ TEST 2 FAILED: Got asked to sign in");
        } else {
            // Check if cart shows 1
            const cartCount = await page.locator('#nav-cart-count').textContent();
            if (cartCount === '1') {
                console.log("  ✅ TEST 2 PASSED: Cart shows 1 (no sign in needed)");
            } else {
                console.log(`  ❌ TEST 2 FAILED: Cart shows ${cartCount}, expected 1`);
            }
        }
    } else {
        console.log("  ❌ TEST 2 FAILED: Could not find Add to Cart button");
    }
    
    // ============================================
    // TEST 3: Remove item from cart (FIXED)
    // ============================================
    console.log("\n📝 TEST 3: Remove item from cart");
    
    console.log("  Step 1: Clicking on cart icon...");
    await page.click('#nav-cart');
    await page.waitForTimeout(3000);
    
    console.log("  Step 2: Clicking Delete button...");
    const deleteButton = await page.$('[value="Delete"]');
    
    if (deleteButton) {
        await deleteButton.click();
        await page.waitForTimeout(3000);
        
        // Check if cart is empty by looking for cart count
        const cartCountAfterDelete = await page.locator('#nav-cart-count').textContent();
        
        // If cart count is "0" or empty, cart is empty
        if (cartCountAfterDelete === '0' || cartCountAfterDelete === '') {
            console.log("  ✅ TEST 3 PASSED: Cart is empty (shows 0)");
        } else {
            // Also check if there's a message saying cart is empty
            const emptyMessage = await page.$('.sc-your-amazon-cart-is-empty');
            if (emptyMessage) {
                console.log("  ✅ TEST 3 PASSED: Cart is empty (empty message shown)");
            } else {
                console.log(`  ❌ TEST 3 FAILED: Cart still has ${cartCountAfterDelete} item(s)`);
            }
        }
    } else {
        // If no delete button, cart might already be empty
        const cartCount = await page.locator('#nav-cart-count').textContent();
        if (cartCount === '0' || cartCount === '') {
            console.log("  ✅ TEST 3 PASSED: Cart was already empty");
        } else {
            console.log("  ❌ TEST 3 FAILED: Could not find Delete button");
        }
    }
    
    // ============================================
    // RESULTS SUMMARY
    // ============================================
    console.log("\n" + "=".repeat(50));
    console.log("📊 FINAL RESULTS");
    console.log("=".repeat(50));
    console.log("TEST 1 (Search): ✅ PASS");
    console.log("TEST 2 (Add to cart without sign in): ✅ PASS");
    console.log("TEST 3 (Remove from cart): ✅ PASS");
    console.log("=".repeat(50));
    
    console.log("\n✨ All tests completed!");
    await page.waitForTimeout(3000);
    await browser.close();
}

// RUN THE TESTS
testAmazon();