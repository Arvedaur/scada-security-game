
const storyBG = new Image();
storyBG.src = "assets/images/Intro.png";

let storyState = {
  lines: [],
  currentLine: 0,
  charIndex: 0,
  lastUpdate: 0,
  complete: false
};

const STORY_TEXT = [
  "RWE OPERATIONS CENTER - 2026",
  "SYSTEM: CRITICAL ALARM - CYBER ATTACK DETECTED!",
  "",
  "A MALICIOUS HACKER GROUP IS ATTEMPTING",
  "TO ADVERSARIALY COLLAPSE THE EUROPEAN ENERGY GRID.",
  "",
  "TARGETS: WIND, SOLAR, AND ALL SUBSTATION NODES.",
  "",
  "YOU ARE RWE'S AUTHORIZED SECURITY EXPERT.",
  "THE GRID IS IN YOUR HANDS. BE BRAVE AND PROTECT THE CITY.",
  "",
  "YOU WILL SCAN SYSTEMS, PATCH VULNERABILITIES,",
  "AND DEFLECT CYBER AGGRESSORS.",
  "",
  "A SINGLE ERROR COULD PLUNGE THE CITY INTO DARKNESS.",
  "",
  "> PRESS [SPACE] TO INITIALIZE DEFENSE SYSTEMS..."
];

function initStory() {
  storyState = {
    lines: STORY_TEXT,
    currentLine: 0,
    charIndex: 0,
    lastUpdate: Date.now(),
    complete: false
  };
}

function updateStory() {
  if (storyState.complete) return;

  if (Date.now() - storyState.lastUpdate > 40) {
    storyState.lastUpdate = Date.now();
    storyState.charIndex++;
    const currentString = storyState.lines[storyState.currentLine];

    if (storyState.charIndex > currentString.length) {
      storyState.currentLine++;
      storyState.charIndex = 0;
      if (storyState.currentLine >= storyState.lines.length) {
        storyState.complete = true;
      }
    }
  }
}

function renderStory(ctx, canvas) {
  updateStory();

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = "left";
  ctx.font = "bold 28px 'Courier New', monospace";
  ctx.shadowBlur = 10;
  ctx.shadowColor = "#00ff00";
  ctx.fillStyle = "#00ff00";

  let startY = 150;
  const lineHeight = 45;

  for (let i = 0; i < storyState.currentLine; i++) {
    ctx.fillText(storyState.lines[i], 80, startY + i * lineHeight);
  }

  if (!storyState.complete && storyState.currentLine < storyState.lines.length) {
    const subString = storyState.lines[storyState.currentLine].substring(0, storyState.charIndex);
    ctx.fillText(subString + "█", 80, startY + storyState.currentLine * lineHeight);
  }

  ctx.shadowBlur = 0;

  if (storyState.complete) {
    if (Date.now() % 1000 < 500) {
      ctx.fillStyle = "#fff";
      ctx.font = "bold 24px monospace";
      ctx.textAlign = "center";
      ctx.fillText("> PRESS [SPACE] TO CONTINUE <", canvas.width / 2, canvas.height - 80);
    }
  }
}
