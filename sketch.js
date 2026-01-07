// -----------------------------
// Global state variables
// -----------------------------
let isHover = false;
let isPressed = false;
let clickSound;

// -----------------------------
// Load assets before sketch starts
// -----------------------------
function preload() {
  clickSound = loadSound("assets/sounds/click.mp3");
}

// -----------------------------
// Setup runs once
// -----------------------------
function setup() {
  createCanvas(windowWidth, windowHeight);
}

// -----------------------------
// Draw runs every frame
// -----------------------------
function draw() {
  background(20);

  // -----------------------------
  // Button size
  // -----------------------------
  const buttonWidth = 200;
  const buttonHeight = 100;

  // -----------------------------
  // Center position (CORNER mode)
  // -----------------------------
  const x = width / 2 - buttonWidth / 2;
  const y = height / 2 - buttonHeight / 2;

  // -----------------------------
  // Hover detection
  // -----------------------------
  isHover =
    mouseX > x &&
    mouseX < x + buttonWidth &&
    mouseY > y &&
    mouseY < y + buttonHeight;

  // -----------------------------
  // Button style
  // -----------------------------
  noStroke();

  if (isHover) {
    fill(90, 210, 230);

    // ✨ optional glow effect
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = "rgba(90, 210, 230, 0.6)";
  } else {
    fill(60, 180, 200);
    drawingContext.shadowBlur = 0;
  }

  // -----------------------------
  // Click animation (scale)
  // -----------------------------
  let scaleFactor = isPressed ? 0.95 : 1;

  const animatedWidth = buttonWidth * scaleFactor;
  const animatedHeight = buttonHeight * scaleFactor;

  const drawX = width / 2 - animatedWidth / 2;
  const drawY = height / 2 - animatedHeight / 2;

  // -----------------------------
  // Draw button
  // -----------------------------
  rect(drawX, drawY, animatedWidth, animatedHeight, 12);

  // Reset click state (one-frame press)
  isPressed = false;
}

// -----------------------------
// Mouse click handler
// -----------------------------
function mousePressed() {
  if (isHover) {
    userStartAudio(); 
    clickSound.play();
    isPressed = true;
  }
}
