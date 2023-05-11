function setGridItemDimensions(event) {
  const gridItems = document.querySelectorAll('.grid-item');
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  gridItems.forEach((item) => {
    const distanceFromMouseX = Math.abs(mouseX - item.offsetLeft - item.offsetWidth / 6);
    const distanceFromMouseY = Math.abs(mouseY - item.offsetTop - item.offsetHeight / 6);
    const distanceFromMouse = Math.max(distanceFromMouseX, distanceFromMouseY);
    const scaleFactor = 1 - (distanceFromMouse / Math.max(windowWidth, windowHeight));

    item.style.width = scaleFactor * (windowWidth / 3) + 'px';
    item.style.height = scaleFactor * (windowHeight / 3) + 'px';

    console.log(scaleFactor);
  });

  
}

function moveGridItems() {
  const gridItems = document.querySelectorAll('.grid-item');
  const time = Date.now() * 0.001; // Convert milliseconds to seconds

  gridItems.forEach((item, index) => {
    const angle = time + index * 0.4; // Vary the angle based on the item's index for different motions
    const radius = 100; // Radius of the circular path
    const x = Math.tan(angle) * radius;
    const y = Math.tan(angle) * radius;
    item.style.transform = `translate(${x}px, ${y}px)`;
  });


}

// Call moveGridItems every 30 milliseconds for smoother motion
setInterval(moveGridItems, 30);


window.addEventListener('mousemove', setGridItemDimensions);

