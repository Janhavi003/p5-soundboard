// ----------------------------------
// Global variables
// ----------------------------------
let buttons = [];
let sounds = [];

let currentTop;
let currentBottom;
let targetTop;
let targetBottom;
let gradientLerp = 1;

// ----------------------------------
// Button class
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

    this.pulse *= 0.9;
  }

  draw() {
    noStroke();

    const glow = this.isHover || this.isPressed;

    if (glow) {
      fill(this.baseColor);
      drawingContext.shadowBlur = 25;
      drawingContext.shadowColor = this.baseColor.toString();
    } else {
      fill(lerpColor(this.baseColor, color(255), 0.25));
      drawingContext.shadowBlur = 0;
    }

    const scale = this.isPressed ? 0.92 : 1;
    const s = this.size * scale;

    rect(
      this.x + (this.size - s) / 2,
      this.y + (this.size - s) / 2,
      s,
      s,
      18
    );

    // Pulse ring
    noFill();
    stroke(red(this.baseColor), green(this.baseColor), blue(this.baseColor), this.pulse);
    strokeWeight(3);
    rect(
      this.x - this.pulse / 2,
      this.y - this.pulse / 2,
      this.size + this.pulse,
      this.size + this.pulse,
      22
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

    const g = createPastelGradient(this.baseColor);
    targetTop = g.top;
    targetBottom = g.bottom;
    gradientLerp = 0;
  }
}

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
    { x: startX, y: startY },
    { x: startX + size + gap, y: startY },
    { x: startX + size + gap, y: startY + size + gap },
    { x: startX, y: startY + size + gap }
  ];

  const labels = ["KICK", "SNARE", "HAT", "CLAP"];
  const keys = [UP_ARROW, RIGHT_ARROW, DOWN_ARROW, LEFT_ARROW];

  // Distinct base colors
  const colors = [
    color(255, 120, 180), // pink
    color(120, 170, 255), // blue
    color(120, 220, 170), // green
    color(255, 200, 120)  // peach
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

  // Initial background
  currentTop = color(40, 40, 60);
  currentBottom = color(15, 15, 30);
  targetTop = currentTop;
  targetBottom = currentBottom;
}

// ----------------------------------
// Draw
// ----------------------------------
function draw() {
  gradientLerp = min(gradientLerp + 0.02, 1);

  currentTop = lerpColor(currentTop, targetTop, gradientLerp);
  currentBottom = lerpColor(currentBottom, targetBottom, gradientLerp);

  drawGradient(currentTop, currentBottom);

  for (let button of buttons) {
    button.update();
    button.draw();
    button.isPressed = false;
  }
}

// ----------------------------------
// Gradient renderer
// ----------------------------------
function drawGradient(topColor, bottomColor) {
  noFill();
  for (let y = 0; y < height; y++) {
    let t = y / height;
    let c = lerpColor(topColor, bottomColor, t);
    stroke(c);
    line(0, y, width, y);
  }
}

// ----------------------------------
// Pastel gradient generator
// ----------------------------------
function createPastelGradient(base) {
  colorMode(HSB, 360, 100, 100, 100);

  let h = hue(base);
  let s = saturation(base);
  let b = brightness(base);

  let top = color(h, max(10, s * 0.25), min(100, b + 20));
  let bottom = color(h, max(8, s * 0.18), min(100, b + 10));

  colorMode(RGB, 255);
  return { top, bottom };
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
// Keyboard interaction
// ----------------------------------
function keyPressed() {
  for (let button of buttons) {
    if (keyCode === button.keyCode) {
      button.trigger();
    }
  }
}

// ----------------------------------
// Resize handling
// ----------------------------------
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
