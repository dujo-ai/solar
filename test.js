// Basic Test Suite for Solar System
// This is a very simple test suite. For more complex projects, consider using a testing framework like Jest, Mocha, or Jasmine.

console.log("--- Running Basic Solar System Tests ---");

// Mocking browser environment elements if not present (e.g., if run in Node.js without JSDOM)
if (typeof document === 'undefined') {
    global.document = {
        getElementById: (id) => ({
            getContext: () => ({
                beginPath: () => {},
                arc: () => {},
                fill: () => {},
                closePath: () => {},
                clearRect: () => {},
                fillText: () => {}, // Added for potential future text rendering tests
            }),
            appendChild: () => {}, // Added for GUI tests
            // Mock other necessary canvas or DOM properties/methods if script.js uses them globally
            width: 800,
            height: 600,
        }),
        createElement: (type) => ({ // Mock for button creation
            // Mock button properties if needed by tests
            textContent: '',
            id: '',
            onclick: null,
            classList: { add: () => {}, remove: () => {} }
        })
    };
    global.canvas = document.getElementById('solarSystemCanvas'); // Mock canvas
    global.ctx = canvas.getContext('2d'); // Mock context
    global.requestAnimationFrame = (callback) => setTimeout(callback, 16); // Mock rAF

    // Mock GUI div for setupGUI
    global.gui = document.getElementById('gui');
}


// --- Test Data and Initial State ---
console.log("[Test 1] Checking initial planet data structure and properties...");
if (typeof planets === 'undefined' || !Array.isArray(planets)) {
    console.error("FAIL: `planets` array is not defined or not an array.");
} else if (planets.length === 0 && allPlanetsData.length > 0) { // Check if planets might be initially empty but allPlanetsData has items
    console.log("INFO: `planets` array might be modified by tests, using `allPlanetsData` for structure check of original data.");
    if (typeof allPlanetsData === 'undefined' || !Array.isArray(allPlanetsData) || allPlanetsData.length === 0) {
        console.error("FAIL: `allPlanetsData` is not defined, not an array, or is empty.");
    } else {
        let allChecksPassed = true;
        allPlanetsData.forEach(p => {
            if (!p.name || !p.color || typeof p.size !== 'number') {
                console.error(`FAIL: Planet/celestial body ${p.name} is missing name, color, or size.`);
                allChecksPassed = false;
            }
            if (p.orbitingPlanetName) { // It's a moon
                if (typeof p.orbitRadiusAroundPlanet !== 'number' || typeof p.speedAroundPlanet !== 'number') {
                    console.error(`FAIL: Moon ${p.name} is missing orbital parameters for moon.`);
                    allChecksPassed = false;
                }
            } else { // It's a planet
                if (typeof p.orbitalRadius !== 'number' || typeof p.speed !== 'number') {
                    console.error(`FAIL: Planet ${p.name} is missing orbital parameters for planet.`);
                    allChecksPassed = false;
                }
            }
        });

        const moon = allPlanetsData.find(p => p.name === 'Moon');
        if (!moon) {
            console.error("FAIL: Moon data is not defined in `allPlanetsData`.");
            allChecksPassed = false;
        } else {
            if (moon.orbitingPlanetName !== 'Earth') {
                console.error(`FAIL: Moon should be orbiting 'Earth', but is orbiting '${moon.orbitingPlanetName}'.`);
                allChecksPassed = false;
            }
            if (typeof moon.orbitRadiusAroundPlanet !== 'number' || typeof moon.speedAroundPlanet !== 'number') {
                console.error("FAIL: Moon is missing specific properties: `orbitRadiusAroundPlanet` or `speedAroundPlanet` are not numbers.");
                allChecksPassed = false;
            } else {
                console.log("INFO: Moon data specific properties are present and seem correct.");
            }
        }

        if (allChecksPassed) {
            console.log("PASS: `allPlanetsData` structure and essential properties (including Moon) seem okay.");
        } else {
            console.error("FAIL: One or more checks failed for `allPlanetsData` structure.");
        }
    }
} 
// Check initial `planets` array state separately if needed, but primary data source is `allPlanetsData`
if (typeof planets === 'undefined' || !Array.isArray(planets)) {
    console.warn("WARN: `planets` runtime array is not defined or not an array at the start of this test script. This might be okay if populated by script.js itself.");
} else {
    console.log("INFO: Initial `planets` runtime array length: " + planets.length);
}


// --- Test Core Functions (Existence) ---
console.log("\n[Test 2] Checking existence of core functions...");
const coreFunctions = ['drawPlanet', 'updatePlanetPositions', 'gameLoop', 'setupGUI', 'togglePlanet', 'updateButtonAppearance'];
let allCoreFunctionsExist = true;
coreFunctions.forEach(funcName => {
    if (typeof window[funcName] !== 'function' && typeof global[funcName] !== 'function') {
        // Check window for browser, global for Node.js
        let funcExists = false;
        try {
            if (eval(`typeof ${funcName}`) === 'function') { // eval to check function defined in script.js
                 funcExists = true;
            }
        } catch (e) {}

        if(!funcExists) {
            console.error(`FAIL: Function \`${funcName}\` is not defined.`);
            allCoreFunctionsExist = false;
        }
    }
});
if (allCoreFunctionsExist) {
    console.log("PASS: All core functions seem to be defined.");
} else {
    console.error("FAIL: One or more core functions are missing.");
}

// --- Test togglePlanet Logic (Conceptual - requires more setup for full behavioral test) ---
console.log("\n[Test 3] Conceptual check for togglePlanet logic...");
// This is a simplified check. True behavioral testing would involve:
// 1. Setting up a specific state for `planets` and `allPlanetsData`.
// 2. Calling `togglePlanet`.
// 3. Asserting the changes in `planets` (e.g., `active` status, or if planet is added/removed).
// 4. Mocking `document.getElementById` for `updateButtonAppearance`.

// For this basic test, we'll just check if the function can be called without immediate error
// if planets and allPlanetsData are somewhat correctly defined. Assumes script.js has run and populated these.
if (typeof togglePlanet === 'function' && typeof planets !== 'undefined' && typeof allPlanetsData !== 'undefined' && allPlanetsData.length > 0) {
    // Ensure Earth and Moon are in their initial state for this test.
    // This might require resetting state if other tests modify `planets` array.
    // For simplicity, we assume script.js initializes `planets` correctly before tests.
    // Or, one could deep-copy allPlanetsData to planets at the start of this specific test block.
    
    // Restore planets from allPlanetsData to reset state for this test
    // This is a simple way to reset if script.js doesn't re-initialize planets itself.
    // Note: This creates a new `planets` array; ensure it's the one script.js functions will use.
    // If script.js functions always refer to the global `planets`, this is fine.
    global.planets = JSON.parse(JSON.stringify(allPlanetsData));
    console.log("INFO: `planets` array reset from `allPlanetsData` for toggle test consistency.");


    const testPlanetName = 'Earth'; // Specific test for Earth and Moon
    let earth, moon;

    try {
        console.log(`INFO: [Test 3.1] Toggling ${testPlanetName} OFF.`);
        togglePlanet(testPlanetName); 
        earth = planets.find(p => p.name === testPlanetName);
        moon = planets.find(p => p.name === 'Moon');

        if (earth && earth.active === false) {
            console.log(`PASS: ${testPlanetName} marked inactive.`);
        } else {
            console.error(`FAIL: ${testPlanetName} not marked inactive as expected. Active: ${earth ? earth.active : 'N/A'}`);
        }
        if (moon && moon.active === false) {
            console.log("PASS: Moon correctly marked inactive when Earth is inactive.");
        } else {
            console.error(`FAIL: Moon not marked inactive when Earth is inactive. Active: ${moon ? moon.active : 'N/A'}`);
        }

        console.log(`INFO: [Test 3.2] Toggling ${testPlanetName} ON.`);
        togglePlanet(testPlanetName); 
        earth = planets.find(p => p.name === testPlanetName); // Re-find after toggle
        moon = planets.find(p => p.name === 'Moon');   // Re-find after toggle

        if (earth && earth.active === true) {
            console.log(`PASS: ${testPlanetName} marked active again.`);
        } else {
            console.error(`FAIL: ${testPlanetName} not marked active as expected. Active: ${earth ? earth.active : 'N/A'}`);
        }
        if (moon && moon.active === true) {
            console.log("PASS: Moon correctly marked active when Earth is active again.");
        } else {
            console.error(`FAIL: Moon not marked active when Earth is active again. Active: ${moon ? moon.active : 'N/A'}`);
        }
        
        // Test a non-Earth planet to ensure Moon state isn't affected
        const otherPlanetName = 'Mars';
        let mars = planets.find(p => p.name === otherPlanetName);
        if (mars) { // Ensure Mars exists before toggling
            console.log(`INFO: [Test 3.3] Toggling ${otherPlanetName} OFF (Moon should remain active if Earth is active).`);
            // Ensure Earth is active before this sub-test
            if (!earth || !earth.active) {
                 togglePlanet('Earth'); // Make sure Earth is on
                 earth = planets.find(p => p.name === 'Earth');
                 moon = planets.find(p => p.name === 'Moon'); 
                 console.log("INFO: Ensured Earth is active for Mars toggle test.");
            }
            const moonStateBeforeMarsToggle = moon ? moon.active : 'N/A';

            togglePlanet(otherPlanetName);
            mars = planets.find(p => p.name === otherPlanetName);
            moon = planets.find(p => p.name === 'Moon'); // re-fetch moon

            if(mars && mars.active === false) {
                console.log(`PASS: ${otherPlanetName} marked inactive.`);
            } else {
                 console.error(`FAIL: ${otherPlanetName} not marked inactive. Active: ${mars ? mars.active : 'N/A'}`);
            }
            if (moon && moon.active === moonStateBeforeMarsToggle) {
                console.log(`PASS: Moon's active state (${moon.active}) correctly unchanged by ${otherPlanetName} toggle.`);
            } else {
                console.error(`FAIL: Moon's active state changed by ${otherPlanetName} toggle. Was ${moonStateBeforeMarsToggle}, now ${moon ? moon.active : 'N/A'}`);
            }
            // Toggle Mars back on for consistency for any subsequent tests
            togglePlanet(otherPlanetName);
        } else {
            console.warn(`WARN: Planet ${otherPlanetName} not found, skipping that part of toggle test.`);
        }


        console.log("PASS: `togglePlanet` function is callable and ran without throwing immediate errors for Earth/Moon and Mars cases.");

    } catch (e) {
        console.error(`FAIL: Calling \`togglePlanet\` threw an error: ${e.message}`);
        console.error(e.stack);
    }
} else {
    console.warn("WARN: Cannot perform conceptual check for `togglePlanet` due to missing function, `planets` or `allPlanetsData`.");
}


// --- Test GUI Setup (Conceptual) ---
console.log("\n[Test 4] Conceptual check for setupGUI logic...");
if (typeof setupGUI === 'function' && typeof gui !== 'undefined' && typeof allPlanetsData !== 'undefined' && allPlanetsData.length > 0) {
    try {
        console.log("INFO: Attempting to run setupGUI()...");
        // In a real test, you'd check if gui.appendChild was called correctly.
        // Here, we just call it to see if it runs without error.
        // Need to ensure `document.createElement` and `button.appendChild` are mocked if not in browser.
        if(typeof document !== 'undefined' && !document.getElementById('gui').appendChild) { // ensure mock is sufficient
            document.getElementById('gui').appendChild = () => {};
        }
        if(typeof document !== 'undefined' && !document.createElement('button').classList) {
            document.createElement('button').classList = { add: () => {}, remove: () => {} };
        }

        setupGUI();
        console.log("PASS: `setupGUI` function is callable and ran without throwing immediate errors.");
        // A more detailed test would check:
        // - Number of buttons created matches allPlanetsData.length
        // - Button text and IDs are correctly set
        // - onclick handlers are assigned
    } catch (e) {
        console.error(`FAIL: Calling \`setupGUI\` threw an error: ${e.message}`);
        console.error(e.stack);
    }
} else {
    console.warn("WARN: Cannot perform conceptual check for `setupGUI` due to missing function or data.");
}

console.log("\n--- Basic Solar System Tests Complete ---");


// --- Test Label Drawing (Conceptual) ---
console.log("\n[Test 5] Conceptual check for label drawing...");
if (typeof drawPlanet === 'function' && typeof gameLoop === 'function' && typeof ctx !== 'undefined' && typeof ctx.fillText === 'function') {
    try {
        // Ensure there's at least one active planet for drawPlanet to attempt drawing a label
        if (planets && allPlanetsData && allPlanetsData.length > 0) {
            if (!planets.some(p => p.active)) { // If no planets are active, activate one for test
                 // Attempt to activate Earth if present, otherwise the first planet
                let planetToActivate = allPlanetsData.find(p => p.name === "Earth") || allPlanetsData[0];
                if (typeof togglePlanet === 'function') {
                    togglePlanet(planetToActivate.name); // This will also handle its moon if it's Earth
                    console.log(`INFO: Activated ${planetToActivate.name} for label drawing test.`);
                } else {
                    // Fallback if togglePlanet is not available: manually activate in the test `planets` array
                    let p = planets.find(pl => pl.name === planetToActivate.name);
                    if(p) p.active = true;
                    if(planetToActivate.name === "Earth") {
                        let m = planets.find(pl => pl.name === "Moon");
                        if(m) m.active = true;
                    }
                     console.log(`INFO: Manually activated ${planetToActivate.name} for label drawing test (togglePlanet not found).`);
                }
            }
        }


        console.log("INFO: Calling drawPlanet for each active planet (conceptual check for fillText).");
        let activePlanetsForTest = planets ? planets.filter(p => p.active) : [];
        if (activePlanetsForTest.length === 0) {
            console.warn("WARN: No active planets to test label drawing with for drawPlanet.");
        }
        activePlanetsForTest.forEach(p => {
            drawPlanet(p); // This should call ctx.fillText internally if planet is active
        });

        console.log("INFO: Calling gameLoop once (conceptual check for Sun's label fillText).");
        // Mock requestAnimationFrame to prevent looping, just run one frame
        const originalRAF = global.requestAnimationFrame;
        let gameLoopCalled = false;
        global.requestAnimationFrame = (cb) => { if(!gameLoopCalled) { cb(); gameLoopCalled = true; } }; 
        gameLoop(); // This should call ctx.fillText for the Sun
        global.requestAnimationFrame = originalRAF; // Restore original rAF

        // No direct assertion on fillText calls here, as it's a simple mock.
        // The main check is that the functions run without error.
        console.log("PASS: `drawPlanet` and `gameLoop` (single frame) ran without throwing errors related to label drawing.");
        console.log("INFO: Manual verification of actual text labels on canvas is recommended.");

    } catch (e) {
        console.error(`FAIL: Error during conceptual label drawing test: ${e.message}`);
        console.error(e.stack);
    }
} else {
    console.warn("WARN: Cannot perform conceptual check for label drawing due to missing functions or ctx.fillText mock.");
}

console.log("\n--- All Solar System Tests Concluded ---");


// To use these tests:
// 1. Make sure script.js is loaded BEFORE test.js if running in a browser.
//    <script src="script.js"></script>
//    <script src="test.js"></script>
// 2. Open the browser's developer console to see the output.
// 3. For Node.js: You might need to adapt parts of script.js if it heavily relies on browser-specific APIs
//    not covered by the simple mocks here (e.g., canvas rendering context methods beyond basic drawing).
//    You would run: node script.js (if script.js content is self-executing or wrapped) then node test.js,
//    or preferably, structure script.js to export functions and import them into test.js.
//    The current script.js runs globally, so test.js needs to run in an environment where script.js has already executed.
//    A common way: `node -e "require('./script.js'); require('./test.js');"` (requires script.js to be Node-compatible).
//    Given script.js structure, it's best tested by loading it first.
//    The mocks at the top of test.js attempt to bridge this for a standalone `node test.js` run if script.js
//    was hypothetically loaded by some other means or if its contents were pasted into the same scope.
//    For a clean Node test, script.js would need to export its functions and data.
//    The provided mocks are for a scenario where `script.js` defines its functions and variables in the global scope.
//    If `script.js` is loaded first (e.g. via HTML or concatenated file), these tests should pick them up.
//    If running `node test.js` directly, you need to ensure `script.js` contents are also loaded.
//    One way for quick check: `cat script.js test.js | node`
