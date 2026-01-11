// ----------------------------------
// Globals
// ----------------------------------
let buttons = [];
let sounds = [];

let currentTop;
let currentBottom;
let targetTop;
let targetBottom;
let gradientLerp = 1;

// ----------------------------------
// Sound Button Class
// ----------------------------------
class SoundButton {
  constructor(x, y, size, sound, label, keyCode, baseColor) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.sound = sound;
    this.label = label;
    this.keyCode = keyCode;
    this.baseColor = baseColor;

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

    this.pulse *= 0.85;
  }

  draw() {
    noStroke();

    const glow = this.isHover || this.isPressed;

    if (glow) {
      fill(this.baseColor);
      drawingContext.shadowBlur = 35;
      drawingContext.shadowColor = this.baseColor.toString();
    } else {
      fill(lerpColor(this.baseColor, color(255), 0.2));
      drawingContext.shadowBlur = 0;
    }

    const scale = this.isPressed ? 0.9 : 1;
    const s = this.size * scale;

    rect(
      this.x + (this.size - s) / 2,
      this.y + (this.size - s) / 2,
      s,
      s,
      12
    );

    // Arcade border
    stroke(255, 80);
    strokeWeight(2);
    noFill();
    rect(this.x, this.y, this.size, this.size, 12);

    // Pulse ring
    noFill();
    stroke(red(this.baseColor), green(this.baseColor), blue(this.baseColor), this.pulse);
    strokeWeight(3);
    rect(
      this.x - this.pulse / 2,
      this.y - this.pulse / 2,
      this.size + this.pulse,
      this.size + this.pulse,
      16
    );

    // Label
    noStroke();
    fill(0);
    textAlign(CENTER, CENTER);
    textFont("Press Start 2P");
    textSize(12);
    text(this.label, this.x + this.size / 2, this.y + this.size / 2);

    // Key hint
    fill(0, 150);
    textSize(8);
    text(this.keySymbol(), this.x + this.size / 2, this.y + this.size / 2 + 26);

    drawingContext.shadowBlur = 0;
  }

  keySymbol() {
    if (this.keyCode === UP_ARROW) return "▲";
    if (this.keyCode === DOWN_ARROW) return "▼";
    if (this.keyCode === LEFT_ARROW) return "◀";
    if (this.keyCode === RIGHT_ARROW) return "▶";
    return "";
  }

  trigger() {
    userStartAudio();
    this.sound.play();
    this.isPressed = true;
    this.pulse = 45;

    const g = createArcadeGradient(this.baseColor);
    targetTop = g.top;
    targetBottom = g.bottom;
    gradientLerp = 0;
  }
}

// ----------------------------------
// Load Sounds
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
  textFont("Press Start 2P");

  const size = 140;
  const gap = 36;

  const grid = size * 2 + gap;
  const startX = width / 2 - grid / 2;
  const startY = height / 2 - grid / 2;

  const positions = [
    { x: startX, y: startY },
    { x: startX + size + gap, y: startY },
    { x: startX + size + gap, y: startY + size + gap },
    { x: startX, y: startY + size + gap }
  ];

  const labels = ["KICK", "SNARE", "HAT", "CLAP"];
  const keys = [UP_ARROW, RIGHT_ARROW, DOWN_ARROW, LEFT_ARROW];

  const colors = [
    color(255, 60, 180),  // neon pink
    color(0, 200, 255),   // cyan
    color(0, 255, 150),   // green
    color(255, 200, 0)    // yellow
  ];

  for (let i = 0; i < 4; i++) {
    buttons.push(
      new SoundButton(
        positions[i].x,
        positions[i].y,
        size,
        sounds[i],
        labels[i],
        keys[i],
        colors[i]
      )
    );
  }

  currentTop = color(20, 0, 40);
  currentBottom = color(5, 0, 15);
  targetTop = currentTop;
  targetBottom = currentBottom;
}

// ----------------------------------
// Draw
// ----------------------------------
function draw() {
  gradientLerp = min(gradientLerp + 0.03, 1);

  currentTop = lerpColor(currentTop, targetTop, gradientLerp);
  currentBottom = lerpColor(currentBottom, targetBottom, gradientLerp);

  drawGradient(currentTop, currentBottom);

  for (let b of buttons) {
    b.update();
    b.draw();
    b.isPressed = false;
  }
}

// ----------------------------------
// Gradient
// ----------------------------------
function drawGradient(topColor, bottomColor) {
  for (let y = 0; y < height; y++) {
    let t = y / height;
    stroke(lerpColor(topColor, bottomColor, t));
    line(0, y, width, y);
  }
}

// ----------------------------------
// Arcade Gradient Generator
// ----------------------------------
function createArcadeGradient(base) {
  colorMode(HSB, 360, 100, 100);
  let h = hue(base);

  let top = color(h, 80, 25);
  let bottom = color(h, 90, 10);

  colorMode(RGB, 255);
  return { top, bottom };
}

// ----------------------------------
// Interaction
// ----------------------------------
function mousePressed() {
  for (let b of buttons) {
    if (b.isHover) b.trigger();
  }
}

function keyPressed() {
  for (let b of buttons) {
    if (keyCode === b.keyCode) b.trigger();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
