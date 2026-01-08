// ----------------------------------
// Global variables
// ----------------------------------
let buttons = [];
let sounds = [];

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

  const buttonWidth = 160;
  const buttonHeight = 100;
  const spacing = 40;

  // calculate starting position to center row
  const totalWidth =
    sounds.length * buttonWidth +
    (sounds.length - 1) * spacing;

  let startX = width / 2 - totalWidth / 2;
  let y = height / 2 - buttonHeight / 2;

  // create buttons
  for (let i = 0; i < sounds.length; i++) {
    buttons.push({
      x: startX + i * (buttonWidth + spacing),
      y: y,
      width: buttonWidth,
      height: buttonHeight,
      sound: sounds[i],
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
  // hover detection
  button.isHover =
    mouseX > button.x &&
    mouseX < button.x + button.width &&
    mouseY > button.y &&
    mouseY < button.y + button.height;

  // style
  noStroke();

  if (button.isHover) {
    fill(90, 210, 230);
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = "rgba(90,210,230,0.6)";
  } else {
    fill(60, 180, 200);
    drawingContext.shadowBlur = 0;
  }

  // click animation
  let scaleFactor = button.isPressed ? 0.95 : 1;
  let w = button.width * scaleFactor;
  let h = button.height * scaleFactor;
  let x = button.x + (button.width - w) / 2;
  let y = button.y + (button.height - h) / 2;

  rect(x, y, w, h, 12);

  // reset press state
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
