/**
 * main.js - Refactored for Modular Architecture
 */

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set internal resolution
canvas.width = 1920;
canvas.height = 1080;

// GameState is now defined in src/states.js
// systemZones is defined in src/mainPage.js (globally)

// --- GLOBAL STATE ---
// (Moved to src/states.js)

// --- ASSETS & DATA ---

// Navigation Buttons (HUD)
const navButtons = [
    { id: "INV", label: "[ INVENTORY ]", state: GameState.ASSET_INVENTORY, x: 100, y: 20, w: 350, h: 60, color: "#39ff14" },
    { id: "PATCH", label: "[ PATCH MGMT ]", state: GameState.PATCH_MGMT, x: 500, y: 20, w: 350, h: 60, color: "#39ff14" },
    { id: "ACCESS", label: "[ ACCESS MGMT ]", state: GameState.ACCESS_MGMT, x: 900, y: 20, w: 350, h: 60, color: "#39ff14" },
    { id: "BCM", label: "[ BCM / DR ]", state: GameState.BCM_DR, x: 1300, y: 20, w: 350, h: 60, color: "#39ff14" }
];

const helpButton = { id: "HELP", x: 1700, y: 25, w: 50, h: 50 };

// Helper to map State -> Key for Assets
const AppStateMap = {
    "WTG": GameState.WTG,
    "BESS": GameState.BESS,
    "SOLAR": GameState.SOLAR,
    "OPGW": GameState.OPGW
    // SUBSTATION handled separately via its own module
};
// --- ASSETS & DATA ---

// Sub-page Assets (WTG, BESS, SOLAR) - These could also be moved to their own files eventually
const subPageAssets = {
    WTG: {
        bg: "assets/images/WTG.png",
        items: [
            { id: "W_PLC", name: "Turbine PLC", x: 170, y: 110, w: 600, h: 100, points: 20, collected: false, details: { vendor: "CyberLogic OT", age: "4 years", fw: "v3.1.2-stable", ip: "10.10.1.12", mac: "00:1A:2B:3C:4D:5E" } },
            { id: "W_SW", name: "Turbine Switch", x: 170, y: 250, w: 600, h: 100, points: 15, collected: false, details: { vendor: "Nexus OT Systems", age: "2 years", fw: "OS v1.4.0", ip: "10.10.1.5", mac: "00:1A:2B:3C:4D:F2" } },
            { id: "W_CMU", name: "Condition Monitoring Unit", x: 170, y: 450, w: 600, h: 100, points: 25, collected: false, details: { vendor: "Aether Control", age: "5 years", fw: "v5.0.1", ip: "10.10.1.20", mac: "00:1A:2B:3C:4D:08" } },
            { id: "W_MOD1", name: "Controller Module A", x: 1250, y: 140, w: 290, h: 150, points: 10, collected: false, details: { vendor: "Titan Dynamics", age: "3 years", fw: "v2.2.0", ip: "10.10.1.101", mac: "00:1A:2B:3C:4D:A1" } },
            { id: "W_MOD2", name: "Controller Module B", x: 1250, y: 430, w: 290, h: 150, points: 10, collected: false, details: { vendor: "Titan Dynamics", age: "3 years", fw: "v2.2.0", ip: "10.10.1.102", mac: "00:1A:2B:3C:4D:A2" } }
        ]
    },
    BESS: {
        bg: "assets/images/BESS.png",
        items: [
            { id: "B_EMS", name: "BESS EMS Server", x: 240, y: 188, w: 530, h: 60, points: 30, collected: false, details: { vendor: "GridStream Industrial", age: "1 year", fw: "v8.4.1", ip: "10.20.5.10", mac: "00:1A:2B:7E:4D:10" } },
            { id: "B_BMS1", name: "BMS Controller #1", x: 240, y: 268, w: 530, h: 60, points: 15, collected: false, details: { vendor: "Flux Energy", age: "3 years", fw: "v2.9.0", ip: "10.20.5.21", mac: "00:1A:2B:7E:4D:21" } },
            { id: "B_BMS2", name: "BMS Controller #2", x: 240, y: 348, w: 530, h: 60, points: 15, collected: false, details: { vendor: "Flux Energy", age: "3 years", fw: "v2.9.0", ip: "10.20.5.22", mac: "00:1A:2B:7E:4D:22" } },
            { id: "B_MET", name: "Smart Metering Unit", x: 240, y: 560, w: 530, h: 250, points: 20, collected: false, details: { vendor: "Quantec Power", age: "2 years", fw: "v1.12", ip: "10.20.5.50", mac: "00:1A:2B:7E:4D:50" } },
            { id: "B_VPN", name: "Vendor VPN Gateway", x: 1270, y: 188, w: 490, h: 60, points: 30, collected: false, details: { vendor: "SecureLink OT", age: "1 year", fw: "v4.5.3-sec", ip: "10.20.10.1", mac: "00:1A:2B:7E:FF:01" } },
            { id: "B_FW", name: "Site OT Firewall", x: 1270, y: 290, w: 490, h: 65, points: 35, collected: false, details: { vendor: "Nexus OT Systems", age: "2 years", fw: "OS v2.1.0", ip: "10.20.10.5", mac: "00:1A:2B:7E:FF:05" } },
            { id: "B_SW", name: "Industrial OT Switch", x: 1270, y: 430, w: 490, h: 65, points: 20, collected: false, details: { vendor: "Nexus OT Systems", age: "4 years", fw: "OS v1.8.2", ip: "10.20.10.10", mac: "00:1A:2B:7E:FF:10" } },
            { id: "B_GW", name: "SCADA Gateway", x: 1270, y: 570, w: 490, h: 65, points: 25, collected: false, details: { vendor: "CyberLogic OT", age: "5 years", fw: "v4.0.0", ip: "10.20.10.20", mac: "00:1A:2B:7E:FF:20" } }
        ]
    },
    SOLAR: {
        bg: "assets/images/Solar.png",
        items: [
            { id: "S_INV_C1", name: "Inverter Controller 1", x: 45, y: 90, w: 410, h: 160, points: 20, collected: false, details: { vendor: "Helios OT", age: "3 years", fw: "v5.2", ip: "10.30.2.11", mac: "00:1A:2B:9F:4D:11" } },
            { id: "S_INV_C2", name: "Inverter Controller 2", x: 45, y: 265, w: 410, h: 160, points: 20, collected: false, details: { vendor: "Helios OT", age: "3 years", fw: "v5.2", ip: "10.30.2.12", mac: "00:1A:2B:9F:4D:12" } },
            { id: "S_SRV", name: "Solar SCADA Server", x: 550, y: 90, w: 495, h: 125, points: 30, collected: false, details: { vendor: "CyberLogic OT", age: "1 year", fw: "v2.8-cloud", ip: "10.30.5.10", mac: "00:1A:2B:9F:4D:A1" } },
            { id: "S_RTU", name: "Plant RTU", x: 550, y: 340, w: 495, h: 90, points: 25, collected: false, details: { vendor: "Aether Control", age: "6 years", fw: "v3.9.1", ip: "10.30.5.15", mac: "00:1A:2B:9F:4D:B2" } },
            { id: "S_MET", name: "Production Power Meter", x: 550, y: 490, w: 495, h: 80, points: 15, collected: false, details: { vendor: "Quantec Power", age: "4 years", fw: "v2.0", ip: "10.30.5.20", mac: "00:1A:2B:9F:4D:C3" } },
            { id: "S_SW", name: "Field Network Switch", x: 1100, y: 550, w: 425, h: 140, points: 20, collected: false, details: { vendor: "Nexus OT Systems", age: "2 years", fw: "OS v1.5.1", ip: "10.30.10.10", mac: "00:1A:2B:9F:4D:D4" } },
            { id: "S_RAG", name: "Remote Access Gateway", x: 1100, y: 720, w: 425, h: 140, points: 30, collected: false, details: { vendor: "SecureLink OT", age: "2 years", fw: "v3.1", ip: "10.30.10.1", mac: "00:1A:2B:9F:4D:E5" } }
        ]
    },
    OPGW: {
        bg: "assets/images/OPGW.png",
        items: [
            { id: "O_SDH1", name: "SDH Module 1", x: 315, y: 300, w: 125, h: 160, points: 25, collected: false, details: { vendor: "OptiCore Networks", age: "5 years", fw: "v12.4.L", ip: "172.16.50.11", mac: "00:1A:3C:4D:5E:01" } },
            { id: "O_SDH2", name: "SDH Module 2", x: 315, y: 485, w: 125, h: 160, points: 25, collected: false, details: { vendor: "OptiCore Networks", age: "5 years", fw: "v12.4.L", ip: "172.16.50.12", mac: "00:1A:3C:4D:5E:02" } },
            { id: "O_TERM", name: "Fiber Termination Tray", x: 450, y: 310, w: 230, h: 330, points: 30, collected: false, details: { vendor: "TeraLink Physical", age: "8 years", fw: "N/A", ip: "Passive", mac: "N/A" } }
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
    ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
    ctx.fillRect(0, 0, canvas.width, 100);

    // Glowing thick border for HUD
    ctx.strokeStyle = "#39ff14";
    ctx.lineWidth = 6;
    ctx.strokeRect(10, 10, canvas.width - 20, 100);

    // Text (Operator & Score) positioned in Top Right
    ctx.font = "bold 20px monospace";
    ctx.textAlign = "right";

    // OP Name
    ctx.fillStyle = "#39ff14";
    ctx.fillText(`OPERATOR: ${player.name || "UNAUTHORIZED"}`, canvas.width - 40, 45);

    // Score
    ctx.fillStyle = "white";
    ctx.fillText(`SCORE: ${player.score.toString().padStart(6, '0')}`, canvas.width - 40, 75);

    // Nav Buttons
    navButtons.forEach(btn => {
        const h = isInside(btn, mouseX, mouseY);
        const isActive = currentState === btn.state;
        const btnColor = "#39ff14";

        ctx.textAlign = "center";
        ctx.font = "bold 22px monospace";

        if (h || isActive) {
            ctx.fillStyle = btnColor;
            ctx.fillRect(btn.x, btn.y, btn.w, btn.h);
            ctx.fillStyle = "#000";
            ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + btn.h / 2 + 8);

            // Neon Glow
            ctx.shadowBlur = 15;
            ctx.shadowColor = btnColor;
            ctx.strokeRect(btn.x, btn.y, btn.w, btn.h);
            ctx.shadowBlur = 0;
        } else {
            ctx.lineWidth = 2;
            ctx.fillStyle = btnColor;
            ctx.strokeStyle = btnColor;
            ctx.strokeRect(btn.x, btn.y, btn.w, btn.h);
            ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + btn.h / 2 + 8);
        }
    });

    // 🆕 Help Icon "?"
    const hHelp = isInside(helpButton, mouseX, mouseY);
    ctx.textAlign = "center";
    ctx.font = "bold 34px monospace";
    ctx.lineWidth = 3;
    ctx.strokeStyle = hHelp ? "#fff" : "var(--retro-green)";
    ctx.fillStyle = hHelp ? "#fff" : "var(--retro-green)";

    ctx.strokeRect(helpButton.x, helpButton.y, helpButton.w, helpButton.h);
    ctx.fillText("?", helpButton.x + helpButton.w / 2, helpButton.y + helpButton.h / 2 + 12);

    if (hHelp) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#fff";
        ctx.strokeRect(helpButton.x, helpButton.y, helpButton.w, helpButton.h);
        ctx.shadowBlur = 0;
    }
}

function renderLogin() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Some background tech lines (grid)
    ctx.strokeStyle = "rgba(57, 255, 20, 0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 80) {
        ctx.beginPath();
        ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
    for (let j = 0; j < canvas.height; j += 80) {
        ctx.beginPath();
        ctx.moveTo(0, j); ctx.lineTo(canvas.width, j);
        ctx.stroke();
    }

    ctx.fillStyle = "#39ff14";
    ctx.textAlign = "center";
    ctx.font = "bold 64px 'Courier New', monospace";
    ctx.shadowBlur = 25;
    ctx.shadowColor = "#39ff14";
    ctx.fillText("NETWORK ACCESS CONTROL", canvas.width / 2, 400);
    ctx.shadowBlur = 0;

    ctx.font = "bold 32px 'Courier New', monospace";
    ctx.fillStyle = "#fff";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#39ff14";
    ctx.fillText("OPERATOR IDENTIFICATION: " + loginInput + (Date.now() % 1000 < 500 ? "█" : " "), canvas.width / 2, 520);

    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.font = "20px monospace";
    ctx.shadowBlur = 0;
    ctx.fillText("> ENTER CREDENTIALS AND PRESS [SPACE] TO INITIALIZE <", canvas.width / 2, 650);
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
        ctx.drawImage(img, 0, 100, canvas.width, canvas.height - 100);
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
        if (typeof InventoryPhase !== 'undefined' && InventoryPhase.isFrozen) {
            showStatusMessage("NAVIGATION LOCKED: ASSET REGISTER FROZEN. ESCAPE DISABLED.", 3000);
            return;
        }
        if (currentState !== GameState.INTRO && currentState !== GameState.LOGIN) {
            currentState = GameState.MAIN_PAGE;
        }
        return;
    }

    if (currentState === GameState.INTRO) {
        if (e.code === "Space") {
            if (typeof introState !== 'undefined' && introState.complete) {
                currentState = GameState.SCADA_INTRO;
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
        if (e.code === "Space") {
            if (typeof storyState !== 'undefined' && storyState.complete) {
                currentState = GameState.INTRO;
                initIntro();
            } else {
                // Skip animation
                if (typeof storyState !== 'undefined') {
                    storyState.currentLine = storyState.lines.length;
                    storyState.complete = true;
                }
            }
        }
    }
    else if (currentState === GameState.SCADA_INTRO) {
        if (e.code === "Space") {
            currentState = GameState.LOGIN;
        }
    }
    else if (currentState === GameState.LOGIN) {
        if (e.code === "Space") {
            player.name = loginInput.trim() || "OPERATOR";
            currentState = GameState.MAIN_PAGE;
        } else if (e.key === "Backspace") {
            loginInput = loginInput.slice(0, -1);
        } else if (e.key.length === 1 && e.key !== " ") {
            loginInput += e.key;
        }
    }
    else if (currentState === GameState.MAIN_PAGE && !window.gameStarted) {
        if (e.code === "Space") {
            window.gameStarted = true;
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

canvas.addEventListener("click", (e) => {
    // Calculate precise coordinates at time of click
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    // 0. Help Click?
    if (isInside(helpButton, x, y)) {
        if (typeof HelpSystem !== 'undefined') {
            HelpSystem.showHelp();
            return;
        }
    }

    // 1. HUD Navigation (Always active in game modes)
    const managementPhases = [GameState.ASSET_INVENTORY, GameState.PATCH_MGMT, GameState.ACCESS_MGMT, GameState.BCM_DR];

    if (managementPhases.includes(currentState)) {
        return; // Let DOM handle clicks
    }

    if (currentState !== GameState.INTRO && currentState !== GameState.STORY && currentState !== GameState.LOGIN) {
        navButtons.forEach(btn => {
            if (isInside(btn, x, y)) {
                // Phase progression check
                if (btn.id === "PATCH" && !player.progress.inventory) {
                    showStatusMessage("ERROR: ASSET INVENTORY REQUIRED BEFORE PATCHING");
                    return;
                }
                if (btn.id === "ACCESS" && !player.progress.patching) {
                    showStatusMessage("ERROR: PATCHING PHASE MUST BE COMPLETED FIRST");
                    return;
                }
                if (btn.id === "BCM" && !player.progress.access) {
                    showStatusMessage("ERROR: ACCESS CONTROL MUST BE SECURED FIRST");
                    return;
                }

                // Lock navigation if in a mandatory phase and not finished
                const isCurrentPhasePatching = currentState === GameState.PATCH_MGMT;
                if (isCurrentPhasePatching && !player.progress.patching && btn.state !== GameState.PATCH_MGMT) {
                    showStatusMessage("ERROR: PATCHING IN PROGRESS. COMPLETE TASKS BEFORE EXIT.");
                    return;
                }

                const isCurrentPhaseInventory = currentState === GameState.ASSET_INVENTORY;
                if (isCurrentPhaseInventory && !player.progress.inventory && btn.state !== GameState.ASSET_INVENTORY) {
                    showStatusMessage("ERROR: INVENTORY IN PROGRESS. LOCK REGISTER TO PROCEED.");
                    return;
                }

                if (btn.state) currentState = btn.state;
            }
        });
    }

    // 2. Main Page Zones
    if (currentState === GameState.MAIN_PAGE) {
        if (!window.gameStarted) return;

        if (typeof systemZones !== 'undefined') {
            systemZones.forEach(zone => {
                if (isInside(zone, x, y)) {
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
        if (!InventoryPhase.isFrozen && !item.collected && isInside(item, mouseX, mouseY)) {
            item.collected = true;
            player.score += item.points;
            player.phaseScores.inventory += item.points; // Track Phase Score
            player.inventory.push(item);
            // Optional: Play sound
        }
    });
});



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

        case GameState.SCADA_INTRO:
            renderScadaGameIntro(ctx, canvas);
            break;

        case GameState.MAIN_PAGE:
            renderMainPage(ctx, canvas);
            renderHUD();

            if (!gameStarted) {
                // Overlay
                ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
                ctx.fillRect(0, 100, canvas.width, canvas.height - 100);

                ctx.textAlign = "center";
                ctx.fillStyle = "#00ff00";
                ctx.font = "24px monospace";
                ctx.fillText("OPERATIONAL MAP READY", canvas.width / 2, 250);

                ctx.font = "16px monospace";
                ctx.fillStyle = "#00bb00";
                ctx.fillText("ALL SYSTEMS REPORTING STATUS: VULNERABLE", canvas.width / 2, 300);

                if (Date.now() % 1000 < 500) {
                    ctx.fillStyle = "#fff";
                    ctx.fillText("> PRESS [SPACE] TO INITIALIZE DEFENSE PROTOCOLS <", canvas.width / 2, 400);
                }
            }
            break;

        case GameState.SUBSTATION:
            renderSubstation(ctx, canvas);
            renderHUD();
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

        case GameState.OPGW:
            renderOPGW(ctx, canvas);
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