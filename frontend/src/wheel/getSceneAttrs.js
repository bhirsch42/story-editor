import { arc } from 'd3-shape';
import { flatten } from 'lodash';

import {
  SECTION_INNER_RADIUS,
  SECTION_OUTER_RADIUS,
  PAD_ANGLE,
  SCENE_LINE_LENGTH,
  SCENE_LINE_PADDING,
  SCENE_PADDING
} from '../Wheel';

function getSceneAttrs({ sections, sectionAngles, width }) {
  let sceneAttrs = sections.map((section, i) => {
    let { startAngle, endAngle } = sectionAngles[i];
    let scenes = section.scenes;
    let sectionLength = (endAngle - startAngle - PAD_ANGLE * 2) / scenes.length;

    return scenes.map((scene, j) => {
      let baseArc = arc()
        .startAngle(startAngle + j * sectionLength + PAD_ANGLE)
        .endAngle(startAngle + (j + 1) * sectionLength + PAD_ANGLE);

      let [x, y] = baseArc
        .innerRadius(SECTION_OUTER_RADIUS + SCENE_LINE_LENGTH + SCENE_LINE_PADDING)
        .outerRadius(SECTION_OUTER_RADIUS + SCENE_LINE_LENGTH + SCENE_LINE_PADDING)
        .centroid();

      let [lineX, lineY] = baseArc
        .innerRadius(SECTION_OUTER_RADIUS)
        .outerRadius(SECTION_OUTER_RADIUS)
        .centroid();

      return  {
        scene,
        body: scene.body,
        x, y, lineX, lineY,
        width: width / 2 - Math.abs(x) - SCENE_PADDING * 2,
        key: scene.id,
        id: scene.id,
      }
    });
  });

  return flatten(sceneAttrs);
}

export default getSceneAttrs
