const PAD_CONFIG = [
  { label: "KICK", key: "Q", file: "kick.mp3", color: [255, 60, 180] },
  { label: "SNARE", key: "W", file: "snare.mp3", color: [0, 200, 255] },
  { label: "HAT", key: "E", file: "hat.mp3", color: [0, 255, 150] },
  { label: "CLAP", key: "A", file: "clap.mp3", color: [255, 200, 0] },
  { label: "FX 1", key: "S", file: "fx1.mp3", color: [180, 120, 255] },
  { label: "FX 2", key: "D", file: "fx2.mp3", color: [255, 140, 0] },
  { label: "BASS", key: "Z", file: "bass.mp3", color: [80, 200, 255] },
  { label: "PERC", key: "X", file: "perc.mp3", color: [255, 120, 160] },
  { label: "LEAD", key: "C", file: "lead.mp3", color: [120, 255, 180] }
];

let buttons = [];
let currentTop, currentBottom;
let targetTop, targetBottom;
let gradientLerp = 1;
let globalPulse = 0;

class SoundButton {
  constructor(x, y, size, sound, label, key, baseColor) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.sound = sound;
    this.label = label;
    this.key = key;
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
    this.isPressed = this.isPressed && this.pulse > 5;
  }

  draw() {
    noStroke();
    const glow = this.isHover || this.isPressed;
    let fillColor = this.baseColor;
    if (this.isPressed) fillColor = lerpColor(this.baseColor, color(0), 0.15);
    fill(fillColor);
    drawingContext.shadowBlur = glow ? 35 : 0;
    drawingContext.shadowColor = this.baseColor.toString();

    const scale = this.isPressed ? 0.9 : 1;
    const s = this.size * scale;

    rect(
      this.x + (this.size - s) / 2,
      this.y + (this.size - s) / 2,
      s,
      s,
      14
    );

    stroke(255, 80);
    strokeWeight(2);
    noFill();
    rect(this.x, this.y, this.size, this.size, 14);

    noFill();
    stroke(red(this.baseColor), green(this.baseColor), blue(this.baseColor), this.pulse);
    strokeWeight(3);
    rect(this.x - this.pulse / 2, this.y - this.pulse / 2, this.size + this.pulse, this.size + this.pulse, 18);

    noStroke();
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(12);
    text(this.label, this.x + this.size / 2, this.y + this.size / 2);

    textSize(8);
    fill(0, 150);
    text(this.key, this.x + this.size / 2, this.y + this.size / 2 + 26);

    drawingContext.shadowBlur = 0;
  }

  trigger() {
    userStartAudio();
    if (this.sound.isPlaying()) this.sound.stop();
    this.sound.play();
    this.isPressed = true;
    this.pulse = this.size * 0.4;
    globalPulse = 30;
    const g = createArcadeGradient(this.baseColor);
    targetTop = g.top;
    targetBottom = g.bottom;
    gradientLerp = 0;
  }
}

function preload() {
  for (let pad of PAD_CONFIG) {
    pad.sound = loadSound(`assets/sounds/${pad.file}`);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Press Start 2P");

  currentTop = color(20, 0, 40);
  currentBottom = color(5, 0, 15);
  targetTop = currentTop;
  targetBottom = currentBottom;

  layoutButtons();
}

function layoutButtons() {
  buttons = [];

  const cols = 3;
  const size = min(width, height) * 0.18;
  const gap = size * 0.25;
  const total = cols * size + (cols - 1) * gap;
  const startX = width / 2 - total / 2;
  const startY = height / 2 - total / 2 + 20;

  PAD_CONFIG.forEach((pad, i) => {
    const x = startX + (i % cols) * (size + gap);
    const y = startY + floor(i / cols) * (size + gap);
    buttons.push(new SoundButton(x, y, size, pad.sound, pad.label, pad.key, color(...pad.color)));
  });
}

function draw() {
  gradientLerp = min(gradientLerp + 0.03, 1);
  globalPulse *= 0.9;
  currentTop = lerpColor(currentTop, targetTop, gradientLerp);
  currentBottom = lerpColor(currentBottom, targetBottom, gradientLerp);
  drawGradient(currentTop, currentBottom);

  noStroke();
  fill(0, 60);
  rectMode(CENTER);
  rectMode(CORNER);

  for (let b of buttons) {
    b.update();
    b.draw();
  }
}

function drawGradient(topColor, bottomColor) {
  for (let y = 0; y < height; y++) {
    const t = y / height;
    const wobble = sin(t * PI + frameCount * 0.05) * globalPulse;
    stroke(lerpColor(topColor, bottomColor, t));
    line(wobble * 0.2, y, width + wobble * 0.2, y);
  }
}

function createArcadeGradient(base) {
  colorMode(HSB, 360, 100, 100);
  const h = hue(base);
  const top = color(h, 80, 25);
  const bottom = color(h, 90, 10);
  colorMode(RGB, 255);
  return { top, bottom };
}

function mousePressed() {
  for (let b of buttons) {
    if (b.isHover) b.trigger();
  }
}

function keyPressed() {
  for (let b of buttons) {
    if (key.toUpperCase() === b.key) {
      b.trigger();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  layoutButtons();
}
