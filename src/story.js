const STORY_TEXT = [
  "YEAR 2042.",
  "",
  "RENEWABLE ENERGY WON.",
  "THE OLD EMPIRES COLLAPSED.",
  "",
  "BUT POWER DOES NOT DISAPPEAR.",
  "IT HIDES.",
  "",
  "FROM THE RUINS OF FOSSIL INDUSTRIES,",
  "A SHADOW ALLIANCE WAS FORMED.",
  "",
  "THEY COULD NOT STOP THE TRANSITION.",
  "SO THEY DECIDED TO ERASE IT.",
  "",
  "FROM A BROKEN FUTURE,",
  "THEY SENT A MACHINE.",
  "",
  "NOT TO KILL PEOPLE.",
  "BUT TO KILL CONTROL SYSTEMS.",
  "",
  "SUBSTATIONS.",
  "WIND FARMS.",
  "BATTERIES.",
  "",
  "THE GRID IS THE TARGET.",
  "",
  "YOU ARE THE LAST LINE OF DEFENSE."
];

function renderStory(ctx, canvas) {
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#00ffaa";
  ctx.font = "14px 'Press Start 2P'";
  ctx.textAlign = "left";

  let startY = 60;
  let lineHeight = 22;

  STORY_TEXT.forEach((line, index) => {
    ctx.fillText(line, 60, startY + index * lineHeight);
  });

  ctx.textAlign = "center";
  ctx.fillStyle = "#ffffff";
  ctx.font = "12px 'Press Start 2P'";
  ctx.fillText(
    "PRESS ANY KEY TO CONTINUE",
    canvas.width / 2,
    canvas.height - 40
  );
}
