// Re-use logic from intro.js or similar
// For simplicity, let's keep it self-contained but use the new style

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
  "PRESS [ENTER] TO BEGIN OPERATION..._"
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

  if (Date.now() - storyState.lastUpdate > 40) { // Slightly slower for dramatic effect
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

  ctx.textAlign = "center";
  ctx.font = "18px monospace";

  let startY = 60;
  const lineHeight = 25;

  // Draw completed lines
  for (let i = 0; i < storyState.currentLine; i++) {
    let line = storyState.lines[i];

    if (line.includes("YEAR 2026")) ctx.fillStyle = "#00ffaa";
    else if (line.includes("TARGETS")) ctx.fillStyle = "#ff0000";
    else if (line.includes(">")) ctx.fillStyle = "#ff5555";
    else ctx.fillStyle = "#00bb00";

    ctx.fillText(line, canvas.width / 2, startY + i * lineHeight);
  }

  // Draw typing line
  if (!storyState.complete && storyState.currentLine < storyState.lines.length) {
    let line = storyState.lines[storyState.currentLine];
    let sub = line.substring(0, storyState.charIndex);

    ctx.fillStyle = "#00ff00"; // Typing color
    ctx.fillText(sub + "█", canvas.width / 2, startY + storyState.currentLine * lineHeight);
  }

  // Continue Trigger
  if (storyState.complete) {
    if (Date.now() % 1000 < 500) {
      ctx.fillStyle = "#fff";
      ctx.fillText("[ PRESS ENTER TO DEPLOY ]", canvas.width / 2, canvas.height - 50);
    }
  }
}

// Ensure main.js calls initStory() when switching to this state
