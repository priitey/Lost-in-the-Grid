var fontUpload = document.getElementById("fontUpload");

let bg, fg, alt;
let tilesX, tilesY, tileW, tileH;
let gridVectors = [];
let objects = [];
let words = ['a', 'a', 'a', 'a']; // I want the user to be able to change the four words within the array
let colourArray;
let myFont, myFontAlt;
let allConverged = false, hideGUI = false;  // Flag to track if all objects have converged
let gui, newTilesX, newTilesY, amtLerp, amtLerpAlt, currentColour;
let bgColourPicker, fillColourPicker;
let sTilesX, sTilesY, sLerpAmtAlt, sLerpAmt, posXToggle, posYToggle, rectToggle, ellipseToggle, textToggle, resetButton;

function setup() {
  // Colours and colour array
  bg = color('#000000');
  fg = color('#14de1e');
  alt = color('#ff6600');
  alt2 = color('#ff33cc');
  background(fg);
  
  var c = createCanvas(windowWidth, windowHeight);
  c.parent("canvasWrapper");
  
  const fontUpload = document.getElementById("fontUpload");
  if (fontUpload) {
    fontUpload.addEventListener("change", handleChangeEvent);
    console.log("Font upload event listener attached");
  } else {
    console.log("Font upload element not found");
  }
  
  myFont = loadFont('assets/Px437_DOS-V_re_ANK24.ttf');
  myFontAlt = 'Courier New';
  
  textAlign(CENTER, CENTER);

  tilesX = 4;
  tilesY = 4;
  tileW = width * 0.75 / tilesX;
  tileH = height / tilesY;
  
  // Initialize lerp amounts
  amtLerp = 0.01;
  amtLerpAlt = 0.01;
   
  // Initialize the grid of vectors and objects
  initGridVectors(tilesX, tilesY);
  initObjects();
  displayGUI();
  colourPickers();
  displayWordInputs();
}

function displayGUI() {
  // GUI created here
  gui = createGui();
  gui.setRounding(2);
  gui.setFont(myFontAlt);
  gui.setTextSize(15);
  
  sTilesX = createSlider("Columns", width * 0.76, 50, 256, 27, 2, 10);
  sTilesX.setStyle({
    fillBg: bg,
    fillBgHover: bg,
    fillBgActive: bg,
    strokeBg: fg,
    strokeBgHover: fg,
    strokeBgActive: fg,
    fillTrack: fg,
    fillTrackHover: fg,
    fillTrackActive: fg,
    fillHandle: fg,
    fillHandleHover: bg,
    fillHandleActive: bg,
    strokeHandle: bg,
    strokeHandleHover: fg,
    strokeHandleActive: fg,
    strokeTrack: bg,
    strokeTrackHover: fg,
    strokeTrackActive: fg
  });
  
  sTilesY = createSlider("Rows", width * 0.76, 100, 256, 27, 2, 10);
  sTilesY.setStyle({
    fillBg: bg,
    fillBgHover: bg,
    fillBgActive: bg,
    strokeBg: fg,
    strokeBgHover: fg,
    strokeBgActive: fg,
    fillTrack: fg,
    fillTrackHover: fg,
    fillTrackActive: fg,
    fillHandle: fg,
    fillHandleHover: bg,
    fillHandleActive: bg,
    strokeHandle: bg,
    strokeHandleHover: fg,
    strokeHandleActive: fg,
    strokeTrack: bg,
    strokeTrackHover: fg,
    strokeTrackActive: fg
  });
  
  sLerpAmtAlt = createSlider("Lerp Amt Linear", width * 0.76, 150, 256, 27, 0.001, 0.27);
  sLerpAmtAlt.setStyle({
    fillBg: bg,
    fillBgHover: bg,
    fillBgActive: bg,
    strokeBg: fg,
    strokeBgHover: fg,
    strokeBgActive: fg,
    fillTrack: fg,
    fillTrackHover: fg,
    fillTrackActive: fg,
    fillHandle: fg,
    fillHandleHover: bg,
    fillHandleActive: bg,
    strokeHandle: bg,
    strokeHandleHover: fg,
    strokeHandleActive: fg,
    strokeTrack: bg,
    strokeTrackHover: fg,
    strokeTrackActive: fg
  });
  
  sLerpAmt = createSlider("Lerp Amt Wave", width * 0.76, 200, 256, 27, 0.01, 10);
  sLerpAmt.setStyle({
    fillBg: bg,
    fillBgHover: bg,
    fillBgActive: bg,
    strokeBg: fg,
    strokeBgHover: fg,
    strokeBgActive: fg,
    fillTrack: fg,
    fillTrackHover: fg,
    fillTrackActive: fg,
    fillHandle: fg,
    fillHandleHover: bg,
    fillHandleActive: bg,
    strokeHandle: bg,
    strokeHandleHover: fg,
    strokeHandleActive: fg,
    strokeTrack: bg,
    strokeTrackHover: fg,
    strokeTrackActive: fg
  });
  
  posXToggle = createToggle("Wave/Linear x-plane", width * 0.76, 250, 256, 27);
  posXToggle.labelOff = "Wave x-plane motion";
  posXToggle.labelOn = "Linear x-plane motion";
  posXToggle.setStyle({
    fillBgOff: bg,
    fillBgOffHover: bg,
    fillBgOffActive: bg,
    fillBgOn: fg,
    fillBgOnHover: fg,
    fillBgOnActive: fg,
    strokeBgOff: fg,
    strokeBgOffHover: fg,
    strokeBgOffActive: fg,
    strokeBgOn: fg,
    strokeBgOnHover: fg,
    strokeBgOnActive: fg,
    fillLabelOff: fg,
    fillLabelOffHover: fg,
    fillLabelOffActive: fg,
    fillLabelOn: bg,
    fillLabelOnHover: bg,
    fillLabelOnActive: bg
  });
  
  posYToggle = createToggle("Wave/Linear y-plane", width * 0.76, 300, 256, 27);
  posYToggle.labelOff = "Wave y-plane motion";
  posYToggle.labelOn = "Linear y-plane motion";
  posYToggle.setStyle({
    fillBgOff: bg,
    fillBgOffHover: bg,
    fillBgOffActive: bg,
    fillBgOn: fg,
    fillBgOnHover: fg,
    fillBgOnActive: fg,
    strokeBgOff: fg,
    strokeBgOffHover: fg,
    strokeBgOffActive: fg,
    strokeBgOn: fg,
    strokeBgOnHover: fg,
    strokeBgOnActive: fg,
    fillLabelOff: fg,
    fillLabelOffHover: fg,
    fillLabelOffActive: fg,
    fillLabelOn: bg,
    fillLabelOnHover: bg,
    fillLabelOnActive: bg
  });
  
  rectToggle = createToggle("Show/hide rects", width * 0.76, 350, 256);
  rectToggle.labelOff = "Show rectangles";
  rectToggle.labelOn = "Hide rectangles";
  rectToggle.setStyle({
    fillBgOff: bg,
    fillBgOffHover: bg,
    fillBgOffActive: bg,
    fillBgOn: fg,
    fillBgOnHover: fg,
    fillBgOnActive: fg,
    strokeBgOff: fg,
    strokeBgOffHover: fg,
    strokeBgOffActive: fg,
    strokeBgOn: fg,
    strokeBgOnHover: fg,
    strokeBgOnActive: fg,
    fillLabelOff: fg,
    fillLabelOffHover: fg,
    fillLabelOffActive: fg,
    fillLabelOn: bg,
    fillLabelOnHover: bg,
    fillLabelOnActive: bg
  });
  
  ellipseToggle = createToggle("Show/hide ellipses", width * 0.76, 400, 256);
  ellipseToggle.labelOff = "Show ellipses";
  ellipseToggle.labelOn = "Hide ellipses";
  ellipseToggle.setStyle({
    fillBgOff: bg,
    fillBgOffHover: bg,
    fillBgOffActive: bg,
    fillBgOn: fg,
    fillBgOnHover: fg,
    fillBgOnActive: fg,
    strokeBgOff: fg,
    strokeBgOffHover: fg,
    strokeBgOffActive: fg,
    strokeBgOn: fg,
    strokeBgOnHover: fg,
    strokeBgOnActive: fg,
    fillLabelOff: fg,
    fillLabelOffHover: fg,
    fillLabelOffActive: fg,
    fillLabelOn: bg,
    fillLabelOnHover: bg,
    fillLabelOnActive: bg
  });
  
  textToggle = createToggle("Show/hide text", width * 0.76, 450, 256);
  textToggle.labelOff = "Show text";
  textToggle.labelOn = "Hide text";
  textToggle.val = true;
  textToggle.setStyle({
    fillBgOff: bg,
    fillBgOffHover: bg,
    fillBgOffActive: bg,
    fillBgOn: fg,
    fillBgOnHover: fg,
    fillBgOnActive: fg,
    strokeBgOff: fg,
    strokeBgOffHover: fg,
    strokeBgOffActive: fg,
    strokeBgOn: fg,
    strokeBgOnHover: fg,
    strokeBgOnActive: fg,
    fillLabelOff: fg,
    fillLabelOffHover: fg,
    fillLabelOffActive: fg,
    fillLabelOn: bg,
    fillLabelOnHover: bg,
    fillLabelOnActive: bg
  });
  
  //Button
  resetButton = createButton("Reset motion", width * 0.76, 670, 256);
  resetButton.setStyle({
    fillBg: fg,
    fillBgHover: fg,
    fillBgActive: bg,
    fillLabel: bg,
    fillLabelHover: bg,
    fillLabelActive: fg,
    strokeBg: bg,
    strokeBgHover: bg,
    strokeBgActive: fg
  });
}

function updateWords() {
  for (let i = 0; i < wordInputs.length; i++) {
    words[i] = wordInputs[i].value();
  }
}

function draw() {
  background(bgColourPicker.color());
  
  // Dynamic user changable values
  amtLerpAlt = constrain(sLerpAmtAlt.val, 0.001, 0.27);
  amtLerp = sin(radians(frameCount * sLerpAmt.val * 0.1));
  
  sliderUpdates();
  noStroke();
  
  let convergedCount = 0;
  let convergenceThreshold = 1;
  
  // Display all the objects
    push();
    for (let obj of objects) {
      blendMode(DIFFERENCE);
      obj.updatePos();
      obj.display();
      // Calculate distance between current and next position
      let distance = dist(obj.pos.x, obj.pos.y, obj.nextPos.x, obj.nextPos.y);
  
      // If the object is within the threshold distance, count it as converged
      if (distance < convergenceThreshold) {
        convergedCount++;
      }
    }
    pop();
  
  // Optionally, you can trigger something when all objects converge
  // I want this to be a mode that the user can turn off and on
    if (convergedCount === objects.length) {
      // Reverse the motion by swapping currentPos and nextPos for each object
      for (let obj of objects) {
        let tempPos = obj.currentPos.copy();
        obj.currentPos = obj.nextPos.copy();
        obj.nextPos = tempPos.copy();
        obj.lerpAmt = 0;  // Reset the interpolation variables
        obj.lerpAmtAlt = 0;
      }
      allConverged = true;  // Set the flag to avoid continuous reversal in the next frames
    }
    
  //Border of canvas & backdrop for UI
  noFill();
  stroke(fg);
  rect(0, 0, width * 0.75, height);
  noStroke();
  fill(bg);
  rect(width * 0.75, 0, width * 0.25, height);
  drawGui();
  displayLabels();
  
  // Check if resetButton is pressed
  if (resetButton.isPressed) {
    // Recalculate tile sizes on resize
    tileW = width * 0.75 / tilesX;
    tileH = height / tilesY;

    // Re-initialize the grid vectors and objects
    initGridVectors(tilesX, tilesY);
    initObjects();
  }
}

// Create color pickers for background and fill colors
function colourPickers() {
  bgColourPicker = createColorPicker(bg);
  bgColourPicker.position(width * 0.85, 500);
  fillColourPicker = createColorPicker(fg);
  fillColourPicker.position(width * 0.85, 530);
}

function displayWordInputs() {
  // Create text input fields for each word
  wordInputs = [];
  for (let i = 0; i < words.length; i++) {
    let input = createInput(words[i]);
    input.position(width * 0.76, 500 + i * 30);
    input.size(100);
    input.input(updateWords);
    wordInputs.push(input);
  }
}

function displayLabels() {
  //Background and object colour selectors
  push();
  textFont(myFontAlt);
  textAlign(LEFT);
  textSize(15);
  fill(fg);
  
  //Slider labels
  text('Columns: ' + tilesX, width * 0.76, 40);
  text('Rows: ' + tilesY, width * 0.76, 90);
  text('X-Motion Speed', width * 0.76, 140);
  text('Y-Motion Speed', width * 0.76, 190);
  
  // Colour picker labels
  text('Background', width * 0.895, 512);
  text('Objects', width * 0.895, 542);
  
  // Press 'r' instructions
  //text('Press r to reset motion', width * 0.81, 700);
  //textAlign(CENTER, CENTER);
  pop();
}

//Only updates the number of columns and rows and resets canvas
function sliderUpdates() {
  // Get slider values and update grid size
  let newTilesX = floor(sTilesX.val);
  let newTilesY = floor(sTilesY.val);
  
  if (sTilesX.isChanged || sTilesY.isChanged) {
    
    // Update tilesX and tilesY when the sliders change
    tilesX = newTilesX;
    tilesY = newTilesY;
    
    // Recalculate tile sizes
    tileW = width * 0.75 / tilesX;
    tileH = height / tilesY;
    
    // Re-initialize grid and objects
    initGridVectors(tilesX, tilesY);
    initObjects();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  // Recalculate tile sizes on resize
  tileW = width * 0.75 / tilesX;
  tileH = height / tilesY;

  // Re-initialize the grid vectors and objects
  initGridVectors(tilesX, tilesY);
  initObjects();
}

function keyPressed() {
  if (key === 'r') {
    // Recalculate tile sizes on resize
    tileW = width * 0.75 / tilesX;
    tileH = height / tilesY;

    // Re-initialize the grid vectors and objects
    initGridVectors(tilesX, tilesY);
    initObjects();
  }
  
  if (key === 'h') {
    hideGUI = true;
  } else {
    hideGUI = false;
  }
}

// Initialise the grid with vectors
function initGridVectors(tilesX, tilesY) {
  gridVectors = [];
  for (let i = 0; i < tilesX; i++) {
    let row = [];
    for (let j = 0; j < tilesY; j++) {
      row.push(createVector(i * tileW, j * tileH));
    }
    gridVectors.push(row);
  }
}

// Initialize objects on the grid
function initObjects() {
  objects = [];

  for (let i = 0; i < tilesX; i++) {
    for (let j = 0; j < tilesY; j++) {
      let pos = gridVectors[i][j]; // Get the position from grid
      let obj = new GridObject(pos, tileW, tileH); // Create new object
      objects.push(obj); // Add object to the array
    }
  }
}

//Class for grid objects
class GridObject {
  constructor(pos, w, h) {
    this.pos = pos;  // Position is a vector (x, y)
    this.w = w;      // Width of the object (based on tile width)
    this.h = h;      // Height of the object (based on tile height)
    this.currentPos = pos.copy();
    this.nextPos = this.getRandomNextPos();
    this.lerpAmt = amtLerp;
    this.lerpAmtAlt = amtLerpAlt;
    this.word = random(words);
    this.randomCol = currentColour;
  }

  // Generate a random next position on the grid
  getRandomNextPos() {
    let randomX = Math.floor(random(0, tilesX));
    let randomY = Math.floor(random(0, tilesY));
    return gridVectors[randomX][randomY];
  }

  updatePos() {
    if (posXToggle.val == true) {
      this.pos.x = lerp(this.currentPos.x, this.nextPos.x, this.lerpAmtAlt);
    } else if (posXToggle.val == false){
      this.pos.x = lerp(this.currentPos.x, this.nextPos.x, this.lerpAmt);
    }

    if (posYToggle.val == true) {
      this.pos.y = lerp(this.currentPos.y, this.nextPos.y, this.lerpAmtAlt);
    } else if (posYToggle.val == false) {
      this.pos.y = lerp(this.currentPos.y, this.nextPos.y, this.lerpAmt);
    }

    // The user will be able to switch between the different lermpAmt's
    this.lerpAmtAlt += amtLerpAlt * 0.1; // This amount is user-controllable from 0.01 to 0.27 in main draw loop
    this.lerpAmt = amtLerp; // Adjusting the multiplying factor is user-controllable from 0.01 to 10 in main draw loop

    // If the interpolation is complete, reset to start moving to a new random position
    if (this.lerpAmtAlt >= 1) {
      this.currentPos = this.pos.copy();      // Set the current position to the final position
      this.nextPos = this.getRandomNextPos(); // Get a new random target position
      this.word = random(words);
      this.lerpAmt = 0;
      this.lerpAmtAlt = 0;
    }
  }

  display() {
    fill(fillColourPicker.color());
    if (rectToggle.val == true) {
    rect(this.pos.x, this.pos.y, this.w, this.h);  // Can be switched off/on by user
    }
    if (ellipseToggle.val == true) {
    ellipseMode(CORNER);
    ellipse(this.pos.x, this.pos.y, this.w, this.h);  // Can be switched off/on by user
    }
    if (textToggle.val == true) {
    textFont(myFont);
    textSize(this.w / 2);
    text(this.word, this.pos.x + tileW / 2, this.pos.y + tileH / 2); //Can be switched off/on by user
    }
  }
}

function handleChangeEvent(event) {
  let file = event.target.files[0];
  console.log("FileReader onload called");

  if (event.target.id === "fontUpload") {
    const reader = new FileReader();
    reader.onload = function(e) {
      myFont = loadFont(e.target.result, () => {
        console.log("Font loaded successfully");
      }, () => {
        console.log("Failed to load font");
      });
    };
    reader.readAsDataURL(file);
  } else {
    console.log("No file selected");
  }
}
