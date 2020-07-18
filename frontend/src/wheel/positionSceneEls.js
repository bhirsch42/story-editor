import {
  SCENE_PADDING
} from '../Wheel';

function positionSceneEls(sceneEls) {
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

  sceneEls.forEach(sceneEl => {
    let x = Number(sceneEl.dataset.x);
    let y = Number(sceneEl.dataset.y);
    let { width, height } = sceneEl.getBoundingClientRect();
    let semiY = y > 0 ? 'bottom' : 'top';
    let semiX = x > 0 ? 'right' : 'left';

    sceneBuckets[semiY][semiX].push({
      el: sceneEl,
      x, y, width, height
    });
  });

  let prevBound;

  let applyTransform = (el, x, y) => {
    el.style.transform = `translateX(${x}px) translateY(${y}px)`;
    el.dataset['translateX'] = x;
    el.dataset['translateY'] = y;
  }

  prevBound = 0;
  sceneBuckets.top.right.reverse().forEach(scene => {
    let x = scene.x
    let y = Math.min(scene.y - scene.height, prevBound - scene.height - SCENE_PADDING);
    applyTransform(scene.el, x, y);
    scene.el.style['text-align'] = 'left';
    prevBound = y;
  });

  prevBound = 0;
  sceneBuckets.top.left.forEach(scene => {
    let x = scene.x - scene.width
    let y = Math.min(scene.y - scene.height, prevBound - scene.height - SCENE_PADDING);
    applyTransform(scene.el, x, y);
    scene.el.style['text-align'] = 'right';
    prevBound = y;
  });

  prevBound = 0;
  sceneBuckets.bottom.right.forEach(scene => {
    let x = scene.x;
    let y = Math.max(scene.y, prevBound);
    applyTransform(scene.el, x, y);
    scene.el.style['text-align'] = 'left';
    prevBound = y + scene.height + SCENE_PADDING;
  });

  prevBound = 0;
  sceneBuckets.bottom.left.reverse().forEach(scene => {
    let x = scene.x - scene.width
    let y = Math.max(scene.y, prevBound);
    applyTransform(scene.el, x, y);
    scene.el.style['text-align'] = 'right';
    prevBound = y + scene.height + SCENE_PADDING;
  });
}

export default positionSceneEls;
