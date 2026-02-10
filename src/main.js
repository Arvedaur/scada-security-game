/**
 * main.js - Comprehensive Fix
 * This version handles image loading states and internalizes critical data.
 */

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 1. INTERNAL STATES (If states.js fails, these will take over)
const GameState = window.GameState || {
    INTRO: "INTRO",
    STORY: "STORY",
    LOGIN: "LOGIN",
    MAIN_PAGE: "MAIN_PAGE",
    ASSET_INVENTORY: "ASSET_INVENTORY",
    WTG: "WTG",
    BESS: "BESS",
    SOLAR: "SOLAR",
    SUBSTATION: "SUBSTATION"
};

// 2. ASSETS & IMAGES
const images = {
    MAIN_PAGE: new Image(),
    WTG: new Image(),
    BESS: new Image(),
    SOLAR: new Image(),
    SUBSTATION: new Image()
};

// Critical: Set sources
images.MAIN_PAGE.src = "assets/images/MainPage.png";
images.WTG.src = "assets/images/WTG.png";
images.BESS.src = "assets/images/BESS.png";
images.SOLAR.src = "assets/images/Solar.png";
images.SUBSTATION.src = "assets/images/Substation.png";

let currentState = GameState.INTRO;
let mouseX = 0, mouseY = 0, loginInput = "";
const player = { name: "", score: 0, inventory: [] };

// 3. NAVIGATION & ZONES
const navButtons = [
    { id: "INV",    label: "[ INVENTORY ]",  state: "ASSET_INVENTORY", x: 40,  y: 60, w: 130, h: 30 },
    { id: "PATCH",  label: "[ PATCH MGMT ]", state: "PATCH_MGMT",      x: 180, y: 60, w: 130, h: 30 },
    { id: "ACCESS", label: "[ ACCESS MGMT ]",state: "ACCESS_MGMT",     x: 320, y: 60, w: 130, h: 30 },
    { id: "BCM",    label: "[ BCM / DR ]",   state: "BCM_DR",          x: 460, y: 60, w: 130, h: 30 }
];

// Re-defining zones locally to ensure click detection works
const internalZones = [
    { id: "WTG",  x: 100, y: 150, w: 200, h: 150, state: "WTG" },
    { id: "BESS", x: 350, y: 150, w: 200, h: 150, state: "BESS" },
    { id: "SOLAR",x: 600, y: 150, w: 200, h: 150, state: "SOLAR" },
    { id: "SUB",  x: 350, y: 350, w: 250, h: 150, state: "SUBSTATION" }
];

const allAssets = {
    WTG: [{ id: "W1", name: "Turbine PLC", x: 150, y: 250, w: 100, h: 50, points: 10, collected: false }],
    BESS: [{ id: "B1", name: "Battery EMS", x: 200, y: 300, w: 100, h: 50, points: 20, collected: false }],
    SOLAR: [{ id: "S1", name: "Inverter", x: 300, y: 250, w: 100, h: 50, points: 15, collected: false }],
    SUBSTATION: [{ id: "SUB1", name: "HV Relay", x: 400, y: 200, w: 100, h: 50, points: 25, collected: false }]
};

// 4. RENDERING LOGIC
function renderHUD() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, 100);
    ctx.strokeStyle = "#333";
    ctx.beginPath(); ctx.moveTo(0, 100); ctx.lineTo(canvas.width, 100); ctx.stroke();

    ctx.font = "16px monospace";
    ctx.fillStyle = "#00bb00";
    ctx.textAlign = "left";
    ctx.fillText(`OP: ${player.name || "UNAUTHORIZED"}`, 40, 35);
    
    ctx.textAlign = "right";
    ctx.fillStyle = "#bb0000";
    ctx.fillText(`SCORE: ${player.score}`, canvas.width - 40, 35);

    navButtons.forEach(btn => {
        const h = isInside(btn, mouseX, mouseY);
        ctx.fillStyle = h ? "#fff" : "#00bb00";
        ctx.textAlign = "center";
        ctx.fillText(btn.label, btn.x + btn.w/2, btn.y + 20);
    });
}

function renderMainMap() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 100, canvas.width, canvas.height - 100);
    
    if (images.MAIN_PAGE.complete && images.MAIN_PAGE.naturalWidth !== 0) {
        ctx.drawImage(images.MAIN_PAGE, 0, 100, canvas.width, canvas.height - 100);
    } else {
        // Fallback if image fails to load
        ctx.fillStyle = "#111";
        ctx.fillRect(50, 150, 860, 340);
        ctx.fillStyle = "#00bb00";
        ctx.textAlign = "center";
        ctx.fillText("LOADING DATA MAP...", canvas.width/2, canvas.height/2);
    }
}

function renderSubPage(img, assets) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (img.complete) {
        ctx.globalAlpha = 0.4;
        ctx.drawImage(img, 0, 100, canvas.width, canvas.height - 100);
        ctx.globalAlpha = 1.0;
    }
    renderHUD();
    assets.forEach(a => {
        if (!a.collected) {
            const h = isInside(a, mouseX, mouseY);
            ctx.strokeStyle = h ? "#fff" : "#00bb00";
            ctx.strokeRect(a.x, a.y, a.w, a.h);
        }
    });
}

// 5. HELPER & EVENTS
function isInside(obj, x, y) {
    return x >= obj.x && x <= obj.x + obj.w && y >= obj.y && y <= obj.y + obj.h;
}

window.addEventListener("keydown", (e) => {
    if (currentState === GameState.INTRO) currentState = GameState.STORY;
    else if (currentState === GameState.STORY) currentState = GameState.LOGIN;
    else if (currentState === GameState.LOGIN && e.key === "Enter") {
        player.name = loginInput || "OPERATOR";
        currentState = GameState.MAIN_PAGE;
    } else if (currentState === GameState.LOGIN) {
        if (e.key === "Backspace") loginInput = loginInput.slice(0, -1);
        else if (e.key.length === 1) loginInput += e.key;
    }
    if (e.key === "Escape") currentState = GameState.MAIN_PAGE;
});

canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

canvas.addEventListener("click", () => {
    // HUD Buttons
    navButtons.forEach(btn => {
        if (isInside(btn, mouseX, mouseY)) currentState = GameState[btn.state];
    });

    // Map Zones
    if (currentState === GameState.MAIN_PAGE) {
        internalZones.forEach(z => {
            if (isInside(z, mouseX, mouseY)) currentState = GameState[z.state];
        });
    }

    // Assets
    const currentAssets = allAssets[currentState];
    if (currentAssets) {
        currentAssets.forEach(a => {
            if (isInside(a, mouseX, mouseY) && !a.collected) {
                a.collected = true;
                player.score += a.points;
                player.inventory.push(a);
            }
        });
    }
});

// 6. MAIN LOOP
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    switch (currentState) {
        case GameState.INTRO:
            ctx.fillStyle = "#000"; ctx.fillRect(0,0,960,540);
            ctx.fillStyle = "#00bb00"; ctx.textAlign="center"; ctx.font="20px monospace";
            ctx.fillText("SCADA TERMINAL v1.0 - PRESS ANY KEY", 480, 270);
            break;
        case GameState.LOGIN:
            ctx.fillStyle = "#000"; ctx.fillRect(0,0,960,540);
            ctx.fillStyle = "#00bb00"; ctx.textAlign="center";
            ctx.fillText("ENTER ACCESS CODE: " + loginInput + "_", 480, 270);
            break;
        case GameState.MAIN_PAGE:
            renderMainMap();
            renderHUD();
            break;
        case GameState.ASSET_INVENTORY:
            ctx.fillStyle = "#000"; ctx.fillRect(0,0,960,540);
            renderHUD();
            ctx.textAlign="center"; ctx.fillText("--- SECURED DATABASE ---", 480, 150);
            player.inventory.forEach((item, i) => {
                ctx.textAlign="left"; ctx.fillText(`> ${item.name}`, 150, 200 + (i*30));
            });
            break;
        case GameState.WTG: renderSubPage(images.WTG, allAssets.WTG); break;
        case GameState.BESS: renderSubPage(images.BESS, allAssets.BESS); break;
        case GameState.SOLAR: renderSubPage(images.SOLAR, allAssets.SOLAR); break;
        case GameState.SUBSTATION: renderSubPage(images.SUBSTATION, allAssets.SUBSTATION); break;
        default: renderHUD(); break;
    }
    requestAnimationFrame(gameLoop);
}

gameLoop();