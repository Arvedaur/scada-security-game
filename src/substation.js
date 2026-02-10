const substationImage = new Image();
let substationLoaded = false;

substationImage.onload = () => {
  substationLoaded = true;
};

substationImage.src = "assets/images/Substation.png";

function renderSubstation(ctx, canvas) {
  // Arka plan
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Eğer resim YÜKLENMEDİYSE
  if (!substationLoaded) {
    ctx.fillStyle = "#ffaa00";
    ctx.font = "14px monospace";
    ctx.textAlign = "center";
    ctx.fillText(
      "LOADING SUBSTATION...",
      canvas.width / 2,
      canvas.height / 2
    );
    return;
  }

  // Resim yüklendiyse çiz
  ctx.drawImage(
    substationImage,
    0,
    0,
    canvas.width,
    canvas.height
  );

  // Üst başlık
  ctx.fillStyle = "#ff4444";
  ctx.font = "14px monospace";
  ctx.textAlign = "center";
  ctx.fillText(
    "SUBSTATION SYSTEM",
    canvas.width / 2,
    40
  );

  // Alt bilgi
  ctx.font = "10px monospace";
  ctx.fillText(
    "PRESS ESC TO RETURN",
    canvas.width / 2,
    canvas.height - 30
  );
}
