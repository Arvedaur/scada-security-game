
const introBG = new Image();
introBG.src = "assets/images/Intro.png";

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

  if (Date.now() - introState.lastUpdate > 30) {
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
  updateIntro();

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = "left";
  ctx.font = "bold 28px 'Courier New', monospace";
  ctx.shadowBlur = 10;
  ctx.shadowColor = "#00ff00";
  ctx.fillStyle = "#00ff00";

  let y = 180;
  const introLineHeight = 50;

  for (let i = 0; i < introState.currentLine; i++) {
    ctx.fillText(introState.lines[i], 80, y);
    y += introLineHeight;
  }

  if (!introState.complete && introState.currentLine < introState.lines.length) {
    const subString = introState.lines[introState.currentLine].substring(0, introState.charIndex);
    ctx.fillText(subString + "█", 80, y);
  }

  ctx.shadowBlur = 0;

  if (introState.complete) {
    if (Date.now() % 1000 < 500) {
      ctx.fillStyle = "#fff";
      ctx.font = "bold 24px monospace";
      ctx.textAlign = "center";
      ctx.fillText("> PRESS [SPACE] TO CONTINUE <", canvas.width / 2, canvas.height - 80);
    }
  }
}
