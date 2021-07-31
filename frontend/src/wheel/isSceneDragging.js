function isSceneDragging(scene) {
  return scene.dragging && 
    (scene.dragging.move.x !== scene.dragging.down.x ||
      scene.dragging.move.y !== scene.dragging.down.y);
}

export default isSceneDragging;
