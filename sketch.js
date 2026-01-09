// ----------------------------------
// Global variables
// ----------------------------------
let buttons = [];
let sounds = [];

// Labels for each sound (order matters)
const labels = ["KICK", "SNARE", "HAT", "CLAP"];

// ----------------------------------
// Load sounds before sketch starts
// ----------------------------------
function preload() {
  sounds.push(loadSound("assets/sounds/kick.mp3"));
  sounds.push(loadSound("assets/sounds/snare.mp3"));
  sounds.push(loadSound("assets/sounds/hat.mp3"));
  sounds.push(loadSound("assets/sounds/clap.mp3"));
}

// ----------------------------------
// Setup runs once
// ----------------------------------
function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("system-ui");

  const buttonWidth = 160;
  const buttonHeight = 100;
  const spacing = 40;

  // Center the row of buttons
  const totalWidth =
    sounds.length * buttonWidth +
    (sounds.length - 1) * spacing;

  const startX = width / 2 - totalWidth / 2;
  const y = height / 2 - buttonHeight / 2;

  // Create button objects
  for (let i = 0; i < sounds.length; i++) {
    buttons.push({
      x: startX + i * (buttonWidth + spacing),
      y: y,
      width: buttonWidth,
      height: buttonHeight,
      sound: sounds[i],
      label: labels[i] || `SOUND ${i + 1}`,
      isHover: false,
      isPressed: false
    });
  }
}

// ----------------------------------
// Draw loop
// ----------------------------------
function draw() {
  background(20);

  for (let button of buttons) {
    drawButton(button);
  }
}

// ----------------------------------
// Draw a single button
// ----------------------------------
function drawButton(button) {
  // Hover detection
  button.isHover =
    mouseX > button.x &&
    mouseX < button.x + button.width &&
    mouseY > button.y &&
    mouseY < button.y + button.height;

  // Button style
  noStroke();

  if (button.isHover) {
    fill(90, 210, 230);
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = "rgba(90,210,230,0.6)";
  } else {
    fill(60, 180, 200);
    drawingContext.shadowBlur = 0;
  }

  // Click animation
  const scaleFactor = button.isPressed ? 0.95 : 1;
  const w = button.width * scaleFactor;
  const h = button.height * scaleFactor;
  const x = button.x + (button.width - w) / 2;
  const y = button.y + (button.height - h) / 2;

  // Draw button
  rect(x, y, w, h, 12);

  // Draw label
  fill(20);
  textAlign(CENTER, CENTER);
  textSize(14);
  textStyle(BOLD);
  text(button.label, button.x + button.width / 2, button.y + button.height / 2);

  // Reset press state (one-frame animation)
  button.isPressed = false;
}

// ----------------------------------
// Mouse click handler
// ----------------------------------
function mousePressed() {
  userStartAudio();

  for (let button of buttons) {
    if (button.isHover) {
      button.sound.play();
      button.isPressed = true;
    }
  }
}
