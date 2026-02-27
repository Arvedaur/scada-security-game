const mainPageImage = new Image();
mainPageImage.src = "assets/images/MainPage.png";

const systemZones = [
  // 🟢 WTG (Wind Farm - Top Left)
  {
    name: "WTG",
    x: 50,
    y: 150,
    w: 350,
    h: 300,
    state: GameState.WTG
  },

  // 🟡 BESS (Battery Storage - Middle Left)
  {
    name: "BESS",
    x: 50,
    y: 470,
    w: 350,
    h: 250,
    state: GameState.BESS
  },

  // 🔵 SOLAR (Solar Power - Bottom Left)
  {
    name: "SOLAR",
    x: 50,
    y: 750,
    w: 400,
    h: 280,
    state: GameState.SOLAR
  },

  // 🔴 SUBSTATION (Main Substation - Right)
  {
    name: "SUBSTATION",
    x: 1200,
    y: 400,
    w: 600,
    h: 450,
    state: GameState.SUBSTATION
  },

  // 🟣 OPGW (Transmission Lines - Top Right)
  {
    name: "OPGW",
    x: 1300,
    y: 150,
    w: 500,
    h: 200,
    state: GameState.OPGW
  }
];

function renderMainPage(ctx, canvas) {
  ctx.drawImage(mainPageImage, 0, 0, canvas.width, canvas.height);

  // Hover feedback for system zones
  if (window.gameStarted && typeof systemZones !== 'undefined') {
    systemZones.forEach(zone => {
      if (isInside(zone, window.mouseX, window.mouseY)) {
        ctx.strokeStyle = "rgba(57, 255, 20, 0.4)";
        ctx.lineWidth = 3;
        ctx.strokeRect(zone.x, zone.y, zone.w, zone.h);

        // Optional: Tooltip or label
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(zone.x, zone.y - 40, 200, 30);
        ctx.fillStyle = "#39ff14";
        ctx.font = "bold 16px monospace";
        ctx.textAlign = "left";
        ctx.fillText(`> GOTO: ${zone.name}`, zone.x + 10, zone.y - 18);
      }
    });
  }

  ctx.fillStyle = "rgba(57, 255, 20, 0.9)";
  ctx.font = "bold 32px monospace";
  ctx.textAlign = "center";
  ctx.shadowBlur = 15;
  ctx.shadowColor = "#39ff14";
  ctx.fillText("GRID STATUS: UNSTABLE - FIRMWARE TAMPERING DETECTED", canvas.width / 2, 180);
  ctx.shadowBlur = 0;
}
