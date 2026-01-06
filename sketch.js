function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(20);

  // button size
  const buttonWidth = 200;
  const buttonHeight = 100;

  // center position (CORNER mode)
  const x = width / 2 - buttonWidth / 2;
  const y = height / 2 - buttonHeight / 2;

  // hover check
  const isHover =
    mouseX > x &&
    mouseX < x + buttonWidth &&
    mouseY > y &&
    mouseY < y + buttonHeight;

  // style
  noStroke();
  if (isHover) {
    fill(90, 210, 230);
  } else {
    fill(60, 180, 200);
  }

  // draw button
  rect(x, y, buttonWidth, buttonHeight, 12);
}
