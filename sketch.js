let ripples = [];
let clickCount = 0;
let baseR = 200;
let baseG = 120;
let baseB = 255;
let mode = 0;
let Start = true;
function setup() {
  createCanvas(800, 500);
  rectMode(CENTER);
}

function draw() {
  background(0, 30);

  // START SCREEN
  if (Start) {
    fill(255);
    textSize(24);
    text("Hold and drag for Ripples in Time", width / 2, height / 2);
    return;
  }

  if (mouseIsPressed) {
    let r = new Ripple(mouseX, mouseY, baseR, baseG, baseB, mode);
    ripples.push(r);

    if (ripples.length > 250) {
      ripples.splice(0, 1);
    }
  }

  for (let i = ripples.length - 1; i >= 0; i--) {
    ripples[i].move();
    if (ripples[i].isOut() == true) {
      ripples.splice(i, 1);
    }
  }

  // pixel trace
  PixelSparkles();

  for (let i = 0; i < ripples.length; i++) {
    ripples[i].display();
  }
}

function mousePressed() {
  //start screen end
  if (Start) {
    Start = false;
    return;
  }

  // post start screen
  clickCount++;

  if (clickCount % 3 == 0) {
    baseR = random(0, 255);
    baseG = random(0, 255);
    baseB = random(0, 255);

    mode = mode + 1;
    if (mode > 2) {
      mode = 0;
    }
  }
}

//pixal
function PixelSparkles() {
  if (ripples.length == 0) return;
  loadPixels();
  let sparklesPerRipple = 20;
  for (let i = 0; i < ripples.length; i++) {
    let rp = ripples[i];

    for (let n = 0; n < sparklesPerRipple; n++) {

      let angle = random(TWO_PI);
      let radius = random(0, 25);

      let sx = floor(rp.x + cos(angle) * radius);
      let sy = floor(rp.y + sin(angle) * radius);

      if (sx >= 0 && sx < width && sy >= 0 && sy < height) {

        let index = (sx + sy * width) * 4;

        // blend 
        pixels[index] = pixels[index] * 0.7 + rp.r * 0.3;
        pixels[index + 1] = pixels[index + 1] * 0.7 + rp.g * 0.3;
        pixels[index + 2] = pixels[index + 2] * 0.7 + rp.b * 0.3;
      }
    }
  }

  updatePixels();
}

class Ripple {
  constructor(x, y, r, g, b, m) {
    this.x = x;
    this.y = y;

    this.r = r;
    this.g = g;
    this.b = b;

    this.mode = m;

    this.rings = [];
    this.addRing();

    this.age = 0;
    this.maxAge = 180;
  }

  addRing() {
    let ring = {
      radius: 0,
      alpha: 200,
      thickness: random(1, 4),
      growth: 0
    };

    if (this.mode == 0) {
      ring.growth = random(2, 3);
    } else if (this.mode == 1) {
      ring.growth = random(1, 3);
    } else if (this.mode == 2) {
      ring.growth = random(3, 5);
    }

    this.rings.push(ring);
  }

  move() {
    this.age++;

    if (this.age < this.maxAge / 2 &&
      this.age % 100 == 0 &&
      this.rings.length < 12) {
      this.addRing();
    }

    for (let i = this.rings.length - 1; i >= 0; i--) {
      let ring = this.rings[i];

      ring.radius += ring.growth;
      ring.alpha -= 3;

      if (this.mode == 1) {
        this.y += 0.1;
      } else if (this.mode == 2) {
        this.x += sin(frameCount * 0.05) * 0.3;
      }

      if (ring.alpha <= 0 || ring.radius > max(width, height)) {
        this.rings.splice(i, 1);
      }
    }
  }

  display() {
    noFill();

    for (let i = 0; i < this.rings.length; i++) {
      let ring = this.rings[i];

      stroke(this.r, this.g, this.b, ring.alpha);
      strokeWeight(ring.thickness);

      if (this.mode == 0) {
        circle(this.x, this.y, ring.radius * 2);
      } else if (this.mode == 1) {
        rect(this.x, this.y, ring.radius * 2, ring.radius * 2);
      } else if (this.mode == 2) {
        line(this.x - ring.radius, this.y,
          this.x + ring.radius, this.y);
        line(this.x, this.y - ring.radius,
          this.x, this.y + ring.radius);
      }
    }
  }

  isOut() {
    return (this.age > this.maxAge && this.rings.length == 0);
  }
}