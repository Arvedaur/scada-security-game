const introImage = new Image();
introImage.src = "assets/images/Intro.png";

function renderIntro(ctx, canvas) {
  ctx.drawImage(introImage, 0, 0, canvas.width, canvas.height);

  ctx.textAlign = "center";
  ctx.fillStyle = "#f5f5f5";

  // Başlık (üstte)
  ctx.font = "28px 'Press Start 2P'";
  ctx.fillText(
    "SCADA SECURITY GAME",
    canvas.width / 2,
    90
  );

  // PRESS ANY KEY (en altta)
  ctx.font = "12px 'Press Start 2P'";
  ctx.fillText(
    "PRESS ANY KEY",
    canvas.width / 2,
    canvas.height - 20
  );
}
