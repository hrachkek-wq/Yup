const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Function to wait for canvas to load
async function waitForCanvas(page, timeout = 15000) {
    const startTime = Date.now();
    
    while(Date.now() - startTime < timeout) {
        const frames = page.frames();
        for(const frame of frames) {
            const canvas = await frame.$('canvas');
            if(canvas) {
                const isVisible = await frame.evaluate((el) => {
                    const style = window.getComputedStyle(el);
                    return style.display !== 'none' && style.visibility !== 'hidden';
                }, canvas).catch(() => true);
                
                if(isVisible) {
                    return true;
                }
            }
        }
        
        const mainCanvas = await page.$('canvas');
        if(mainCanvas) {
            return true;
        }
        
        await page.waitForTimeout(1000); // Slower checking (1 second instead of 0.5)
    }
    
    return false;
}

// Function to get game name
async function getGameName(gameElement, page) {
    let gameName = null;
    
    gameName = await gameElement.getAttribute('data-name');
    if(gameName && gameName.trim()) return gameName.trim();
    
    gameName = await gameElement.getAttribute('title');
    if(gameName && gameName.trim()) return gameName.trim();
    
    gameName = await gameElement.getAttribute('alt');
    if(gameName && gameName.trim()) return gameName.trim();
    
    try {
        const nameElement = await gameElement.$('span, div, p, h3, h4');
        if(nameElement) {
            gameName = await nameElement.textContent();
            if(gameName && gameName.trim()) return gameName.trim();
        }
    } catch(e) {}
    
    try {
        gameName = await gameElement.textContent();
        if(gameName && gameName.trim() && gameName.length < 50) return gameName.trim();
    } catch(e) {}
    
    return null;
}

// Main function to test AvatarUX games
async function testAvatarUXGames() {
    console.log("🚀 Opening browser...");
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    console.log("📱 Going to vbet slots...");
    await page.goto('https://www.vbet.ua/en/casino/slots');
    console.log("  ⏳ Waiting 5 seconds for page to load...");
    await page.waitForTimeout(5000);
    
    console.log("🎮 Clicking AvatarUX provider...");
    await page.click('div[title="AvatarUX"]');
    console.log("  ⏳ Waiting 4 seconds for provider to load...");
    await page.waitForTimeout(4000);
    
    console.log("📜 Loading all games slowly...");
    for(let i = 0; i < 10; i++) {
        console.log(`  Scroll ${i+1}/10`);
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(3000); // Slower scrolling (3 seconds between scrolls)
    }
    
    console.log("  ⏳ Waiting 3 seconds before finding games...");
    await page.waitForTimeout(3000);
    
    // Get all game elements
    const gameElements = await page.$$('.game-item, [class*="game"], [class*="Game"]');
    console.log(`✅ Found ${gameElements.length} total items\n`);
    
    // Collect real game names
    let games = [];
    
    for(let i = 0; i < gameElements.length; i++) {
        const gameName = await getGameName(gameElements[i], page);
        
        if(gameName && 
           gameName.length < 40 && 
           !gameName.includes("Selected") && 
           !gameName.includes("Play Random") &&
           !gameName.includes("Games") &&
           !gameName.includes("Table") &&
           !gameName.includes("Popular") &&
           !gameName.includes("Crash") &&
           !gameName.includes("Instant") &&
           !gameName.includes("Betting") &&
           gameName.length > 1) {
            
            games.push({
                element: gameElements[i],
                name: gameName
            });
        }
    }
    
    console.log(`🎮 Found ${games.length} real games to test\n`);
    
    const screenshotFolder = 'AvatarUX_Broken_Games';
    if (!fs.existsSync(screenshotFolder)) {
        fs.mkdirSync(screenshotFolder);
    }
    
    let workingGames = [];
    let brokenGames = [];
    
    // Test each game slowly
    for(let i = 0; i < games.length; i++) {
        const gameName = games[i].name;
        const gameElement = games[i].element;
        
        console.log(`\n${"=".repeat(50)}`);
        console.log(`[${i+1}/${games.length}] Testing: ${gameName}`);
        console.log(`${"=".repeat(50)}`);
        
        try {
            // Hover over game slowly
            console.log(`  🖱️  Hovering over game...`);
            await gameElement.hover();
            await page.waitForTimeout(1500); // Wait after hover
            
            // Find and click demo button
            console.log(`  🔍 Looking for DEMO button...`);
            const demoButton = await page.$('button:has-text("DEMO")');
            if(!demoButton) {
                console.log(`  ⚠️ No DEMO button found - skipping`);
                continue;
            }
            
            console.log(`  🖱️  Clicking DEMO button...`);
            await demoButton.click();
            await page.waitForTimeout(3000); // Wait for game to start opening
            
            console.log(`  🎮 Game opening - waiting for canvas...`);
            
            // Wait for canvas to appear
            const canvasFound = await waitForCanvas(page, 20000); // 20 second timeout
            
            if(canvasFound) {
                console.log(`  ✅ CANVAS FOUND! Game is working`);
                workingGames.push(gameName);
                
                // Wait extra time for game to fully load
                console.log(`  ⏱️  Waiting 4 seconds for game to fully stabilize...`);
                await page.waitForTimeout(4000);
                
            } else {
                console.log(`  ❌ NO CANVAS FOUND - Game is broken`);
                brokenGames.push(gameName);
                
                // Take screenshot of broken game
                const safeName = gameName.replace(/[^a-z0-9]/gi, '_').substring(0, 50);
                const screenshotPath = path.join(screenshotFolder, `${safeName}.png`);
                await page.screenshot({ path: screenshotPath });
                console.log(`  📸 Screenshot saved: ${screenshotPath}`);
            }
            
            // Close the game slowly
            console.log(`  🔒 Closing game...`);
            const closeButton = await page.$('i[title="Close"]');
            if(closeButton) {
                await closeButton.click();
                console.log(`  ✅ Close button clicked`);
            } else {
                await page.keyboard.press('Escape');
                console.log(`  ✅ Escape key pressed`);
            }
            
            // Wait for game to fully close
            console.log(`  ⏳ Waiting 3 seconds for game to close...`);
            await page.waitForTimeout(3000);
            
        } catch(error) {
            console.log(`  ❌ ERROR - ${gameName}`);
            console.log(`  Error message: ${error.message}`);
            brokenGames.push(gameName);
            
            // Try to recover
            try {
                console.log(`  🔄 Attempting to recover...`);
                await page.keyboard.press('Escape');
                await page.waitForTimeout(3000);
            } catch(e) {
                console.log(`  💀 Could not recover`);
            }
        }
        
        // Small break between games
        if(i < games.length - 1) {
            console.log(`  ⏸️  Taking a 2 second break before next game...`);
            await page.waitForTimeout(2000);
        }
    }
    
    // Print final results
    console.log("\n" + "=".repeat(60));
    console.log("📊 FINAL RESULTS - AVATARUX PROVIDER");
    console.log("=".repeat(60));
    console.log(`✅ WORKING GAMES: ${workingGames.length}`);
    console.log(`❌ BROKEN GAMES: ${brokenGames.length}`);
    
    if(workingGames.length > 0 && workingGames.length <= 30) {
        console.log("\n✅ Working games:");
        workingGames.forEach(game => console.log(`   ✓ ${game}`));
    }
    
    if(brokenGames.length > 0) {
        console.log("\n❌ Broken games:");
        brokenGames.forEach(game => console.log(`   ✗ ${game}`));
        
        const listPath = path.join(screenshotFolder, 'broken_games_list.txt');
        fs.writeFileSync(listPath, brokenGames.join('\n'));
        console.log(`\n📁 Broken games list saved to: ${screenshotFolder}/broken_games_list.txt`);
        console.log(`📸 Screenshots saved in: ${screenshotFolder}/`);
    }
    
    console.log("\n✨ Test complete! Closing browser in 3 seconds...");
    await page.waitForTimeout(3000);
    await browser.close();
}

// Run the test
testAvatarUXGames();