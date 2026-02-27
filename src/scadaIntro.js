
const scadaIntroBg = new Image();
scadaIntroBg.src = "assets/images/Intro.png";

function renderScadaGameIntro(ctx, canvas) {
    if (scadaIntroBg.complete) {
        ctx.drawImage(scadaIntroBg, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.textAlign = "center";
        ctx.fillStyle = "#00ff00";
        ctx.font = "bold 80px 'Courier New', monospace";
        ctx.fillText("SCADA SECURITY GAME", canvas.width / 2, canvas.height / 2);
    }

    if (Date.now() % 1000 < 500) {
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.font = "bold 24px monospace";
        ctx.fillText("> PRESS [SPACE] TO CONTINUE <", canvas.width / 2, canvas.height - 100);
    }
}
