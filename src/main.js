/**
 * main.js - Refactored for Modular Architecture
 */

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// GameState is now defined in src/states.js
// systemZones is defined in src/mainPage.js (globally)

// --- GLOBAL STATE ---
let currentState = GameState.INTRO;
let mouseX = 0, mouseY = 0;
let loginInput = "";

// Player State
// Player State
const player = {
    name: "",
    score: 0,
    inventory: [],
    progress: {
        inventory: false,
        patching: false,
        access: false
    },
    phaseScores: {
        inventory: 0,
        patching: 0,
        access: 0,
        bcm: 0
    },
    incidents: []
};

// --- ASSETS & DATA ---

// Navigation Buttons (HUD)
const navButtons = [
    { id: "INV", label: "[ INVENTORY ]", state: GameState.ASSET_INVENTORY, x: 20, y: 60, w: 120, h: 30 },
    { id: "PATCH", label: "[ PATCH MGMT ]", state: GameState.PATCH_MGMT, x: 150, y: 60, w: 120, h: 30 },
    { id: "ACCESS", label: "[ ACCESS MGMT ]", state: GameState.ACCESS_MGMT, x: 280, y: 60, w: 130, h: 30 },
    { id: "BCM", label: "[ BCM / DR ]", state: GameState.BCM_DR, x: 420, y: 60, w: 120, h: 30 }
];

// Sub-page Assets (WTG, BESS, SOLAR) - These could also be moved to their own files eventually
const subPageAssets = {
    WTG: {
        bg: "assets/images/WTG.png",
        items: [
            { id: "W_PLC", name: "Turbine PLC", x: 105, y: 110, w: 290, h: 50, points: 20, collected: false },
            { id: "W_SW", name: "Turbine Switch", x: 105, y: 245, w: 290, h: 50, points: 10, collected: false },
            { id: "W_CMU", name: "Condition Monitoring", x: 105, y: 450, w: 290, h: 50, points: 15, collected: false }
        ]
    },
    BESS: {
        bg: "assets/images/BESS.png",
        items: [
            { id: "B_EMS", name: "BESS EMS Server", x: 190, y: 195, w: 115, h: 70, points: 25, collected: false },
            { id: "B_BMS", name: "BMS Controller", x: 335, y: 195, w: 105, h: 70, points: 20, collected: false },
            { id: "B_GW", name: "SCADA Gateway", x: 480, y: 390, w: 150, h: 100, points: 30, collected: false },
            { id: "B_FW", name: "Site Firewall", x: 672, y: 210, w: 110, h: 60, points: 25, collected: false },
            { id: "B_VPN", name: "Vendor VPN Gateway", x: 815, y: 440, w: 110, h: 50, points: 35, collected: false }
        ]
    },
    SOLAR: {
        bg: "assets/images/Solar.png",
        items: [
            { id: "S_INV", name: "Inverter Controller", x: 60, y: 160, w: 180, h: 40, points: 15, collected: false },
            { id: "S_PLC", name: "String Combiner PLC", x: 60, y: 430, w: 180, h: 60, points: 20, collected: false },
            { id: "S_SRV", name: "Solar SCADA Server", x: 295, y: 160, w: 200, h: 50, points: 30, collected: false },
            { id: "S_RTU", name: "Plant RTU", x: 295, y: 320, w: 200, h: 45, points: 25, collected: false },
            { id: "S_SW", name: "Field Switch", x: 540, y: 360, w: 170, h: 40, points: 10, collected: false },
            { id: "S_GW", name: "Remote Access Gateway", x: 540, y: 440, w: 170, h: 50, points: 35, collected: false }
        ]
    }
};

// Load sub-page images
const subImages = {};
Object.keys(subPageAssets).forEach(key => {
    subImages[key] = new Image();
    subImages[key].src = subPageAssets[key].bg;
});


// --- HELPER FUNCTIONS ---

function isInside(obj, x, y) {
    return x >= obj.x && x <= obj.x + obj.w && y >= obj.y && y <= obj.y + obj.h;
}

// --- RENDERING ---

function renderHUD() {
    // Top Bar
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, 100);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, 100); ctx.lineTo(canvas.width, 100); ctx.stroke();

    // Text
    ctx.font = "16px monospace";
    ctx.fillStyle = "#00bb00";
    ctx.textAlign = "left";
    ctx.fillText(`OP: ${player.name || "UNAUTHORIZED"}`, 40, 35);

    ctx.textAlign = "right";
    ctx.fillStyle = "#bb0000";
    ctx.fillText(`SCORE: ${player.score}`, canvas.width - 40, 35);

    // Nav Buttons
    navButtons.forEach(btn => {
        const h = isInside(btn, mouseX, mouseY);
        // Highlight active state
        const isActive = currentState === btn.state;

        ctx.textAlign = "center";

        if (h || isActive) {
            ctx.fillStyle = "#fff";
            ctx.fillRect(btn.x, btn.y, btn.w, btn.h);
            ctx.fillStyle = "#000";
            ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 20);
        } else {
            ctx.fillStyle = "#00bb00";
            ctx.strokeStyle = "#00bb00";
            ctx.strokeRect(btn.x, btn.y, btn.w, btn.h);
            ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 20);
        }
    });
}

function renderLogin() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00bb00";
    ctx.textAlign = "center";
    ctx.font = "20px monospace";

    ctx.fillText("AUTHENTICATION REQUIRED", canvas.width / 2, 200);

    ctx.fillStyle = "#fff";
    ctx.fillText("TYPE YOUR USERNAME: " + loginInput + (Date.now() % 1000 < 500 ? "_" : " "), canvas.width / 2, 270);

    ctx.fillStyle = "#555";
    ctx.font = "14px monospace";
    ctx.fillText("(TYPE USERNAME & PRESS ENTER)", canvas.width / 2, 320);
}

function renderPlaceholderScreen(title, subtitle) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    renderHUD();

    ctx.fillStyle = "#00bb00";
    ctx.textAlign = "center";
    ctx.font = "20px monospace";
    ctx.fillText(`--- ${title} ---`, canvas.width / 2, 150);

    ctx.fillStyle = "#555";
    ctx.font = "16px monospace";
    ctx.fillText(subtitle || "SYSTEM OFFLINE / UNDER CONSTRUCTION", canvas.width / 2, 250);

    ctx.fillStyle = "#555";
    ctx.fillText("[ PRESS ESC TO RETURN ]", canvas.width / 2, canvas.height - 50);
}

function renderInventory() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    renderHUD();

    ctx.fillStyle = "#00bb00";
    ctx.textAlign = "center";
    ctx.font = "20px monospace";
    ctx.fillText("--- SECURED DATABASE ---", canvas.width / 2, 150);

    ctx.textAlign = "left";
    ctx.font = "16px monospace";
    if (player.inventory.length === 0) {
        ctx.fillStyle = "#555";
        ctx.fillText("NO ASSETS COLLECTED", 150, 200);
    } else {
        player.inventory.forEach((item, i) => {
            ctx.fillStyle = "#00ff00";
            ctx.fillText(`> [SECURED] ${item.name} (+${item.points})`, 150, 200 + (i * 30));
        });
    }

    ctx.fillStyle = "#555";
    ctx.textAlign = "center";
    ctx.fillText("[ PRESS ESC TO RETURN ]", canvas.width / 2, canvas.height - 50);
}

function renderGenericSubPage(key) {
    // Shared render logic for WTG, BESS, SOLAR
    const assetData = subPageAssets[key];
    const img = subImages[key];

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Background
    if (img && img.complete) {
        ctx.globalAlpha = 0.3; // Darken bg
        ctx.drawImage(img, 0, 100, canvas.width, canvas.height - 100);
        ctx.globalAlpha = 1.0;
    }

    renderHUD();

    // Title
    ctx.textAlign = "center";
    ctx.fillStyle = "#00ffaa";
    ctx.font = "20px monospace";
    ctx.fillText(`SYSTEM: ${key}`, canvas.width / 2, 130);

    // Interactive Items
    assetData.items.forEach(item => {
        if (!item.collected) {
            const h = isInside(item, mouseX, mouseY);

            // Draw item box
            ctx.fillStyle = h ? "rgba(0, 255, 0, 0.2)" : "rgba(0, 0, 0, 0.5)";
            ctx.fillRect(item.x, item.y, item.w, item.h);

            ctx.strokeStyle = h ? "#fff" : "#00ff00";
            ctx.lineWidth = 2;
            ctx.strokeRect(item.x, item.y, item.w, item.h);

            // Label
            ctx.fillStyle = "#fff";
            ctx.font = "12px monospace";
            ctx.textAlign = "center";
            ctx.fillText(item.name, item.x + item.w / 2, item.y + item.h / 2 + 5);
        }
    });

    ctx.fillStyle = "#555";
    ctx.textAlign = "center";
    ctx.fillText("[ PRESS ESC TO RETURN ]", canvas.width / 2, canvas.height - 30);
}

// --- INPUT HANDLING ---

// --- INPUT HANDLING ---

window.addEventListener("keydown", (e) => {
    // Global ESC
    if (e.key === "Escape") {
        if (currentState !== GameState.INTRO && currentState !== GameState.LOGIN) {
            currentState = GameState.MAIN_PAGE;
        }
        return;
    }

    if (currentState === GameState.INTRO) {
        if (e.code === "Space") {
            if (typeof introState !== 'undefined' && introState.complete) {
                currentState = GameState.STORY;
                initStory(); // RESET STORY
            } else {
                // Skip animation
                if (typeof introState !== 'undefined') {
                    introState.currentLine = introState.lines.length;
                    introState.complete = true;
                }
            }
        }
    }
    else if (currentState === GameState.STORY) {
        if (e.key === "Enter") {
            if (typeof storyState !== 'undefined' && storyState.complete) {
                currentState = GameState.LOGIN;
            } else {
                // Skip animation
                if (typeof storyState !== 'undefined') {
                    storyState.currentLine = storyState.lines.length;
                    storyState.complete = true;
                }
            }
        }
    }
    else if (currentState === GameState.LOGIN) {
        if (e.key === "Enter") {
            player.name = loginInput.trim() || "OPERATOR";
            currentState = GameState.MAIN_PAGE;
        } else if (e.key === "Backspace") {
            loginInput = loginInput.slice(0, -1);
        } else if (e.key.length === 1) {
            loginInput += e.key;
        }
    }
});

canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    // Correct mouse position: (Client - RectLeft) * (InternalWidth / RectWidth)
    // This works regardless of CSS transform scale
    mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
    mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);
});

canvas.addEventListener("click", () => {
    // 1. HUD Navigation (Always active in game modes)
    // SYSTEM UPDATE: Disable Canvas HUD clicks when in Management Phases (DOM handles UI)
    const managementPhases = [GameState.ASSET_INVENTORY, GameState.PATCH_MGMT, GameState.ACCESS_MGMT, GameState.BCM_DR];

    if (managementPhases.includes(currentState)) {
        return; // Let DOM handle clicks
    }

    if (currentState !== GameState.INTRO && currentState !== GameState.STORY && currentState !== GameState.LOGIN) {
        navButtons.forEach(btn => {
            if (isInside(btn, mouseX, mouseY)) {
                // Progression Check
                if (btn.id === "PATCH" && !player.progress.inventory) return;
                if (btn.id === "ACCESS" && !player.progress.patching) return;
                if (btn.id === "BCM" && !player.progress.access) return;

                if (btn.state) currentState = btn.state;
            }
        });
    }

    // 2. Main Page Zones
    if (currentState === GameState.MAIN_PAGE) {
        // systemZones is global from mainPage.js
        if (typeof systemZones !== 'undefined') {
            systemZones.forEach(zone => {
                if (isInside(zone, mouseX, mouseY)) {
                    // console.log("Clicked Zone:", zone.name, zone.state);
                    currentState = zone.state;
                }
            });
        }
    }

    // 3. Sub-page Item Collection
    const currentKey = Object.keys(AppStateMap).find(key => AppStateMap[key] === currentState);
    let assetsToCheck = [];

    if (currentKey && subPageAssets[currentKey]) {
        assetsToCheck = subPageAssets[currentKey].items;
    } else if (currentState === GameState.SUBSTATION && window.substationAssets) {
        assetsToCheck = window.substationAssets;
    }

    assetsToCheck.forEach(item => {
        if (!item.collected && isInside(item, mouseX, mouseY)) {
            item.collected = true;
            player.score += item.points;
            player.phaseScores.inventory += item.points; // Track Phase Score
            player.inventory.push(item);
            // Optional: Play sound
        }
    });
});

// Helper to map State -> Key for Assets
const AppStateMap = {
    "WTG": GameState.WTG,
    "BESS": GameState.BESS,
    "SOLAR": GameState.SOLAR
    // SUBSTATION handled separately via its own module
};


// --- MAIN LOOP ---

// --- MAIN LOOP ---

const DOM_STATES = [
    GameState.ASSET_INVENTORY,
    GameState.PATCH_MGMT,
    GameState.ACCESS_MGMT,
    GameState.BCM_DR
];

let lastState = null;

function gameLoop() {
    // 1. State Transition Handling (Run once per state change)
    if (currentState !== lastState) {
        // Exit Logic
        if (DOM_STATES.includes(lastState) && !DOM_STATES.includes(currentState)) {
            // Leaving a DOM state -> Hide UI
            document.getElementById("ui-layer").classList.add("hidden");
        }

        // Entry Logic
        if (DOM_STATES.includes(currentState)) {
            // Entering a DOM state -> Render ONCE
            switch (currentState) {
                case GameState.ASSET_INVENTORY:
                    InventoryPhase.render();
                    break;
                case GameState.PATCH_MGMT:
                    if (!PatchingPhase.initialized) { PatchingPhase.init(); PatchingPhase.initialized = true; }
                    PatchingPhase.render();
                    break;
                case GameState.ACCESS_MGMT:
                    if (!AccessPhase.initialized) { AccessPhase.init(); AccessPhase.initialized = true; }
                    AccessPhase.render();
                    break;
                case GameState.BCM_DR:
                    if (!BCMPhase.initialized) { BCMPhase.init(); BCMPhase.initialized = true; }
                    BCMPhase.render();
                    break;
            }
        }

        lastState = currentState;
    }

    // 2. Continuous Canvas Rendering (Run every frame)
    // Only render canvas if we are NOT in a DOM state (or allowed to see bg)
    // We can keep rendering background behind DOM for visual continuity if desired.

    switch (currentState) {
        case GameState.INTRO:
            if (typeof introState === 'undefined' || !introState.lines || introState.lines.length === 0) {
                initIntro();
            }
            renderIntro(ctx, canvas);
            break;

        case GameState.STORY:
            if (typeof storyState === 'undefined' || !storyState.lines || storyState.lines.length === 0) {
                initStory();
            }
            renderStory(ctx, canvas);
            break;

        case GameState.LOGIN:
            renderLogin();
            break;

        case GameState.MAIN_PAGE:
            renderMainPage(ctx, canvas);
            renderHUD();
            break;

        case GameState.SUBSTATION:
            renderSubstation(ctx, canvas);
            break;

        case GameState.WTG:
            renderGenericSubPage("WTG");
            break;

        case GameState.BESS:
            renderGenericSubPage("BESS");
            break;

        case GameState.SOLAR:
            renderGenericSubPage("SOLAR");
            break;

        // For DOM states, we don't strictly need to re-render the canvas every frame 
        // if it's covered, but drawing the HUD/MainBG behind it looks nice.
        // However, to save performance/battery, we could skip it. 
        // Let's just draw specific placeholders or nothing.
        case GameState.ASSET_INVENTORY:
        case GameState.PATCH_MGMT:
        case GameState.ACCESS_MGMT:
        case GameState.BCM_DR:
            // Optional: Draw a static background or just leave previous frame
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            // renderHUD(); // Optional custom HUD for DOM modes?
            break;

        default:
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            break;
    }

    requestAnimationFrame(gameLoop);
}

// Start
gameLoop();