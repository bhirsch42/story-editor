function getCornerClosestToCenterCoords(targetEl, containerEl, scene) {  
  let {
    x: containerX,
    y: containerY,
    width: containerWidth,
    height: containerHeight
  } = containerEl.getBoundingClientRect();

  let {
    left: targetX,
    top: targetY,
    width: targetWidth,
    height: targetHeight
  } = targetEl.getBoundingClientRect();

  let {
    x: sceneX,
    y: sceneY,
  } = scene.dragging.move;

  let relX = targetX - containerX - containerWidth / 2;
  let relY = targetY - containerY - containerHeight / 2;

  let x, y;
  
  if (relX > 0) {
    x = targetX;
  } else if (relX + targetWidth > 0) {
    x = targetX + targetWidth / 2;
  } else {
    x = targetX + targetWidth;
  }

  if (relY > 0) {
    y = targetY;
  } else if (relY + targetHeight > 0) {
    y = targetY + targetHeight / 2;
  } else {
    y = targetY + targetHeight;
  }

  let debugDot = document.getElementById('debug-dot');
  debugDot.style.left = `${x}px`;
  debugDot.style.top = `${y}px`;

  console.log({x, y, relX, relY, targetX, targetY})

  return [x, y];
}

export default getCornerClosestToCenterCoords;
