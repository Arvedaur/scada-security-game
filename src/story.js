
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
  "YEAR 2026. THE ENERGY TRANSITION WON.",
  "FOSSIL EMPIRES COLLAPSED.",
  "",
  "BUT POWER DOES NOT DISAPPEAR. IT HIDES.",
  "A SHADOW ALLIANCE ('OBSIDIAN') WAS FORMED.",
  "",
  "THEY COULD NOT STOP THE RENEWABLES.",
  "SO THEY DECIDED TO ERASE THEM.",
  "",
  "THEY SENT A WEAPON: 'BLACKLIGHT'.",
  "NOT TO KILL PEOPLE.",
  "BUT TO KILL CONTROL SYSTEMS.",
  "",
  "TARGETS CONFIRMED:",
  "> SUBSTATION ALPHA",
  "> OFFSHORE WINDFARM 4",
  "> SOLAR ARRAY DELTA",
  "",
  "THE GRID IS THE TARGET.",
  "YOU ARE THE FIREWALL.",
  "",
  "> Press [SPACE] to Deploy Cyber Defenses..."
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
