const GameState = {
  INTRO: "INTRO",
  STORY: "STORY",
  LOGIN: "LOGIN",
  MAIN_PAGE: "MAIN_PAGE",

  WTG: "WTG",
  BESS: "BESS",
  SOLAR: "SOLAR",
  SUBSTATION: "SUBSTATION",

  ASSET_INVENTORY: "ASSET_INVENTORY",
  PATCH_MGMT: "PATCH_MGMT",
  ACCESS_MGMT: "ACCESS_MGMT",
  BCM_DR: "BCM_DR",
  OPGW: "OPGW",
  SCADA_INTRO: "SCADA_INTRO",
  RESULTS: "RESULTS"
};

// Utility for Non-Blocking Notifications
window.showStatusMessage = (msg, duration = 3000) => {
  let notify = document.getElementById("game-notify");
  if (!notify) {
    notify = document.createElement("div");
    notify.id = "game-notify";
    notify.style = "position:absolute; top:20px; right:20px; background:#000; border:2px solid #00ff00; color:#00ff00; padding:15px; z-index:2000; box-shadow:0 0 10px #00ff00; font-family:monospace; max-width:300px; border-radius:4px;";
    document.body.appendChild(notify);
  }
  notify.innerText = msg;
  notify.style.display = "block";

  if (window.notifyTimeout) clearTimeout(window.notifyTimeout);
  window.notifyTimeout = setTimeout(() => {
    notify.style.display = "none";
  }, duration);
};

window.showDecisionDialog = (title, msg, onConfirm, onCancelLabel) => {
  const ui = document.getElementById("ui-layer");
  const wasHidden = ui.classList.contains("hidden");
  ui.classList.remove("hidden"); // Ensure visible for dialog

  const overlay = document.createElement("div");
  overlay.style = "position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); display:flex; flex-direction:column; justify-content:center; align-items:center; z-index:1000; border:2px solid #00ff00;";

  const cancelLabel = (typeof onCancelLabel === 'string') ? onCancelLabel : "CANCEL";

  overlay.innerHTML = `
        <div class="panel" style="max-width:500px; height:auto; padding:30px; text-align:center; border-color: #39ff14;">
            <h2 style="color:#39ff14; margin-top:0; font-family: 'Courier New', monospace;">${title}</h2>
            <p style="color:#fff; line-height: 1.6;">${msg}</p>
            <div style="margin-top:20px; display:flex; justify-content:center; gap:10px;">
                <button id="dia-cancel" style="border-color:#fff; color:#fff;">${cancelLabel}</button>
                <button id="dia-confirm" style="border-color:#39ff14; color:#39ff14;">PROCEED</button>
            </div>
        </div>
    `;

  ui.appendChild(overlay);

  // If onCancelLabel is NOT provided or null, we might only want one button
  if (!onCancelLabel && onCancelLabel !== "") {
    // Default mode: two buttons
  }

  const closeDialog = () => {
    overlay.remove();
    // Re-hide ui-layer if we are in a canvas-based state
    const DOM_STATES = ["ASSET_INVENTORY", "PATCH_MGMT", "ACCESS_MGMT", "BCM_DR"];
    const isDOMState = DOM_STATES.some(s => GameState[s] === window.currentState);
    if (!isDOMState) {
      ui.classList.add("hidden");
    }
  };

  document.getElementById("dia-cancel").onclick = () => {
    closeDialog();
    if (typeof onCancelLabel === 'function') onCancelLabel();
  };

  if (!onConfirm) {
    document.getElementById("dia-confirm").style.display = "none";
  } else {
    document.getElementById("dia-confirm").onclick = () => {
      closeDialog();
      onConfirm();
    };
  }
};

// Global State
window.currentState = GameState.STORY;
window.mouseX = 0;
window.mouseY = 0;
window.loginInput = "";
window.gameStarted = false; // NEW FLAG

window.player = {
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