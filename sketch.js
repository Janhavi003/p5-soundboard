// ----------------------------------
// Button class (scalable & clean)
// ----------------------------------
class SoundButton {
  constructor(x, y, size, sound, label, keyCode) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.sound = sound;
    this.label = label;
    this.keyCode = keyCode;

    this.isHover = false;
    this.isPressed = false;
    this.pulse = 0;
  }

  update() {
    this.isHover =
      mouseX > this.x &&
      mouseX < this.x + this.size &&
      mouseY > this.y &&
      mouseY < this.y + this.size;

    this.pulse *= 0.9;
  }

  draw() {
    noStroke();

    const glow = this.isHover || this.isPressed;

    if (glow) {
      fill(90, 210, 230);
      drawingContext.shadowBlur = 25;
      drawingContext.shadowColor = "rgba(90,210,230,0.7)";
    } else {
      fill(60, 180, 200);
      drawingContext.shadowBlur = 0;
    }

    const scale = this.isPressed ? 0.92 : 1;
    const s = this.size * scale;

    rect(
      this.x + (this.size - s) / 2,
      this.y + (this.size - s) / 2,
      s,
      s,
      16
    );

    // Sound reactive pulse
    noFill();
    stroke(90, 210, 230, this.pulse);
    strokeWeight(3);
    rect(
      this.x - this.pulse / 2,
      this.y - this.pulse / 2,
      this.size + this.pulse,
      this.size + this.pulse,
      18
    );

    // Label
    noStroke();
    fill(20);
    textAlign(CENTER, CENTER);
    textSize(14);
    textStyle(BOLD);
    text(this.label, this.x + this.size / 2, this.y + this.size / 2);
  }

  trigger() {
    userStartAudio();
    this.sound.play();
    this.isPressed = true;
    this.pulse = 40;
  }
}

// ----------------------------------
// Global variables
// ----------------------------------
let buttons = [];
let sounds = [];

// ----------------------------------
// Load sounds
// ----------------------------------
function preload() {
  sounds.push(loadSound("assets/sounds/kick.mp3"));
  sounds.push(loadSound("assets/sounds/snare.mp3"));
  sounds.push(loadSound("assets/sounds/hat.mp3"));
  sounds.push(loadSound("assets/sounds/clap.mp3"));
}

// ----------------------------------
// Setup
// ----------------------------------
function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("system-ui");

  const size = 140;
  const gap = 40;

  const startX = width / 2 - size - gap / 2;
  const startY = height / 2 - size - gap / 2;

  const positions = [
    { x: startX, y: startY },                 // UP
    { x: startX + size + gap, y: startY },    // RIGHT
    { x: startX + size + gap, y: startY + size + gap }, // DOWN
    { x: startX, y: startY + size + gap }     // LEFT
  ];

 const labels = ["KICK", "SNARE", "HAT", "CLAP"];
  const keys = [UP_ARROW, RIGHT_ARROW, DOWN_ARROW, LEFT_ARROW];

  for (let i = 0; i < 4; i++) {
    buttons.push(
      new SoundButton(
        positions[i].x,
        positions[i].y,
        size,
        sounds[i],
        labels[i],
        keys[i]
      )
    );
  }
}

// ----------------------------------
// Draw
// ----------------------------------
function draw() {
  background(20);

  for (let button of buttons) {
    button.update();
    button.draw();
    button.isPressed = false;
  }
}

// ----------------------------------
// Mouse interaction
// ----------------------------------
function mousePressed() {
  for (let button of buttons) {
    if (button.isHover) {
      button.trigger();
    }
  }
}

// ----------------------------------
// Keyboard interaction (ARROW KEYS)
// ----------------------------------
function keyPressed() {
  for (let button of buttons) {
    if (keyCode === button.keyCode) {
      button.trigger();
    }
  }
}
