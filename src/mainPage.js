const mainPageImage = new Image();
mainPageImage.src = "assets/images/MainPage.png";

const systemZones = [
  // 🟢 WTG (Rüzgar Türbinleri - üst sol)
  {
    name: "WTG",
    x: 80,
    y: 80,
    w: 300,
    h: 220,
    state: GameState.WTG
  },

  // 🟡 BESS (Battery Storage - orta sol)
  {
    name: "BESS",
    x: 90,
    y: 260,
    w: 300,
    h: 160,
    state: GameState.BESS
  },

  // 🔵 SOLAR (alt sol)
  {
    name: "SOLAR",
    x: 80,
    y: 420,
    w: 320,
    h: 110,
    state: GameState.SOLAR
  },

  // 🔴 SUBSTATION (sağ taraf bina)
  {
    name: "SUBSTATION",
    x: 520,
    y: 200,
    w: 360,
    h: 260,
    state: GameState.SUBSTATION
  }
];
function renderMainPage(ctx, canvas) {
  ctx.drawImage(mainPageImage, 0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = "#00ffcc";
  ctx.font = "14px monospace";
  ctx.textAlign = "center";
  ctx.fillText("SYSTEM STATUS", canvas.width / 2, 40);

  // DEBUG (istersen aç)
  // ctx.strokeStyle = "red";
  // systemZones.forEach(z => ctx.strokeRect(z.x, z.y, z.w, z.h));
  // DEBUG: Tıklanabilir alanları göster
  ctx.strokeStyle = "rgba(255,0,0,0.6)";
  ctx.lineWidth = 2;

  systemZones.forEach(zone => {
  ctx.strokeRect(zone.x, zone.y, zone.w, zone.h);
});

}
