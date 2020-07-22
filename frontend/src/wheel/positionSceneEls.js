import {
  SCENE_PADDING
} from '../Wheel';

function positionSceneEls(scenePositioningData) {
  scenePositioningData = scenePositioningData.map(({ ref, scene }) => ({
    scene,
    sceneEl: ref.current,
  }));

  let sceneBuckets = {
    top: {
      right: [],
      left: [],
    },
    bottom: {
      right: [],
      left: [],
    },
  }

  scenePositioningData.forEach(({ scene, sceneEl }) => {
    let x = Number(sceneEl.dataset.x);
    let y = Number(sceneEl.dataset.y);
    let { width, height } = sceneEl.getBoundingClientRect();
    let semiY = y > 0 ? 'bottom' : 'top';
    let semiX = x > 0 ? 'right' : 'left';

    sceneBuckets[semiY][semiX].push({
      scene,
      el: sceneEl,
      x, y, width, height
    });
  });

  let prevBound;

  let applyTransform = (scene, el, x, y) => {
    if (scene.dragging) {
      let { origin, down, move } = scene.dragging;
      x = origin.x - down.x + move.x
      y = origin.y - down.y + move.y
    }
    el.style.transform = `translateX(${x}px) translateY(${y}px)`;
    el.dataset['translateX'] = x;
    el.dataset['translateY'] = y;
  }

  prevBound = 0;
  sceneBuckets.top.right.reverse().forEach(sceneData => {
    let x = sceneData.x
    let y = Math.min(sceneData.y - sceneData.height, prevBound - sceneData.height - SCENE_PADDING);
    applyTransform(sceneData.scene, sceneData.el, x, y);
    sceneData.el.style['text-align'] = 'left';
    prevBound = y;
  });

  prevBound = 0;
  sceneBuckets.top.left.forEach(sceneData => {
    let x = sceneData.x - sceneData.width
    let y = Math.min(sceneData.y - sceneData.height, prevBound - sceneData.height - SCENE_PADDING);
    applyTransform(sceneData.scene, sceneData.el, x, y);
    sceneData.el.style['text-align'] = 'right';
    prevBound = y;
  });

  prevBound = 0;
  sceneBuckets.bottom.right.forEach(sceneData => {
    let x = sceneData.x;
    let y = Math.max(sceneData.y, prevBound);
    applyTransform(sceneData.scene, sceneData.el, x, y);
    sceneData.el.style['text-align'] = 'left';
    prevBound = y + sceneData.height + SCENE_PADDING;
  });

  prevBound = 0;
  sceneBuckets.bottom.left.reverse().forEach(sceneData => {
    let x = sceneData.x - sceneData.width
    let y = Math.max(sceneData.y, prevBound);
    applyTransform(sceneData.scene, sceneData.el, x, y);
    sceneData.el.style['text-align'] = 'right';
    prevBound = y + sceneData.height + SCENE_PADDING;
  });
}

export default positionSceneEls;
