const substationImage = new Image();
let substationLoaded = false;

substationImage.onload = () => {
  substationLoaded = true;
};

substationImage.src = "assets/images/Substation.png";

// Define globally so main.js can access for click testing
window.substationAssets = [
  { id: "SUB_HV_SRV", name: "HV SCADA Server", x: 162, y: 460, w: 267, h: 111, points: 25, collected: false, details: { vendor: "CyberLogic OT", age: "5 years", fw: "v4.2.0", ip: "10.50.1.10", mac: "00:1B:2C:3D:4E:01" } },
  { id: "SUB_HV_UPS", name: "HV UPS", x: 162, y: 634, w: 274, h: 177, points: 15, collected: false, details: { vendor: "PowerGuard", age: "3 years", fw: "v1.2", ip: "10.50.1.15", mac: "00:1B:2C:3D:4E:15" } },
  { id: "SUB_HV_HMI", name: "HV HMI", x: 161, y: 258, w: 278, h: 178, points: 20, collected: false, details: { vendor: "CyberLogic OT", age: "4 years", fw: "v3.1", ip: "10.50.1.20", mac: "00:1B:2C:3D:4E:20" } },
  { id: "SUB_WTG_SRV", name: "WTG SCADA Server", x: 471, y: 463, w: 262, h: 87, points: 25, collected: false, details: { vendor: "CyberLogic OT", age: "5 years", fw: "v4.2.0", ip: "10.50.5.10", mac: "00:1B:2C:3D:5E:01" } },
  { id: "SUB_WTG_UPS", name: "WTG UPS", x: 467, y: 568, w: 258, h: 78, points: 15, collected: false, details: { vendor: "PowerGuard", age: "3 years", fw: "v1.2", ip: "10.50.5.15", mac: "00:1B:2C:3D:5E:15" } },
  { id: "SUB_WTG_HMI", name: "WTG HMI", x: 450, y: 203, w: 280, h: 252, points: 20, collected: false, details: { vendor: "CyberLogic OT", age: "4 years", fw: "v3.1", ip: "10.50.5.20", mac: "00:1B:2C:3D:5E:20" } },
  { id: "SUB_REL_1", name: "Protection Relay 1", x: 763, y: 294, w: 203, h: 75, points: 15, collected: false, details: { vendor: "Aether Control", age: "6 years", fw: "v1.5", ip: "10.50.10.11", mac: "00:1B:2C:3F:4E:01" } },
  { id: "SUB_REL_2", name: "Protection Relay 2", x: 750, y: 369, w: 233, h: 80, points: 15, collected: false, details: { vendor: "Aether Control", age: "6 years", fw: "v1.5", ip: "10.50.10.12", mac: "00:1B:2C:3F:4E:02" } },
  { id: "SUB_REL_3", name: "Protection Relay 3", x: 761, y: 448, w: 217, h: 96, points: 15, collected: false, details: { vendor: "Aether Control", age: "6 years", fw: "v1.5", ip: "10.50.10.13", mac: "00:1B:2C:3F:4E:03" } },
  { id: "SUB_REL_SW", name: "Relay Main Switch", x: 753, y: 681, w: 217, h: 71, points: 20, collected: false, details: { vendor: "Nexus OT Systems", age: "4 years", fw: "OS v1.2", ip: "10.50.10.1", mac: "00:1B:2C:3F:4E:FF" } },
  { id: "SUB_MET", name: "Power Meter", x: 989, y: 241, w: 283, h: 236, points: 20, collected: false, details: { vendor: "Quantec Power", age: "4 years", fw: "v2.1", ip: "10.50.20.1", mac: "00:1B:2C:34:4E:01" } },
  { id: "SUB_FW", name: "Firewall", x: 1279, y: 412, w: 273, h: 53, points: 35, collected: false, details: { vendor: "Nexus OT Systems", age: "2 years", fw: "OS v3.1", ip: "10.50.30.1", mac: "00:1B:2C:34:4E:FW" } },
  { id: "SUB_MAIN_SW", name: "Main Switch", x: 1294, y: 308, w: 273, h: 93, points: 25, collected: false, details: { vendor: "Nexus OT Systems", age: "5 years", fw: "OS v2.8", ip: "10.50.30.2", mac: "00:1B:2C:34:4E:SW" } },
  { id: "SUB_OP_PC", name: "Operator PC", x: 1317, y: 484, w: 364, h: 261, points: 45, collected: false, details: { vendor: "Titan Dynamics", age: "2 years", fw: "WinOT v11.0", ip: "10.50.40.10", mac: "00:1B:2C:34:4E:PC" } }
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
      ctx.strokeStyle = "rgba(57, 255, 20, 0.8)";
      ctx.lineWidth = 2;
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
