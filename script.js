const canvas = document.getElementById('solarSystemCanvas');
const ctx = canvas.getContext('2d');

// Adjust canvas size (can be made responsive later)
canvas.width = 800;
canvas.height = 600;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

// Define initial planets data
// Data: name, color, orbitalRadius (pixels), size (radius in pixels), speed (radians per frame)
let planets = [
    { name: 'Mercury', color: 'gray', orbitalRadius: 50, size: 4, speed: 0.02, angle: 0, active: true },
    { name: 'Venus', color: 'orange', orbitalRadius: 80, size: 7, speed: 0.015, angle: 0, active: true },
    { name: 'Earth', color: 'blue', orbitalRadius: 120, size: 8, speed: 0.01, angle: 0, active: true },
    {
        name: 'Moon',
        color: 'lightgray',
        size: 3,
        orbitingPlanetName: 'Earth',
        orbitRadiusAroundPlanet: 20,
        speedAroundPlanet: 0.08,
        angleAroundPlanet: 0,
        active: true // Active if Earth is active
    },
    { name: 'Mars', color: 'red', orbitalRadius: 160, size: 5, speed: 0.008, angle: 0, active: true },
    { name: 'Jupiter', color: 'brown', orbitalRadius: 220, size: 15, speed: 0.005, angle: 0, active: true },
    { name: 'Saturn', color: 'gold', orbitalRadius: 280, size: 12, speed: 0.004, angle: 0, active: true },
    { name: 'Uranus', color: 'lightblue', orbitalRadius: 330, size: 10, speed: 0.003, angle: 0, active: true },
    { name: 'Neptune', color: 'darkblue', orbitalRadius: 380, size: 9, speed: 0.002, angle: 0, active: true }
];

// Store all possible planets for adding them back
const allPlanetsData = JSON.parse(JSON.stringify(planets)); // Deep copy

function drawPlanet(planet) {
    if (!planet.active) return;

    let x, y;
    if (planet.orbitingPlanetName) {
        const primaryPlanet = planets.find(p => p.name === planet.orbitingPlanetName);
        // If the primary planet is not active or not found, don't draw the moon.
        if (!primaryPlanet || !primaryPlanet.active) {
            // Ensure moon itself is marked inactive if its primary is toggled off.
            // This is a safeguard, primary toggling logic should handle moon's active state.
            if(planet.active) planet.active = false; 
            return;
        }
        // Calculate primary planet's current position
        const primaryX = centerX + primaryPlanet.orbitalRadius * Math.cos(primaryPlanet.angle);
        const primaryY = centerY + primaryPlanet.orbitalRadius * Math.sin(primaryPlanet.angle);
        // Calculate moon's position relative to its primary planet
        x = primaryX + planet.orbitRadiusAroundPlanet * Math.cos(planet.angleAroundPlanet);
        y = primaryY + planet.orbitRadiusAroundPlanet * Math.sin(planet.angleAroundPlanet);
    } else {
        // It's a planet orbiting the Sun
        x = centerX + planet.orbitalRadius * Math.cos(planet.angle);
        y = centerY + planet.orbitalRadius * Math.sin(planet.angle);
    }

    ctx.beginPath();
    ctx.arc(x, y, planet.size, 0, Math.PI * 2);
    ctx.fillStyle = planet.color;
    ctx.fill();
    ctx.closePath();

    // Add planet name label
    ctx.fillStyle = 'white'; // Contrasting color for the label
    ctx.font = '10px Arial';
    ctx.fillText(planet.name, x + planet.size + 5, y);
}

function updatePlanetPositions() {
    planets.forEach(planet => {
        if (planet.active) {
            if (planet.orbitingPlanetName) {
                // It's a moon, update its angle around its planet
                planet.angleAroundPlanet += planet.speedAroundPlanet;
            } else {
                // It's a planet, update its angle around the Sun
                planet.angle += planet.speed;
            }
        }
    });
}

function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Sun (simple representation for now)
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.closePath();

    // Add Sun label
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.fillText("Sun", centerX + 20 + 5, centerY);

    // Draw planets
    planets.forEach(drawPlanet);

    // Update positions for next frame
    updatePlanetPositions();

    requestAnimationFrame(gameLoop);
}

// GUI setup
const gui = document.getElementById('gui');

function setupGUI() {
    allPlanetsData.forEach(celestialData => {
        // Do not create toggle buttons for moons if their state is tied to their planet
        if (celestialData.orbitingPlanetName) {
            return; 
        }

        const button = document.createElement('button');
        button.textContent = `Toggle ${celestialData.name}`;
        button.id = `btn-${celestialData.name}`;
        button.onclick = () => togglePlanet(celestialData.name);
        gui.appendChild(button);
        updateButtonAppearance(celestialData.name); // Initial button state
    });
}

function togglePlanet(planetName) {
    let planetInPlanetsArray = planets.find(p => p.name === planetName);
    const planetDataFromAll = allPlanetsData.find(p => p.name === planetName);

    if (planetInPlanetsArray) { // Planet is in the active list
        planetInPlanetsArray.active = !planetInPlanetsArray.active;

        // If Earth is toggled, toggle Moon
        if (planetName === 'Earth') {
            const moon = planets.find(p => p.name === 'Moon');
            if (moon) {
                moon.active = planetInPlanetsArray.active;
            }
        }
    } else if (planetDataFromAll) { // Planet is not in the active list, so we are adding it
        const freshPlanet = JSON.parse(JSON.stringify(planetDataFromAll));
        freshPlanet.active = true;
        
        // Find correct insertion point based on allPlanetsData order
        const baseOrder = allPlanetsData.map(p => p.name);
        let insertBeforeIndex = -1;
        for(let i = 0; i < planets.length; i++){
            if(baseOrder.indexOf(planets[i].name) > baseOrder.indexOf(freshPlanet.name)){
                insertBeforeIndex = i;
                break;
            }
        }
        if(insertBeforeIndex === -1) planets.push(freshPlanet);
        else planets.splice(insertBeforeIndex, 0, freshPlanet);
        
        planetInPlanetsArray = freshPlanet; // It's now in the planets array

        // If Earth is added, also add Moon
        if (planetName === 'Earth') {
            const moonData = allPlanetsData.find(p => p.name === 'Moon');
            if (moonData) {
                let moonInPlanetsArray = planets.find(p => p.name === 'Moon');
                if (!moonInPlanetsArray) { // Moon isn't there, add it
                    const freshMoon = JSON.parse(JSON.stringify(moonData));
                    freshMoon.active = true; // Earth is active, so Moon is too
                    // Insert Moon right after Earth
                    const earthIdx = planets.findIndex(p => p.name === 'Earth');
                    if (earthIdx !== -1) {
                        planets.splice(earthIdx + 1, 0, freshMoon);
                    } else { // Should not happen if Earth was just added
                        planets.push(freshMoon); 
                        // Resort to be safe if Earth's index wasn't found as expected
                        planets.sort((a, b) => baseOrder.indexOf(a.name) - baseOrder.indexOf(b.name));
                    }
                } else { // Moon is there, just ensure it's active
                    moonInPlanetsArray.active = true;
                }
            }
        }
    }
    
    // If a planet is deactivated, ensure its moons are also deactivated.
    // This is important if there are other moons for other planets later.
    if (planetInPlanetsArray && !planetInPlanetsArray.active) {
        planets.forEach(moon => {
            if (moon.orbitingPlanetName === planetName) {
                moon.active = false;
            }
        });
    }

    // After toggling, filter out inactive planets (except those that must remain for ordering/structure, e.g. Earth for Moon)
    // For simplicity, we'll keep inactive planets in the array and just rely on the .active flag for drawing/updates.
    // If actual removal is desired:
    // planets = planets.filter(p => p.active || (p.name === 'Earth' && planets.some(m => m.name === 'Moon' && m.orbitingPlanetName === 'Earth' && m.active)));
    // This filter would need careful crafting if planets can be removed entirely.
    // The current approach of just setting active = false is simpler.

    updateButtonAppearance(planetName);
    if (planetName === 'Earth') {
        // Moon doesn't have its own button, but its state depends on Earth's button.
        // No separate updateButtonAppearance('Moon') needed if Moon has no button.
    }
}

function updateButtonAppearance(planetName) {
    const button = document.getElementById(`btn-${planetName}`);
    if (!button) return; // Skip if button doesn't exist (e.g., for Moon)

    const planet = planets.find(p => p.name === planetName);
    // The planet might be "active" in the allPlanetsData sense, but not in the live `planets` array
    // if it (or its primary) was toggled off. We check its status in the live `planets` array.
    const planetIsEffectivelyActive = planet && planet.active;

    if (planetIsEffectivelyActive) {
        button.textContent = `Remove ${planetName}`;
            button.classList.remove('add');
            button.classList.add('remove');
        } else {
            button.textContent = `Add ${planetName}`;
            button.classList.remove('remove');
            button.classList.add('add'); // For specific styling if needed
        }
    }
}


// Initialize
setupGUI();
gameLoop();
