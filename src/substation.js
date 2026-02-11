const substationImage = new Image();
let substationLoaded = false;

substationImage.onload = () => {
  substationLoaded = true;
};

substationImage.src = "assets/images/Substation.png";

// Define globally so main.js can access for click testing
window.substationAssets = [
  { id: "SUB_CS", name: "Core Switch", x: 85, y: 430, w: 235, h: 50, points: 20, collected: false },
  { id: "SUB_FW1", name: "OT Firewall (Backbone)", x: 100, y: 690, w: 200, h: 40, points: 30, collected: false }, // adjusted Y likely off-screen in original 540h? Re-estimating
  // Re-estimating Y based on 540px height image.
  // Rack Left
  { id: "SUB_CS", name: "Core Switch", x: 95, y: 280, w: 210, h: 40, points: 20, collected: false },
  { id: "SUB_FW1", name: "OT Firewall", x: 110, y: 390, w: 180, h: 40, points: 30, collected: false },

  // Rack Middle
  { id: "SUB_SRV", name: "Wind SCADA Server", x: 390, y: 180, w: 200, h: 40, points: 40, collected: false },
  { id: "SUB_IED", name: "Substation IED", x: 400, y: 320, w: 180, h: 40, points: 25, collected: false },
  { id: "SUB_FW2", name: "OT Firewall (Internal)", x: 390, y: 400, w: 200, h: 40, points: 30, collected: false },

  // Rack Right
  { id: "SUB_SOL", name: "Solar SCADA", x: 775, y: 180, w: 130, h: 30, points: 30, collected: false },
  { id: "SUB_REL", name: "Protection Relay", x: 660, y: 340, w: 110, h: 40, points: 25, collected: false },
  { id: "SUB_ENG", name: "Eng Workstation", x: 685, y: 410, w: 150, h: 80, points: 15, collected: false }
];

function renderSubstation(ctx, canvas) {
  // Arka plan
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Eğer resim YÜKLENMEDİYSE
  if (!substationLoaded) {
    ctx.fillStyle = "#ffaa00";
    ctx.font = "14px monospace";
    ctx.textAlign = "center";
    ctx.fillText("LOADING SUBSTATION...", canvas.width / 2, canvas.height / 2);
    return;
  }

  // Resim yüklendiyse çiz
  ctx.drawImage(substationImage, 0, 0, canvas.width, canvas.height);

  // Render Interactive Assets
  window.substationAssets.forEach(asset => {
    if (!asset.collected) {
      // Simple hitbox debugging/highlight
      // ctx.strokeStyle = "rgba(0, 255, 0, 0.5)";
      // ctx.strokeRect(asset.x, asset.y, asset.w, asset.h);

      // Hover effect handled in main.js generically or we can add local visual hint
      // For now, let's just make sure they are "visible" to the user as interactive
      // by drawing a subtle border if not collected
      ctx.strokeStyle = "rgba(0, 255, 0, 0.3)";
      ctx.lineWidth = 1;
      ctx.strokeRect(asset.x, asset.y, asset.w, asset.h);
    }
  });

  // Üst başlık
  ctx.fillStyle = "#00ffaa";
  ctx.font = "20px monospace";
  ctx.textAlign = "center";
  ctx.fillText("SYSTEM: SUBSTATION", canvas.width / 2, 40);

  // Alt bilgi
  ctx.fillStyle = "#555";
  ctx.font = "10px monospace";
  ctx.fillText("PRESS ESC TO RETURN", canvas.width / 2, canvas.height - 30);
}
