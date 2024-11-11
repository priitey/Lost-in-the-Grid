class vectorObjs {
  constructor(x, y) {
    this.dragging = false;
    this.rollover = false;
    this.x = x;
    this.y = y;
    this.bdry = 15;
    this.offsetX = 0;
    this.offsetY = 0;
    this.prevX = x;  // Store the previous position for wave motion
    this.prevY = y;
    this.initialX = x;
    this.initialY = y;
    this.isMoving = false;  // Track if the vector is in motion
    this.rate = random(0.1, 5);
  }

  over() {
    if (mouseX > this.x && mouseX < this.x + this.bdry && mouseY > this.y && mouseY < this.y + this.bdry) {
      this.rollover = true;
    } else {
      this.rollover = false;
    }
  }

  update() {
    if (this.dragging) {
      // While dragging, update position
      this.x = mouseX - this.offsetX;
      this.y = mouseY - this.offsetY;
      this.isMoving = false;  // Stop motion when manually dragged

      // Constrain the x and y coordinates within the desired range
      this.x = constrain(this.x, 0, width * 0.8);
      this.y = constrain(this.y, 0, height);

      // Constrain after axis locking
      this.x = constrain(this.x, 0, width * 0.8);
      this.y = constrain(this.y, 0, height);
    } else if (this.isMoving) {
      // Update the previous position to current position when in motion
      this.prevX = this.x;
      this.prevY = this.y;
    }
  }

  motion() {
    if (gridMotion) {
    this.isMoving = true;  // Enable motion

    // Calculate oscillation factor using sine wave
    let oscillation = (sin(radians(frameCount * this.rate)) + 0.5) / 10;  // This gives a value between 0 and 1

    // Interpolate between the current position and the target position
    this.x = lerp(this.initialX, targetVector.x, oscillation);
    this.y = lerp(this.initialY, targetVector.y, oscillation);

    print(`Oscillation: ${oscillation}, X: ${this.x}, Y: ${this.y}`);
    
    // Highlight the target vector for motion behaviour
    if (showGuides) {
      push();
      stroke(255, 0, 0);
      strokeWeight(4);
      fill(255, 0, 0);
      rect(targetVector.x, targetVector.y, this.bdry, this.bdry);
      pop();
     }
     
    } else {
      this.isMoving = false;  // Stop moving when motion is disabled
    }
  }
  
  reset() {
    this.x = this.initialX;
    this.y = this.initialY;
    this.isMoving = false;  // Stop motion after reset
  }

  show() {
    push();
    noStroke();
    if (!showGuides) return;
    if (this.dragging) {
      fill(alt);
    } else if (this.rollover) {
      fill(hlt);
    } else {
      fill(fg);
    }
    rect(this.x, this.y, this.bdry, this.bdry);
    pop();
  }

  pressed() {
    if (mouseX > this.x && mouseX < this.x + this.bdry && mouseY > this.y && mouseY < this.y + this.bdry) {
      this.dragging = true;
      this.offsetX = this.x - mouseX;
      this.offsetY = this.y - mouseY;
      this.isMoving = false;  // Stop motion when dragged
    }
  }

  released() {
    this.dragging = false;
    this.lockedAxis = null;  // Reset axis lock after releasing
  }
}
