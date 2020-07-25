function isSceneDragging(scene) {
  return scene.dragging && scene.dragging.down.x !== scene.dragging.move.x;
}

export default isSceneDragging;
