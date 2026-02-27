const substationImage = new Image();
let substationLoaded = false;

substationImage.onload = () => {
  substationLoaded = true;
};

substationImage.src = "assets/images/Substation.png";

// Define globally so main.js can access for click testing
window.substationAssets = [
  // Rack Left
  { id: "SUB_CS", name: "Core Switch", x: 92, y: 460, w: 250, h: 100, points: 20, collected: false, details: { vendor: "Nexus OT Systems", age: "4 years", fw: "OS v2.4.1", ip: "10.50.1.1", mac: "00:1A:4D:5E:6F:01" } },
  { id: "SUB_FW1", name: "OT Firewall (External)", x: 104, y: 760, w: 236, h: 80, points: 30, collected: false, details: { vendor: "SecureLink OT", age: "2 years", fw: "v5.1.0-br", ip: "10.50.1.5", mac: "00:1A:4D:5E:6F:10" } },

  // Rack Middle
  { id: "SUB_SRV", name: "Wind Farm SCADA Server", x: 388, y: 228, w: 228, h: 100, points: 40, collected: false, details: { vendor: "CyberLogic OT", age: "1 year", fw: "v4.2.2-stable", ip: "10.50.1.20", mac: "00:1A:4D:5E:6F:A2" } },
  { id: "SUB_FW2", name: "OT Firewall (Internal)", x: 395, y: 760, w: 225, h: 80, points: 30, collected: false, details: { vendor: "SecureLink OT", age: "2 years", fw: "v5.1.0-br", ip: "10.50.1.21", mac: "00:1A:4D:5E:6F:11" } },

  // Rack Right
  { id: "SUB_REL1", name: "Protection Relay Alpha", x: 655, y: 580, w: 150, h: 60, points: 25, collected: false, details: { vendor: "Aether Control", age: "7 years", fw: "v3.0.4", ip: "10.50.1.51", mac: "00:1A:4D:5E:6F:B1" } },
  { id: "SUB_REL2", name: "Protection Relay Beta", x: 800, y: 580, w: 150, h: 60, points: 25, collected: false, details: { vendor: "Aether Control", age: "7 years", fw: "v3.0.4", ip: "10.50.1.52", mac: "00:1A:4D:5E:6F:B2" } },
  { id: "SUB_ENG", name: "Engineering Workstation", x: 670, y: 760, w: 284, h: 150, points: 15, collected: false, details: { vendor: "Titan Dynamics", age: "2 years", fw: "WinOT v10.4", ip: "10.50.1.100", mac: "00:1A:4D:5E:6F:C8" } }
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
