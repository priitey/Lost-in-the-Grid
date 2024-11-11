var imageUpload = document.getElementById("imageUpload");
var headerFontUpload = document.getElementById("headerFontUpload");
var bodyFontUpload = document.getElementById("bodyFontUpload");

let grid = [], cellW, cellH, rock;
let myFont, img = null;
let headerFont, bodyFont;
let font, fontPath, path, msgHd, msgBd1, msgBd2, msgBd3, previousMsg = '', points = [], mag;
let fontLoaded = false;
let rows = 3, newRows;
let cols = 3, newCols;
let bg, fg, alt, hlt;
let cellTypes = [], cellTypeStr = "None", textShowing = false;
let textToShow = "Lorem Ipsum \nDoner Kebab";
let showGuides = true, gridMotion = false;
let targetVector;
let inputHeader, inputBdy1, inputBdy2, inputBdy3;
let clrPckrBg, clrPckrHd, clrPckrBdy;
let gui, objsB, txtB, guidesB, mvmtB, resetB, rowS, colS;

function preload() {
  rock = loadImage("rock.png");
  myFont = "Courier New";
}

function getTextOutlines() {
  if (headerFont == null) {
    opentype.load("assets/Px437_DOS-V_re_ANK24.ttf", function(err, f) {
      if (err) {
        console.log(err);
      } else {
        font = f;
        fontLoaded = true;  // Set flag to true when the font is loaded
        generatePoints();  // Now generate points
      }
    });
  } else {
    opentype.load(headerFont, function(err, f) {
      if (err) {
        console.log(err);
      } else {
        font = f;
        fontLoaded = true;  // Set flag to true when the font is loaded
        generatePoints();  // Now generate points
      }
    });
  }
}

function generatePoints() {
  if (msgHd && msgHd.length > 0 && fontLoaded) {
    // Clear the points array to remove old points
    points = [];

    // Only proceed if msgHd has a value and the font is loaded
    fontPath = font.getPath(msgHd, 0, 0, mag);
    path = new g.Path(fontPath.commands);
    path = g.resampleByLength(path, 1);

    for (let i = 0; i < path.commands.length; i++) {
      if (path.commands[i].type == "M") {
        points.push([]);
      }

      if (path.commands[i].type != "Z") {
        points[points.length - 1].push(createVector(path.commands[i].x, path.commands[i].y));
      }
    }
  }
}

// Initialise p5.touchgui objects and colour pickers
function initGUI() {
  gui = createGui();
  gui.setRounding(2);
  gui.setFont("Courier New");
  gui.setTextSize(12);
  
  //Randomise objects in grid
  objsB = createButton("Randomise objects", width * 0.871, height * 0.17); // x, y, width, height
  objsB.setStyle({
    fillBg: bg,
    fillBgHover: fg,
    fillBgActive: bg,
    strokeBg: fg,
    strokeBgHover: fg,
    strokeBgActive: fg,
    fillLabel: fg,
    fillLabelHover: bg,
    fillLabelActive: fg
  });
  objsB.onPress = function() {
    genRanTypes();
    assignRanText();
  };
  
  // Push text input strings to cell type: text
  textB = createButton("Add text to grid", width * 0.871, height * 0.217); // x, y, width, height
  textB.setStyle({
    fillBg: bg,
    fillBgHover: fg,
    fillBgActive: bg,
    strokeBg: fg,
    strokeBgHover: fg,
    strokeBgActive: fg,
    fillLabel: fg,
    fillLabelHover: bg,
    fillLabelActive: fg
  });
  textB.onPress = function() {
    assignRanText();
  };
  
  guidesB = createToggle("Grid guides", width * 0.8, height * 0.17, 84);
  guidesB.setStyle({
    fillBgOff: fg,
    fillBgOffHover: fg,
    fillBgOffActive: fg,
    fillBgOn: bg,
    fillBgOnHover: bg,
    fillBgOnActive: bg,
    strokeBgOff: fg,
    strokeBgOffHover: fg,
    strokeBgOffActive: fg,
    strokeBgOn: fg,
    strokeBgOnHover: fg,
    strokeBgOnActive: fg,
    fillLabelOff: bg,
    fillLabelOffHover: bg,
    fillLabelOffActive: bg,
    fillLabelOn: fg,
    fillLabelOnHover: fg,
    fillLabelOnActive: fg
  });
  guidesB.labelOff = "Hide guides";
  guidesB.labelOn = "Show guides";
  //guidesB.onPress = function() {
    //console.log(guidesB.val);
  //};
  
  mvmtB = createToggle("Play/pause motion", width * 0.8, height * 0.217, 84);
  mvmtB.setStyle({
    fillBgOff: fg,
    fillBgOffHover: fg,
    fillBgOffActive: fg,
    fillBgOn: bg,
    fillBgOnHover: bg,
    fillBgOnActive: bg,
    strokeBgOff: fg,
    strokeBgOffHover: fg,
    strokeBgOffActive: fg,
    strokeBgOn: fg,
    strokeBgOnHover: fg,
    strokeBgOnActive: fg,
    fillLabelOff: bg,
    fillLabelOffHover: bg,
    fillLabelOffActive: bg,
    fillLabelOn: fg,
    fillLabelOnHover: fg,
    fillLabelOnActive: fg
  }); 
  mvmtB.labelOff = "Play";
  mvmtB.labelOn = "Pause";
  mvmtB.onPress = function() {
    print("Play button pressed");
    setMotionTarget();
  }
  
  resetB = createButton("Reset objects", width * 0.871, height * 0.2665);
  resetB.setStyle({
    fillBg: bg,
    fillBgHover: fg,
    fillBgActive: bg,
    strokeBg: fg,
    strokeBgHover: fg,
    strokeBgActive: fg,
    fillLabel: fg,
    fillLabelHover: bg,
    fillLabelActive: fg
  });
  resetB.onPress = function() {
    resetAll();
  };
  
  rowS = createSlider("No. of rows", width * 0.8, height * 0.6, 222, 25, 2, 10);
  rowS.val = 3;
  rowS.setStyle({
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
  
  colS = createSlider("No. of cols", width * 0.8, height * 0.66, 222, 25, 2, 10);
  colS.val = 3;
  colS.setStyle({
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
  
  //Colour pickers here
  clrPckrBg = createColorPicker(66);
  clrPckrBg.position(width * 0.871, height * 0.39);
  
  clrPckrHd = createColorPicker(211);
  clrPckrHd.position(width * 0.871, height * 0.43);
  
  clrPckrBdy = createColorPicker(211);
  clrPckrBdy.position(width * 0.871, height * 0.47);
}

function setup() {
  var c = createCanvas(windowWidth, windowHeight);
  c.parent("canvasWrapper");

  const imageUpload = document.getElementById("imageUpload");
  if (imageUpload) {
    imageUpload.addEventListener("change", handleChangeEvent);
    console.log("Image upload event listener attached");
  } else {
    console.log("Image upload element not found");
  }

  const headerFontUpload = document.getElementById("headerFontUpload");
  if (headerFontUpload) {
    headerFontUpload.addEventListener("change", handleChangeEvent);
    console.log("Header font upload event listener attached");
  } else {
    console.log("Header font upload element not found");
  }

  const bodyFontUpload = document.getElementById("bodyFontUpload");
  if (bodyFontUpload) {
    bodyFontUpload.addEventListener("change", handleChangeEvent);
    console.log("Body font upload event listener attached");
  } else {
    console.log("Body font upload element not found");
  }
  
  textFont(myFont);
  bg = color(0);
  fg = color(20, 222, 30);
  alt = color(233, 133, 122);
  hlt = color(233, 33, 22);
  mag = 200;
  rock.filter(GRAY);
  background(0);
  
  getTextOutlines();
  
  createGrid();
  genRanTypes();
  assignRanText();
  
  // Header text input
  inputHeader = createInput('');
  inputHeader.attribute('placeholder', 'Type here!');
  inputHeader.position(width * 0.871, height * 0.01);
  inputHeader.size(100);
  inputHeader.value("Bob's Rocks");
  
  // Body text inputs
  inputBdy1 = createInput('');
  inputBdy1.attribute('placeholder', 'or here!');
  inputBdy1.position(width * 0.871, height * 0.05);
  inputBdy1.size(100);
  inputBdy1.value("Amethysts, Rare Metals, Amber, A Diamond...");
  
  inputBdy2 = createInput('');
  inputBdy2.attribute('placeholder', 'and here!');
  inputBdy2.position(width * 0.871, height * 0.09);
  inputBdy2.size(100);
  inputBdy2.value("We have it all! Don't hesitate! We accept trades! Ask us about our scented summer specials!");
  
  inputBdy3 = createInput('');
  inputBdy3.attribute('placeholder', "don't forget here!");
  inputBdy3.position(width * 0.871, height * 0.13);
  inputBdy3.size(100);
  inputBdy3.value("We always stand on business.");
  
  initGUI();
}

function draw() {
  background(clrPckrBg.color());
  
  // Change row and column numbers
  modRowsAndCols();
  
  // Header text
  msgHd = inputHeader.value();
  //Body texts
  msgBd1 = inputBdy1.value();
  msgBd2 = inputBdy2.value();
  msgBd3 = inputBdy3.value();
  
  if (msgHd !== previousMsg && fontLoaded) {
    points = [];  // Clear the points array
    generatePoints();  // Generate new points based on the updated message
    previousMsg = msgHd;  // Update the previous message
  }
  
  drawObjs();
  drawGridVecs();
  drawDistBtwnVecs();
  checkGridCellType();
  
  //Border of canvas & backdrop for UI
  push();
  noFill();
  stroke(fg);
  rect(0, 0, width * 0.75, height);
  noStroke();
  fill(0);
  rect(width * 0.75, 0, width * 0.25, height);
  pop();
  
  // Labels for GUI
  textFont('Courier New');
  text("Header Text: ", width * 0.8, height * 0.028);
  text("Body Text 1: ", width * 0.8, height * 0.068);
  text("Body Text 2: ", width * 0.8, height * 0.108);
  text("Body Text 3: ", width * 0.8, height * 0.148);
  
  text("Background:", width * 0.8, height * 0.41);
  text("Header:", width * 0.8, height * 0.45);
  text("Body:", width * 0.8, height * 0.49);
  
  text("Rows: " + rows, width * 0.8, height * 0.592);
  text("Columns: " + cols, width * 0.8, height * 0.652);
  
  //text("cellType: " + cellTypeStr, width * 0.8, height * 0.9);
  
  toggleFunctions();
  // Display the GUI! This has to be called in the draw loop or somewhere at least 
  // for touchgui elements to be visually represented!
  drawGui();
}

function modRowsAndCols() {
  let newRows = floor(rowS.val);
  let newCols = floor(colS.val);
  
  if (newRows !== rows || newCols !== cols) {
    rows = newRows;
    cols = newCols;

    createGrid();  // Recreate the grid after modifying rows and columns
    //genRanTypes(); // If this isn't called then the sketch will eventually break
  }
}

// Create the structure of the grid dependent on canvas dimensions and number of columns & rows
function createGrid() {
  grid = [];
  cellTypes = [];

  // Define the offset for the grid's starting position
  let gridOffsetX = width * 0.06;
  let gridOffsetY = height * 0.04;

  // Calculate cell width and height
  cellW = (width * 0.6) / cols;  // Adjust for the 0.2 offset, width * 0.8 becomes width * 0.6 for grid area
  cellH = (height * 0.9) / rows; // Adjust for the height offset, keeping height constraint

  // Populate grid with vectors, applying the offsets
  for (let i = 0; i <= rows; i++) {
    let row = [];
    let rowTypes = [];
    for (let j = 0; j <= cols; j++) {
      let x = gridOffsetX + j * cellW;  // Apply horizontal offset
      let y = gridOffsetY + i * cellH;  // Apply vertical offset
      row.push(new vectorObjs(x, y));   // Pass the adjusted x and y

      let randType = floor(random(3));
      rowTypes.push(randType);
    }
    grid.push(row);
    cellTypes.push(rowTypes);
  }
}

// Generate random types for each cell in the grid
function genRanTypes() {
  cellTypes = [];
  
  //print(rows);
  for (let i = 0; i < rows + 1; i++) {
    let rowTypes = [];
    for (let j = 0; j < cols + 1; j++) {
      let randType = floor(random(3));  // Randomly assign 0 (rect), 1 (image), or 2 (text)
      rowTypes.push(randType);
    }
    cellTypes.push(rowTypes);
  }
}

// Assign a random value from the body text input objects to cells that are of type 1 (text)
function assignRanText() {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      // Check if the cell type is 1 (text)
      if (cellTypes[i][j] === 1) {
        // Randomly choose between msgBd1, msgBd2, or msgBd3
        let randText = floor(random(3));
        if (randText === 0) {
          grid[i][j].textContent = msgBd1;
        } else if (randText === 1) {
          grid[i][j].textContent = msgBd2;
        } else {
          grid[i][j].textContent = msgBd3;
        }
      }
    }
  }
}

// Display the corners and points of intersections of the grid
function drawGridVecs() {
  // Represent each vector as a rectangle
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      let vObj = grid[i][j];
      vObj.over();  // Check for rollover state
      vObj.update();  // Update dragging state
      vObj.show();
    }
  }
}

// Display the distance between each vector and it's neighbouring vectors
// that are directly above, below, to it's left, to it's right
function drawDistBtwnVecs() {
  push();
  if (!showGuides) {
    return;
  }
  
  // Loop through each row and col in the grid
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      // Get the current vector
      let v = grid[i][j];
      let distAbove, distBelow, distLeft, distRight;

      // Check if there is a vector above the current vector
      if (i > 0) {
        // Get the vector above the current vector
        let above = grid[i-1][j];
        // Calculate the distance between the current vector and the vector above
        let distAbove = dist(v.x, v.y, above.x, above.y);
        // Display the distance at the midpoint between the current vector and the vector above
        fill(fg);
        noStroke();
        text(distAbove.toFixed(2), (v.x + above.x) / 2, (v.y + above.y) / 2);
        stroke(fg);
        line(v.x, v.y, above.x, above.y);
      }

      // Check if there is a vector below the current vector
      if (i < grid.length - 1) {
        let below = grid[i+1][j];
        let distBelow = dist(v.x, v.y, below.x, below.y);
        fill(fg);
        noStroke();
        text(distBelow.toFixed(2), (v.x + below.x) / 2, (v.y + below.y) / 2);
        stroke(fg);
        line(v.x, v.y, below.x, below.y);
      }

      // Check if there is a vector to the left of the current vector
      if (j > 0) {
        let left = grid[i][j-1];
        let distLeft = dist(v.x, v.y, left.x, left.y);
        fill(fg);
        noStroke();
        text(distLeft.toFixed(2), (v.x + left.x) / 2, (v.y + left.y) / 2);
        stroke(fg);
        line(v.x, v.y, left.x, left.y);
      }

      // Check if there is a vector to the right of the current vector
      if (j < grid[i].length - 1) {
        let right = grid[i][j+1];
        let distRight = dist(v.x, v.y, right.x, right.y);
        fill(fg);
        noStroke();
        text(distRight.toFixed(2), (v.x + right.x) / 2, (v.y + right.y) / 2);
        stroke(fg);
        line(v.x, v.y, right.x, right.y);
      }
    }
  }
  pop();
}

function drawObjs() {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      let v = grid[i][j];
      
      // Call the motion method to apply movement
      v.motion();
      v.update();
      
      // Calculate width (horizontal distance to the next vector in the same row)
      let objWidth = 0;
      if (j < grid[i].length - 1) {
        let vNext = grid[i][j + 1];  // The vector to the right
        objWidth = dist(v.x, v.y, vNext.x, vNext.y);  // Horizontal distance
      }

      // Calculate height (vertical distance to the next vector in the same column)
      let objHeight = 0;
      if (i < grid.length - 1) {
        let vBelow = grid[i + 1][j];  // The vector below
        objHeight = dist(v.x, v.y, vBelow.x, vBelow.y);  // Vertical distance
      }
      
      // Ensure cellTypes is properly accessed
      if (cellTypes[i] && cellTypes[i][j] !== undefined) {
        let type = cellTypes[i][j];  // Get the type assigned to this cell

        // Draw image
        if (type == 0) {
          if (objWidth > 0 && objHeight > 0) {
            if (img == null) {
              image(rock, v.x, v.y, objWidth, objHeight);
            } else {
              image(img, v.x, v.y, objWidth, objHeight);
            }
          }
        }
        
        // Draw body text
        if (type == 1) {
          let textContent = grid[i][j].textContent; 
          displayTextBox(v, objWidth, objHeight, textContent);
        }
        
        // Draw header text
        if (type == 2) {
          push();
          displayHeader(v, objWidth, objHeight);
          pop();
        }
        
      }
    }
  }
}

// Check to see if mouse is hovering over a text box
function checkGridCellType() {
  // Check to see if the mouse is within the grid
  if (mouseX >= 0 && mouseX < cols * cellW && mouseY >= 0 && mouseY < rows * cellH) {
     
    // Determine the row and column based on mouse position
    let col = floor(mouseX / cellW);  // Column index
    let row = floor(mouseY / cellH);  // Row index
    
    // Check the type of the grid cell at (row, col)
    let cellType = cellTypes[row][col];
    
    // Update cellTypeStr based on the hovered cell's type
    if (cellType === 0) {
      cellTypeStr = "Image";
    } else if (cellType === 1) {
      cellTypeStr = "Text";
    } else if (cellType === 2) {
      cellTypeStr = "Header";
    }
  }
}

//Randomise the objects (assign types to grid cells randomly), hide and show grid guides
function toggleFunctions() {
  if (guidesB.val == true) {
    showGuides = false;
  } else if (guidesB.val == false) {
    showGuides = true;
  }
  
  if (mvmtB.val == false) {
    gridMotion = false;
  } else if (mvmtB.val == true) {
    gridMotion = true;
  } 
}

// Initiate and display the text box object
function displayTextBox(v, objWidth, objHeight, textToShow) {
  textToShow = textToShow || "";
  //console.log('objWidth:', objWidth); 
  //let effectiveWidth = objWidth > 0 ? objWidth : 50;
  let effectiveWidth = objWidth * 0.55;
  let wrappedText = wrapText(textToShow, effectiveWidth);
  push();
  
  if (objWidth < 1 || objHeight < 1) {
    return;
  } else {
  translate(objWidth * 0.25, objHeight * 0.25);
  textSize(effectiveWidth * 0.08);
  fill(clrPckrBdy.color());
  noStroke();
  if (bodyFont == null){
  textFont("Courier New");
  } else {
  textFont(bodyFont);
  }
  text(wrappedText, v.x, v.y);
  
  pop();
  fill(fg);
  }
}

// Function to wrap text based on the width of the text box
function wrapText(txt, boxWidth) {
  let words = txt.split(' ');  // Split the text into words
  let wrappedText = "";
  let line = "";

  for (let i = 0; i < words.length; i++) {
    let testLine = line + words[i] + " ";
    let testWidth = textWidth(testLine);  // Measure the width of the test line

    // If the line is too long, wrap it by adding a line break
    if (testWidth > boxWidth * 1) {
      wrappedText += line + '\n';  // Add the current line and a newline
      line = words[i] + " ";  // Start a new line with the current word
    } else {
      line = testLine;  // Continue building the current line
    }
  }

  // Add the last line to the wrapped text
  wrappedText += line;
  return wrappedText;
}

function displayHeader(v, objWidth, objHeight) {
  translate(0, height * 0.1);
  translate(v.x, v.y);
  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;
  
  // Loop through all points to calculate the bounding box
  for (let i = 0; i < points.length; i++) {
    for (let j = 0; j < points[i].length; j++) {
      let point = points[i][j];
      let x = point.x;
      let y = point.y;
      
      // Update the bounding box coordinates
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  
  // Calculate the width and height of the bounding box
  let shapeWidth = maxX - minX;
  let shapeHeight = maxY - minY;
  
  // Calculate the scaling factors for width and height
  let scaleX = objWidth / shapeWidth;
  let scaleY = objHeight / shapeHeight;
  
  // Use the smaller scaling factor to maintain aspect ratio
  let scaleFactor = min(scaleX, scaleY);
  
  // Optionally, you can offset the text so it stays centered within objWidth/objHeight
  let offsetX = (objWidth - shapeWidth * scaleFactor) / 2;
  let offsetY = (objHeight - shapeHeight * scaleFactor) / 2;
  
  translate(offsetX, offsetY);  // Center the text

  // Scale the text according to the calculated scaling factor
  scale(scaleFactor);
  
  // Now draw the text shape
  for (let i = 0; i < points.length; i++) {
    push();
    noFill();
    strokeWeight(3);
    stroke(clrPckrHd.color());
    //noStroke();
    //fill(clrPckrHd.color());
    
    beginShape();
    for (let j = 0; j < points[i].length; j++) {
      let point = points[i][j];
      vertex(point.x, point.y);  // Corrected to use the correct point
    }
    endShape(CLOSE);
    pop();
  }
}

function setMotionTarget() {
  let allVectors = [];
  
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      allVectors.push(grid[i][j]);
    }
  }  
  // Select a vector from list of vectors within grid array
  targetVector = random(allVectors);
  print(targetVector);
}

//Send grid objects to their initial positions
function resetAll() {
  // Loop through every vector in the grid and reset to their initial positions
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      grid[i][j].reset();  // Call reset method in vectorObjs class
    }
  }
}

function mousePressed() {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      grid[i][j].pressed();
    }
  }
}

function mouseReleased() {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      grid[i][j].released();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  createGrid();
}

function handleChangeEvent(event) {
  let file = event.target.files[0];
  console.log("File selected:", file);

  if (file) {
    let reader = new FileReader();
    reader.onload = function (e) {
      console.log("FileReader onload called");

      if (event.target.id === "imageUpload") {
        img = loadImage(e.target.result, () => {
          console.log("Image loaded successfully");
        }, () => {
          console.log("Failed to load image");
        });
      } else if (event.target.id === "headerFontUpload") {
        headerFont = e.target.result;
        opentype.load(headerFont, function(err, f) {
          if (err) {
            console.log("Failed to load header font", err);
          } else {
            font = f;
            fontLoaded = true;
            console.log("Header font loaded successfully");
            getTextOutlines(); // Call getTextOutlines after loading the font
          }
        });
      } else if (event.target.id === "bodyFontUpload") {
        bodyFont = loadFont(e.target.result, () => {
          console.log("Body font loaded successfully");
        }, () => {
          console.log("Failed to load body font");
        });
      }
    };
    reader.readAsDataURL(file);
  } else {
    console.log("No file selected");
  }
}
