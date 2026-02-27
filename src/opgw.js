const opgwImage = new Image();
let opgwLoaded = false;

opgwImage.onload = () => {
    opgwLoaded = true;
};
opgwImage.src = "assets/images/OPGW.png";

function renderOPGW(ctx, canvas) {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!opgwLoaded) {
        ctx.fillStyle = "#ffaa00";
        ctx.font = "24px monospace";
        ctx.textAlign = "center";
        ctx.fillText("LOADING OPGW OPTICAL TERMINAL...", canvas.width / 2, canvas.height / 2);
        return;
    }

    ctx.drawImage(opgwImage, 0, 0, canvas.width, canvas.height);
    renderHUD();

    // Title
    ctx.textAlign = "center";
    ctx.fillStyle = "#00fbff";
    ctx.font = "bold 24px monospace";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#00fbff";
    ctx.fillText("SYSTEM: OPTICAL GROUND WIRE (OPGW) TERMINATION", canvas.width / 2, 130);
    ctx.shadowBlur = 0;

    // The generic render logic in main.js will handle the boxes if we use the generic approach,
    // but here we can add specific visual polish if needed.

    ctx.fillStyle = "#555";
    ctx.font = "16px monospace";
    ctx.fillText("[ PRESS ESC TO RETURN ]", canvas.width / 2, canvas.height - 30);
}
