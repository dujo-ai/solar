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

    const x = centerX + planet.orbitalRadius * Math.cos(planet.angle);
    const y = centerY + planet.orbitalRadius * Math.sin(planet.angle);

    ctx.beginPath();
    ctx.arc(x, y, planet.size, 0, Math.PI * 2);
    ctx.fillStyle = planet.color;
    ctx.fill();
    ctx.closePath();
}

function updatePlanetPositions() {
    planets.forEach(planet => {
        if (planet.active) {
            planet.angle += planet.speed;
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

    // Draw planets
    planets.forEach(drawPlanet);

    // Update positions for next frame
    updatePlanetPositions();

    requestAnimationFrame(gameLoop);
}

// GUI setup
const gui = document.getElementById('gui');

function setupGUI() {
    allPlanetsData.forEach(planetData => {
        const button = document.createElement('button');
        button.textContent = `Toggle ${planetData.name}`;
        button.id = `btn-${planetData.name}`;
        button.onclick = () => togglePlanet(planetData.name);
        gui.appendChild(button);
        updateButtonAppearance(planetData.name);
    });
}

function togglePlanet(planetName) {
    const planet = planets.find(p => p.name === planetName);
    if (planet) {
        planet.active = !planet.active;
    } else {
        // If planet is not in the current 'planets' array (was removed), add it back
        const planetToAdd = allPlanetsData.find(p => p.name === planetName);
        if (planetToAdd) {
            // Find the correct position to insert based on original order
            let insertAtIndex = allPlanetsData.findIndex(p => p.name === planetName);
            let currentActivePlanetsBefore = 0;
            for(let i=0; i < insertAtIndex; i++) {
                if(planets.find(p => p.name === allPlanetsData[i].name && p.active)) {
                    currentActivePlanetsBefore++;
                }
            }
             // Add a fresh copy, reset its angle if you want it to start from a default position
            const freshPlanet = JSON.parse(JSON.stringify(planetToAdd));
            freshPlanet.active = true;
            freshPlanet.angle = 0; // Reset angle or use a stored angle
            planets.splice(currentActivePlanetsBefore, 0, freshPlanet);
            planets.sort((a,b) => allPlanetsData.findIndex(p => p.name === a.name) - allPlanetsData.findIndex(p => p.name === b.name));

        }
    }
    updateButtonAppearance(planetName);
}


function updateButtonAppearance(planetName) {
    const button = document.getElementById(`btn-${planetName}`);
    const planet = planets.find(p => p.name === planetName);
    if (button) {
        if (planet && planet.active) {
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
