// Hyperlinks to Tools
let tool1Link = {
  x: 0,
  y: 0,
  w: 0,
  h: 0
};

let tool2Link = {
  x: 0,
  y: 0,
  w: 0,
  h: 0
};

let tool3Link = {
  x: 0,
  y: 0,
  w: 0,
  h: 0
};

// Grid properties
let tilesX, tilesY, tileW, tileH, gutter, xOffset, yOffset, gridWidth, gridHeight, gridX, gridY, showGuides = false;
let twoColumnW;

// Random variables for Header Texts
let randXLost, randYLost, randTxtHeader;
let randXIn, randYIn
let randXThe, randYThe;
let randXGrid, randYGrid;

// Random variables for Hyperlinks to Tools
let randXTool1, randYTool1;
let randXTool2, randYTool2;
let randXTool3, randYTool3;

let img1, img2, img3, myFont;
let bodyText = "Lost in the Grid is Peter White’s Capstone project within RMIT University’s Bachelor of Design (Communication Design) program. Much of the evocative power of traditional printing and publication design derives from its ability to obey and break from the grid system. Much of contemporary design relies on upon digital tools. Pixels structured in a grid system, form our windows to the digital world. The grid is often thought as a bastion of order, efficiency and objectivity. Are these the only properties of which the grid can embody? Can the digital space subvert the axioms of the grid? Three public browser-based tools have been programmed to explore these questions. Everyone is invited to get lost in the grid.";
let bodyTextW;

// Add a line break just after the first full stop
let firstFullStopIndex = bodyText.indexOf('.');
if (firstFullStopIndex !== -1) {
  bodyText = bodyText.slice(0, firstFullStopIndex + 1) + '\n' + bodyText.slice(firstFullStopIndex + 1);
}

function preload() {
  img1 = loadImage('tool1.gif');
  img2 = loadImage('tool2.gif');
  img3 = loadImage('tool3.gif');
  myFont = loadFont('Px437_fontWebKit/Px437_DOS-V_re_ANK24.ttf');
}

function setup() {
  var c = createCanvas(windowWidth, windowHeight);
  c.parent("canvasWrapper");

  gridWidth = width * 0.9;
  gridHeight = height * 0.9;
  gridXOffset = width * 0.05;
  gridYOffset = height * 0.05;

  tilesX = 8;
  tilesY = 6;
  tileW = gridWidth / tilesX;
  tileH = gridHeight / tilesY;
  gutter = 0.8;
  xOffset = tileW * (1 - gutter) / 2;
  yOffset = tileH * (1 - gutter) / 2;

  textFont(myFont);
  textAlign(LEFT, TOP);
  bodyTextW = textWidth(bodyText);

  // Random variables for Header Texts
  randXLost = int(random(5));
  randYLost = int(random(2, 4));

  randXIn = int(random(6));
  randYIn = int(random(2, 6));

  randXThe = int(random(6));
  randYThe = int(random(2, 6));

  randXGrid = int(random(5));
  randYGrid = int(random(2, 4));

  randTxtHeader = random(0.5, 0.8);

  // Random variables for Hyperlinks to Tools
  randXTool1 = int(random(1, 4));
  randYTool1 = 0;

  randXTool2 = int(random(2, 5));
  randYTool2 = 1;

  randXTool3 = int(random(4, 6));
  randYTool3 = int(random(0, 1));

}


function draw() {
  background(0);
  cursor(ARROW);

  //Draw grid
  rectMode(CORNER);
  noFill();
  stroke('red');
  for (let i = 0; i < tilesX; i++) {
    for (let j = 0; j < tilesY; j++) {
      twoColumnW = (gutter * tileW) * 2;

      // Display grid  
      if (showGuides) {
      let x = i * tileW + gridXOffset;
      let y = j * tileH + gridYOffset;
      rect(x, y, tileW, tileH);
      rect(x + xOffset, y + yOffset, tileW * gutter, tileH * gutter);
      push();
      noStroke();
      fill('red');
      text(i + ", " + j, x + xOffset, y + yOffset)
      pop();
      }

      //----------------------------HYPERLINK TEXTS----------------------------\\
      // Display Hyperlink text 'Tool 1' at specific selection of grid tiles
      push();
      if (i == randXTool1 && j == randYTool1) {
        let xPos = i * tileW + gridXOffset;
        let yPos = j * tileH + gridYOffset;
        textSize(tileW * 0.15);
        fill(244);
        noStroke();
        if (mouseX > tool1Link.x && mouseX < tool1Link.x + tool1Link.w &&
          mouseY > tool1Link.y && mouseY < tool1Link.y + tool1Link.h) {
          textStyle(BOLD);
          cursor(HAND);
        } else {
          textStyle(NORMAL);
        }
        textFont('Courier New');
        text("First Tool", xPos + xOffset, yPos + yOffset);

        // Store the position and dimensions of the text
        tool1Link.x = xPos + xOffset;
        tool1Link.y = yPos + yOffset;
        tool1Link.w = textWidth("First Tool");
        tool1Link.h = textSize();
      }

      if (i == randXTool2 && j == randYTool2) {
        let xPos = i * tileW + gridXOffset;
        let yPos = j * tileH + gridYOffset;
        textSize(tileW * 0.15);
        fill(244);
        noStroke();
        if (mouseX > tool2Link.x && mouseX < tool2Link.x + tool2Link.w &&
          mouseY > tool2Link.y && mouseY < tool2Link.y + tool2Link.h) {
          textStyle(BOLD);
          cursor(HAND);
        } else {
          textStyle(NORMAL);
        }
        textFont('Courier New');
        text("Second Tool", xPos + xOffset, yPos + yOffset);

        // Store the position and dimensions of the text
        tool2Link.x = xPos + xOffset;
        tool2Link.y = yPos + yOffset;
        tool2Link.w = textWidth("Second Tool");
        tool2Link.h = textSize();
      }

      if (i == randXTool3 && j == randYTool3) {
        let xPos = i * tileW + gridXOffset;
        let yPos = j * tileH + gridYOffset;
        textSize(tileW * 0.15);
        fill(244);
        noStroke();
        if (mouseX > tool3Link.x && mouseX < tool3Link.x + tool3Link.w &&
          mouseY > tool3Link.y && mouseY < tool3Link.y + tool3Link.h) {
          textStyle(BOLD);
          cursor(HAND);
        } else {
          textStyle(NORMAL);
        }
        textFont('Courier New');
        text("Third Tool", xPos + xOffset, yPos + yOffset);

        // Store the position and dimensions of the text
        tool3Link.x = xPos + xOffset;
        tool3Link.y = yPos + yOffset;
        tool3Link.w = textWidth("Third Tool");
        tool3Link.h = textSize();
      }
      pop();

      //----------------------------TOOL IMAGES----------------------------\\
      // Display Tool 1 image at specific selection of grid tiles
      if (i == 0 && j == 2) {
        // First tool preview image
        if (mouseX > tool1Link.x && mouseX < tool1Link.x + tool1Link.w &&
          mouseY > tool1Link.y && mouseY < tool1Link.y + tool1Link.h) {
          let xPos = i * tileW + gridXOffset;
          let yPos = j * tileH + gridYOffset;
          image(img1, xPos + xOffset, yPos + yOffset, (gutter * tileW) * 6, (gutter * tileH) * 6);
        }
      }
      // Second tool preview image
      if (i == 0 && j == 2) {
        if (mouseX > tool2Link.x && mouseX < tool2Link.x + tool2Link.w &&
          mouseY > tool2Link.y && mouseY < tool2Link.y + tool2Link.h) {
          let xPos = i * tileW + gridXOffset;
          let yPos = j * tileH + gridYOffset;
          image(img2, xPos + xOffset, yPos + yOffset, (gutter * tileW) * 4, tileH * 4);
        }
      } 
      // Third tool preview image
      if (i == 1 && j == 2) {
        if (mouseX > tool3Link.x && mouseX < tool3Link.x + tool3Link.w &&
          mouseY > tool3Link.y && mouseY < tool3Link.y + tool3Link.h) {
          let xPos = i * tileW + gridXOffset;
          let yPos = j * tileH + gridYOffset;
          image(img3, xPos + xOffset, yPos + yOffset, (gutter * tileW) * 6, (gutter * tileH) * 1);
        }
      }
      

      //----------------------------HEADER TEXTS----------------------------\\
      // Display Header text 'Lost' at specific selection of grid tiles
      push();
      blendMode(DIFFERENCE);
      if (i == randXLost && j == randYLost) {
        let xPos = i * tileW + gridXOffset;
        let yPos = j * tileH + gridYOffset;
        textSize(tileW * randTxtHeader);
        fill(244);
        noStroke();
        text("Lost", xPos + xOffset, yPos + yOffset);
      }

      // Display Header text 'in' at specific selection of grid tiles
      if (i == randXIn && j == randYIn) {
        let xPos = i * tileW + gridXOffset;
        let yPos = j * tileH + gridYOffset;
        textSize(tileW * randTxtHeader);
        fill(244);
        noStroke();
        text("in", xPos + xOffset, yPos + yOffset);
      }

      // Display Header text 'the' at specific selection of grid tiles
      if (i == randXThe && j == randYThe) {
        let xPos = i * tileW + gridXOffset;
        let yPos = j * tileH + gridYOffset;
        textSize(tileW * randTxtHeader);
        fill(244);
        noStroke();
        text("the", xPos + xOffset, yPos + yOffset);
      }

      // Display Header text 'grid' at specific selection of grid tiles
      if (i == randXGrid && j == randYGrid) {
        let xPos = i * tileW + gridXOffset;
        let yPos = j * tileH + gridYOffset;
        textSize(tileW * randTxtHeader);
        fill(244);
        noStroke();
        text("Grid", xPos + xOffset, yPos + yOffset);
      }
      pop();

    //----------------------------BODY TEXT----------------------------\\
    // Display Body text string at specific selection of grid tiles
    push();
    if (i == 6 && j == 1) {
      let xPos = i * tileW + gridXOffset;
      let yPos = j * tileH + gridYOffset;
      textSize(tileW * 0.09);
      fill(244);
      noStroke();
      textFont('Courier New');
      let adjustedBodyText = adjustTextWidth(bodyText, twoColumnW);
      text(adjustedBodyText, xPos + xOffset, yPos + yOffset);
      } 
    pop();
    }
  }

}

function adjustTextWidth(bodyText, twoColumnW) {
  let words = bodyText.split(' ');
  let adjustedText = '';
  let line = '';

  for (let i = 0; i < words.length; i++) {
    let testLine = line + words[i] + ' ';
    let testWidth = textWidth(testLine);

    if (testWidth > twoColumnW) {
      adjustedText += line + '\n';
      line = words[i] + ' ';
    } else {
      line = testLine;
    }
  }

  adjustedText += line;
  return adjustedText;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setup();
}

function keyPressed() {
  if (key == 'g') {
    showGuides = !showGuides;
  }
}

function mousePressed() {
  // Check if the mouse is clicked within one of the hyperlink text's areas
  if (mouseX > tool1Link.x && mouseX < tool1Link.x + tool1Link.w &&
    mouseY > tool1Link.y && mouseY < tool1Link.y + tool1Link.h) {
      window.location.href = 'firstTool/index.html';
  }

  if (mouseX > tool2Link.x && mouseX < tool2Link.x + tool2Link.w &&
    mouseY > tool2Link.y && mouseY < tool2Link.y + tool2Link.h) {
      window.location.href = 'secondTool/index.html';
  }

  if (mouseX > tool3Link.x && mouseX < tool3Link.x + tool3Link.w &&
    mouseY > tool3Link.y && mouseY < tool3Link.y + tool3Link.h) {
      window.location.href = 'thirdTool/index.html';
  }
}