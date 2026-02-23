
// Helper for Typewriter Effect
function typeWriter(text, ctx, x, y, speed = 30, callback) {
  let i = 0;
  const interval = setInterval(() => {
    // Clear area if needed? For canvas, we usually redraw frame. 
    // Here we just draw "over" or rely on the main loop to NOT clear this specific text if it's static?
    // Actually, in the game loop, we clear screen every frame.
    // So we need to store the "current visible text" in a state variable.
    // Let's refactor: logic should handle state, render just draws string.
  }, speed);
}

// State for Intro Animation
let introState = {
  lines: [],
  currentLine: 0,
  charIndex: 0,
  lastUpdate: 0,
  complete: false
};

const INTRO_TEXT = [
  "Subject: URGENT - NATIONAL SECURITY ALERT",
  "From: CYBER COMMAND (USCYBERCOM)",
  "To: SCADA OPERATIONS UNIT 7",
  "",
  "Intelligence reports confirm an imminent coordinated attack",
  "targeting the regional power grid.",
  "Hostile state actors have deployed 'BlackLight' malware.",
  "",
  "MISSION PARAMETERS:",
  "1. Secure Asset Inventory in the field.",
  "2. Patch Critical Vulnerabilities immediately.",
  "3. Revoke Uneccessary Access Rights.",
  "4. Establish Disaster Recovery protocols.",
  "",
  "The grid -- and millions of lives -- depend on you.",
  "> Press [SPACE] to Initialize Defense Systems..."
];

function initIntro() {
  introState = {
    lines: INTRO_TEXT,
    currentLine: 0,
    charIndex: 0,
    lastUpdate: Date.now(),
    complete: false
  };
}

function updateIntro() {
  if (introState.complete) return;

  if (Date.now() - introState.lastUpdate > 30) { // Typing Speed
    introState.lastUpdate = Date.now();

    introState.charIndex++;
    const currentString = introState.lines[introState.currentLine];

    if (introState.charIndex > currentString.length) {
      introState.currentLine++;
      introState.charIndex = 0;

      if (introState.currentLine >= introState.lines.length) {
        introState.complete = true;
      }
    }
  }
}

function renderIntro(ctx, canvas) {
  updateIntro(); // Logic update

  // Background
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Matrix / Code Rain Effect (Simplified)
  ctx.fillStyle = "rgba(0, 255, 0, 0.05)";
  ctx.font = "14px monospace";
  for (let i = 0; i < 20; i++) {
    ctx.fillText(Math.random() > 0.5 ? "1" : "0", Math.random() * canvas.width, Math.random() * canvas.height);
  }

  // Main Text
  ctx.textAlign = "left";
  ctx.font = "20px monospace";
  ctx.fillStyle = "#00ff00";

  let y = 80;

  // Draw fully completed lines
  for (let i = 0; i < introState.currentLine; i++) {
    ctx.fillStyle = (i < 3) ? "#00bb00" : "#00ff00"; // Header dimmed
    ctx.fillText(introState.lines[i], 50, y);
    y += 30;
  }

  // Draw fading line
  if (!introState.complete && introState.currentLine < introState.lines.length) {
    const currentString = introState.lines[introState.currentLine];
    const subString = currentString.substring(0, introState.charIndex);
    ctx.fillStyle = "#00ff00";
    ctx.fillText(subString + "█", 50, y); // Cursor
  }

  // Instructions (Blinking)
  if (introState.complete) {
    if (Date.now() % 1000 < 500) {
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.fillText("> PRESS [SPACE] TO ACCEPT MISSION <", canvas.width / 2, canvas.height - 50);
    }
  }
}

// Hook Input in main.js to check introState.complete before transitions
