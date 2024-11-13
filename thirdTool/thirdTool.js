// Grid Structure HTML UI Components
var columns = document.getElementById("columns");
var rows = document.getElementById("rows");
var xPosSlider = document.getElementById("xPos");
var yPosSlider = document.getElementById("yPos");
var gWidth = document.getElementById("gWidth");
var gHeight = document.getElementById("gHeight");
var ranComp = document.getElementById("ranComp");
var gutter = document.getElementById("gutter");
var blendSelect = document.getElementById("blendSelect");
var motionSelect = document.getElementById("motionSelect");

// File upload HTML UI Components
var fileInput1 = document.getElementById("fileInput1");
var fileInput2 = document.getElementById("fileInput2");
var fileInput3 = document.getElementById("fileInput3");
var fileInput4 = document.getElementById("fileInput4");
var fileInput5 = document.getElementById("fileInput5");

// Colour picker
let bgColour = '#ffffff';
document.getElementById('bgColor').addEventListener('input', function(event) {
  bgColour = event.target.value;
});

// Wave Motion HTML UI Components
var waveSpeed = document.getElementById("waveSpeed");
var waveAmp = document.getElementById("waveAmp");
var minScale = document.getElementById("minScale");
var maxScale = document.getElementById("maxScale");
var startPointX = document.getElementById("startPointX");
var endPointX = document.getElementById("endPointX");
var startPointY = document.getElementById("startPointY");
var endPointY = document.getElementById("endPointY");

// Noise Motion HTML UI Components
var noiseLvl = document.getElementById("noiseLvl");
var noiseScl = document.getElementById("noiseScl");
var noiseSpd = document.getElementById("noiseSpd");
var startPointXNoise = document.getElementById("startPointXNoise");
var endPointXNoise = document.getElementById("endPointXNoise");
var startPointYNoise = document.getElementById("startPointYNoise");
var endPointYNoise = document.getElementById("endPointYNoise");

// Mouse Motion HTML UI Components
var maxScaleMouse = document.getElementById("maxScaleMouse");
var startPointXMouse = document.getElementById("startPointXMouse");
var endPointXMouse = document.getElementById("endPointXMouse");
var startPointYMouse = document.getElementById("startPointYMouse");
var endPointYMouse = document.getElementById("endPointYMouse");

//p5.js sketch global variables here
let gridWidth, gridHeight, gridArea, gridXOffset, gridYOffset, tileGrid = [];
let tilesX, tilesY, tileW, tileH, tiles = [], minTileSize = 20;
let bg, fg, alt, hl;
let motion = false, scaleFactor = [], waveSpeedParsed;
let capture, gif1;
let currentTileType = 0, count = 0;
let drawnObjs = [], drawnObjsMap = new Map();
let mousePressedFlag = false, debounceTimeout;
let guidesFlag = true;
let font, img1 = null, img2 = null, img3 = null, img4 = null, img5 = null;

function preload() {
  font = loadFont('data/Px437_fontWebKit/Px437.ttf');
  gif1 = loadImage("data/defaultImageForTools2.gif");
}

function setup() {
  var c = createCanvas(windowWidth, windowHeight);
  c.parent("canvasWrapper");  

  if (fileInput1 || fileInput2 || fileInput3 || fileInput4 || fileInput5) {
    fileInput1.addEventListener("change", handleChangeEvent);
    fileInput2.addEventListener("change", handleChangeEvent);
    fileInput3.addEventListener("change", handleChangeEvent);
    fileInput4.addEventListener("change", handleChangeEvent);
    fileInput5.addEventListener("change", handleChangeEvent);
    console.log("File upload event listener attached");
  } else {
    console.log("File upload element not found");
  }

  textFont(font);
  
  cursor(CROSS);
  
  capture = createCapture(VIDEO);
  capture.hide();
  imageMode(CENTER);

  bg = color('#333333');
  fg = color('#262626');
  alt = color('#ee5b2b');
  hl = color('#99ff99');
}

function draw() {
  background(bgColour);

  // Set grid dimensions and position
  gridWidth = width * 0.01 * (parseInt(gWidth.value)); // Keep between 0.1 and 1.0
  gridHeight = height * 0.01 * (parseInt(gHeight.value)); // Keep between 0.1 and 1.0
  gridArea = gridWidth * gridHeight;
  gridXOffset = width * 0.01 * (parseInt(xPosSlider.value)); // Keep between 0.0 and 0.1
  gridYOffset = height * 0.01 * (parseInt(yPosSlider.value)); // Keep between 0.0 and 0.1

  // Set number of columns and rows (tilesX and tilesY)
  tilesX = columns ? parseInt(columns.value, 10) : 4;
  tilesY = rows ? parseInt(rows.value, 10) : 4;
  tileW = gridWidth / tilesX;
  tileH = gridHeight / tilesY;

  // Initialize column widths and row heights and scale factors
  columnWidths = Array(tilesX).fill(gridWidth / tilesX);
  rowHeights = Array(tilesY).fill(gridHeight / tilesY);
  scaleFactors = Array(tilesX * tilesY).fill(1);

  if (motionSelect.value == "wave") {
    waveMotion(); // Update the scaling factors for each tile using a wave
  } else if (motionSelect.value == "noise") {
    noiseMotion() // Update the scaling factors for each tile using Perlin noise
  // } else if (motionSelect.value == "mouse") {
    //mouseMotion(); // Update the scaling factors for each tile using mouse
  } else if (motionSelect.value == "no motion") {
    // nothing
  }

  createGrid(); // Rebuild the grid based on the new sizes
  drawObj(); // Draw objects in each tile
  keyPressed(); // Save frames if 's' key is pressed
  if (guidesFlag) {
  gridGuides(); // Visualize the grid lines
  highlightTile(); // Highlight the tile which the mouse hovers over
  }
}

function keyPressed() {
  if (keyCode === ENTER) {
    noLoop();
  }
  if (keyCode === 32) { // SPACE key code is 32
    loop();
  }
  if (key === 's') {
    saveFrames('frame', 'png', 1, 5);
  }
}

                      //--------------------------------------------------------------\\
                     //---BELOW IS CODE DICTATING THE GRID'S STRUCTURE AND BEHAVIOUR---\\
                    //------------------------------------------------------------------\\
               
// Update the array of scaleFactors using a complex wave function
function waveMotion() {
  let minimum = parseInt(minScale.value, 10);
  let maximum = parseInt(maxScale.value, 10);
  for (let i = startPointX.value; i < endPointX.value; i++) {
    for (let j = startPointY.value; j < endPointY.value; j++) {
      let tileIndex = i + j * tilesX;
      let wave = sin((i + frameCount * waveSpeed.value) * waveAmp.value);
      let scaleFactor = map(wave, -1, 1, minimum, maximum); // Adjust scale range as needed

      scaleFactors[tileIndex] = scaleFactor;
      resizeTile(i, j, scaleFactor);
    }
  }
}

function noiseMotion(){
  for (let i = startPointXNoise.value; i < endPointXNoise.value; i++) {
    for (let j = startPointYNoise.value; j < endPointYNoise.value; j++) {
      let noizeLevel = parseInt(noiseLvl.value, 10);
      let noizeScale = parseInt(noiseScl.value) * 0.1; // 0.1 to 1.0 be sure to * by 0.1
      let noizeSpeed = parseInt(noiseSpd.value) * 0.0001;
      let tileIndex = i + j * tilesX;
      let nx = noizeScale * j * i;
      let nt = noizeScale * frameCount * noizeSpeed; //0.001 to 0.02 noiseSpeed be sure to * by 0.001
      let noize = noizeLevel * noise(nx, nt);
      let scaleFactor = map(noize, 0, 100, 0.0, 2.0 , true);

      scaleFactors[tileIndex] = scaleFactor;  // Update the scaleFactors array
      resizeTile(i, j, scaleFactor);  // Apply the scale factor to the tile
    }
  }
}

// function mouseMotion() {
//   // Check if the mouse is within the grid boundaries
//   if (mouseX < gridXOffset || mouseX > gridXOffset + gridWidth || 
//       mouseY < gridYOffset || mouseY > gridYOffset + gridHeight) {
//     return; // Exit if the mouse is outside the grid area
//   }

//   let maxDistance = dist(0, 0, gridWidth, gridHeight) / 2; // Localized distance scale

//   // Loop through each tile to calculate distance and scaleFactor if within grid
//   for (let i = startPointXMouse.value; i < endPointXMouse.value; i++) {
//     for (let j = startPointYMouse.value; j < endPointYMouse.value; j++) {
//       let tileIndex = i + j * tilesX;
//       let tile = tileGrid[i][j]; // Access tile directly from tileGrid

//       if (tile) {
//         let tileCentreX = tile.x + tile.w * 0.5;
//         let tileCentreY = tile.y + tile.h * 0.5;
//         let maxScale = parseInt(maxScaleMouse.value);
//         let minScale = parseInt(minScaleMouse.value);
//         let distance = dist(mouseX, mouseY, tileCentreX, tileCentreY);

//         // Invert mapping: closer = larger scale
//         let scaleFactor = map(distance, 0, maxDistance, 0.1, 2.0, true);

//         scaleFactors[tileIndex] = scaleFactor;
//         resizeTile(i, j, scaleFactor);
//       }
//     }
//   }
// }

function createGrid() {
  tileGrid = []; // Clear previous grid

  for (let i = 0; i < tilesX; i++) {
    let row = [];
    for (let j = 0; j < tilesY; j++) {
      let x = gridXOffset + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
      let y = gridYOffset + rowHeights.slice(0, j).reduce((a, b) => a + b, 0);
      let w = columnWidths[i];
      let h = rowHeights[j];
      row.push(new Tile(x, y, w, h, i, j));
    }
    tileGrid.push(row); // Add row to the grid
  }
}

// Resize tile based on scaling factor and normalize the grid
function resizeTile(colIndex, rowIndex, scaleFactor) {
  let newTileW = Math.max(minTileSize, (gridWidth / tilesX) * scaleFactor);
  let newTileH = Math.max(minTileSize, (gridHeight / tilesY) * scaleFactor);
  
  // Set the new width and height for this tile
  columnWidths[colIndex] = newTileW;
  rowHeights[rowIndex] = newTileH;
  
  // Normalize the grid to ensure it fills the full width and height
  normalizeWidths();
  normalizeHeights();
}

// Normalize column widths to ensure they sum up to gridWidth
function normalizeWidths() {
  let totalWidth = columnWidths.reduce((a, b) => a + b, 0);
  let scaleFactor = gridWidth / totalWidth;
  
  for (let i = 0; i < tilesX; i++) {
    columnWidths[i] *= scaleFactor;
  }
}

// Normalize row heights to ensure they sum up to gridHeight
function normalizeHeights() {
  let totalHeight = rowHeights.reduce((a, b) => a + b, 0);
  let scaleFactor = gridHeight / totalHeight;
  
  for (let j = 0; j < tilesY; j++) {
    rowHeights[j] *= scaleFactor;
  }
}

                      //---------------------------------------------\\
                     //------BELOW IS CODE VISUALISING THE GRID-------\\
                    //-------------------------------------------------\\

// Method to get a specific tile by grid coordinates (i, j)
function getTile(i, j) {
  if (i >= 0 && i < tilesX && j >= 0 && j < tilesY) {
    return tiles[i + j * tilesX];  // 1D index conversion
  }
  return null;
}

// Method to find the tile at a specific pixel position (px, py)
function getTileAt(px, py) {
  for (let i = 0; i < tilesX; i++) {
    for (let j = 0; j < tilesY; j++) {
      let tile = tileGrid[i][j];
      if (tile.contains(px, py)) {
        return tile;
      }
    }
  }
  return null;
}

function mousePressed() {
  if (!mousePressedFlag) {
    mousePressedFlag = true;

    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      count++;
      if (count > 6) {
        count = 0;
      }
      currentTileType = count;

      let clickedTile = getTileAt(mouseX, mouseY);
      if (clickedTile) {
        const tileKey = `${clickedTile.i}-${clickedTile.j}`;
        drawnObjsMap.set(tileKey, {
          i: clickedTile.i,
          j: clickedTile.j,
          type: currentTileType
        });
      }
    }, 25);
  }
}

function mouseReleased() {
  mousePressedFlag = false; // Reset the flag when the mouse is released
}

// Highlight the tile under the mouse
function highlightTile() {
  let hoveredTile = getTileAt(mouseX, mouseY);
  if (hoveredTile) {
    noFill();
    stroke(hl);
    strokeWeight(3);
    rect(hoveredTile.x, hoveredTile.y, hoveredTile.w, hoveredTile.h);

    // Display the tile indices
    fill(hl);
    noStroke();
    textSize(16);
    textAlign(CENTER, CENTER);
    let tileKey = `${hoveredTile.i}-${hoveredTile.j}`;
    let obj = drawnObjsMap.get(tileKey);
    if (obj) {
      if (obj.type === 6) {
        text(`No Input`, hoveredTile.x + hoveredTile.w / 2, hoveredTile.y + hoveredTile.h / 2);
      } else if (obj.type === 5) {
        text(`Camera Input`, hoveredTile.x + hoveredTile.w / 2, hoveredTile.y + hoveredTile.h / 2);
      } else {
        let imageNum = obj.type + 1;  
        text(`Input ${imageNum}`, hoveredTile.x + hoveredTile.w / 2, hoveredTile.y + hoveredTile.h / 2);
      }
    }
  }
}

function toggleGridGuides() {
  guidesFlag = !guidesFlag; // Toggle the flag
}

// Display grid lines
function gridGuides() {
  noFill();
  stroke('red');
  strokeWeight(1);

  for (let i = 0; i < tilesX; i++) {
    for (let j = 0; j < tilesY; j++) {
      let tile = tileGrid[i][j];
      rect(tile.x, tile.y, tile.w, tile.h);
    }
  }
}

function drawObj() {
  let padding = gutter.value;

  drawnObjsMap.forEach(obj => {
    let tile = tileGrid[obj.i][obj.j]; // Access tile directly
    if (tile) {

      if (blendSelect.value == "semi-blend") {
      push();
      blendMode(DIFFERENCE);
      }

      if (blendSelect.value == "full-blend") {
        blendMode(DIFFERENCE);
      } else if (blendSelect.value == "normal") {
        blendMode(BLEND);
      }
      let imageToDraw;

      // Select the image based on the object type, with gif1 as the default fallback
      switch (obj.type) {
        case 0:
          imageToDraw = fileInput1 instanceof p5.Image ? fileInput1 : gif1;
          break;
        case 1:
          imageToDraw = fileInput2 instanceof p5.Image ? fileInput2 : gif1;
          break;
        case 2:
          imageToDraw = fileInput3 instanceof p5.Image ? fileInput3 : gif1;
          break;
        case 3:
          imageToDraw = fileInput4 instanceof p5.Image ? fileInput4 : gif1;
          break;
        case 4:
          imageToDraw = fileInput5 instanceof p5.Image ? fileInput5 : gif1;
          break;
        case 5:
          imageToDraw = image(capture, tile.x + tile.w / 2, tile.y + tile.h / 2, tile.w * padding, tile.h * padding);
          break;  
        default:
          console.error("Unknown object type:", obj.type);
          break;
      }

      // Render the selected image, or fallback to gif1 if no image is loaded
      if (imageToDraw) {
        image(imageToDraw, tile.x + tile.w / 2, tile.y + tile.h / 2, tile.w * padding, tile.h * padding);
      } else {
        console.warn(`Image for type ${obj.type} is not loaded, using default image.`);
      }

      if (blendSelect.value == "semi-blend") {
      pop();
      }
    }
  });
}

function handleChangeEvent(event) {
  let file = event.target.files[0];
  console.log("File selected:", file);

  if (file) {
    let reader = new FileReader();
    reader.onload = function (e) {
      console.log("FileReader onload called");

      if (event.target.id === "fileInput1") {
        fileInput1 = loadImage(e.target.result, () => {
          console.log("Image 1 loaded successfully");
        }, () => {
          console.log("Failed to load image");
        });
      } else if (event.target.id === "fileInput2") {
        fileInput2 = loadImage(e.target.result, () => {
          console.log("Image 2 loaded successfully");
        }, () => {
          console.log("Failed to load image");
        });
      } else if (event.target.id === "fileInput3") {
        fileInput3 = loadImage(e.target.result, () => {
          console.log("Image 3 loaded successfully");
        }, () => {
          console.log("Failed to load image");
        });
      } else if (event.target.id === "fileInput4") {
        fileInput4 = loadImage(e.target.result, () => {
          console.log("Image 4 loaded successfully");
        }, () => {
          console.log("Failed to load image");
        });
      } else if (event.target.id === "fileInput5") {
        fileInput5 = loadImage(e.target.result, () => {
          console.log("Image 5 loaded successfully");
        }, () => {
          console.log("Failed to load image");
        });
      } 
    };
    reader.readAsDataURL(file);
  } else {
    console.log("No file selected");
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setup();
}
