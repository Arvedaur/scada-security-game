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

    // Interactive Items
    const assetData = subPageAssets["OPGW"];
    assetData.items.forEach(item => {
        if (!item.collected) {
            const h = isInside(item, mouseX, mouseY);

            // Draw item box
            ctx.fillStyle = h ? "rgba(0, 255, 0, 0.2)" : "rgba(0, 0, 0, 0.5)";
            ctx.fillRect(item.x, item.y, item.w, item.h);

            ctx.strokeStyle = h ? "#fff" : "#00ff00";
            ctx.lineWidth = 2;
            ctx.strokeRect(item.x, item.y, item.w, item.h);

            // Label
            ctx.fillStyle = "#fff";
            ctx.font = "12px monospace";
            ctx.textAlign = "center";
            ctx.fillText(item.name, item.x + item.w / 2, item.y + item.h / 2 + 5);
        }
    });

    ctx.fillStyle = "#555";
    ctx.font = "16px monospace";
    ctx.fillText("[ PRESS ESC TO RETURN ]", canvas.width / 2, canvas.height - 30);
}
