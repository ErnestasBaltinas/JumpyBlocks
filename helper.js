// utility functions
function drawObject(x, y, width, height, color){
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.fillStyle = color;
  ctx.fill();
}

function getRandomColor() {
  let colors = ["#ffcc00", "#00872a", "#00ff99", "#0000ff", "#ff4d4d"];

  return colors[getRandomInt(0, 5)];
}

function getRandomInt(min,max){
  return Math.floor(Math.random() * Math.floor(max-min) + min);
}
