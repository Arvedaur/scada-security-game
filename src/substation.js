const substationImage = new Image();
let substationLoaded = false;

substationImage.onload = () => {
  substationLoaded = true;
};

substationImage.src = "assets/images/Substation.png";

// Define globally so main.js can access for click testing
window.substationAssets = [
  { id: "SUB_HV", name: "HV SCADA", x: 70, y: 80, w: 155, h: 160, points: 25, collected: false, details: { vendor: "CyberLogic OT", age: "5 years", fw: "v4.2.0", ip: "10.50.1.10", mac: "00:1B:2C:3D:4E:01" } },
  { id: "SUB_WTG", name: "WTG SCADA", x: 235, y: 80, w: 155, h: 160, points: 25, collected: false, details: { vendor: "CyberLogic OT", age: "5 years", fw: "v4.2.0", ip: "10.50.1.11", mac: "00:1B:2C:3D:4E:02" } },
  { id: "SUB_REL", name: "Protection Relays", x: 400, y: 180, w: 155, h: 160, points: 30, collected: false, details: { vendor: "Aether Control", age: "3 years", fw: "v1.8.4", ip: "10.50.5.100", mac: "00:1B:2C:3D:4E:A1" } },
  { id: "SUB_MET", name: "Power Meter", x: 565, y: 80, w: 155, h: 160, points: 15, collected: false, details: { vendor: "Quantec Power", age: "2 years", fw: "v3.0", ip: "10.50.5.200", mac: "00:1B:2C:3D:4E:B2" } },
  { id: "SUB_FW", name: "Firewall", x: 730, y: 80, w: 155, h: 160, points: 35, collected: false, details: { vendor: "Nexus OT Systems", age: "1 year", fw: "OS v3.5.0", ip: "10.50.10.1", mac: "00:1B:2C:3D:4E:F5" } },
  { id: "SUB_ENG", name: "ENG Workstation", x: 1100, y: 750, w: 400, h: 100, points: 40, collected: false, details: { vendor: "Titan Dynamics", age: "1 year", fw: "WinOT v10.2", ip: "10.50.10.50", mac: "00:1B:2C:3D:4E:EE" } }
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
  ctx.fillText("SYSTEM: SUBSTATION", canvas.width / 2, 140);

  // Alt bilgi
  ctx.fillStyle = "#555";
  ctx.font = "10px monospace";
  ctx.fillText("PRESS ESC TO RETURN", canvas.width / 2, canvas.height - 30);
}
