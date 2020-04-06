import { arc } from 'd3-shape';
import { assign } from 'lodash';

const PAD_ANGLE = Math.PI / 90;
const SECTION_INNER_RADIUS = 90;
const SECTION_OUTER_RADIUS = 100;
const SCENE_LINE_LENGTH = 10
const SCENE_PADDING = 5;
const CORNER_RADIUS = 3;
// const LINE_HEIGHT = 12;
// const CHAR_WIDTH = 5;

function generateSectionAngles(sections) {
  let endAngle = 0;
  return sections.map(({ size }) => {
    let startAngle = endAngle;
    endAngle = startAngle + size * Math.PI * 2;
    return { startAngle, endAngle };
  });
}

function generateSectionSvgs(sectionAngles) {
  return sectionAngles.map(({ startAngle, endAngle }) => {
    let base = arc()
      .innerRadius(SECTION_INNER_RADIUS)
      .outerRadius(SECTION_OUTER_RADIUS)
      .startAngle(startAngle)
      .endAngle(endAngle)
      .padAngle(PAD_ANGLE)
      .cornerRadius(CORNER_RADIUS);

    let [labelX, labelY] = base.centroid();

    return {
      section: base(),
      label: { x: labelX, y: labelY }
    }
  });
}

function generateSceneSvgs(sections, sectionAngles, width) {
  return sections.map((section, i) => {
    let { startAngle, endAngle } = sectionAngles[i];
    let scenes = section.scenes;
    let sectionLength = (endAngle - startAngle - PAD_ANGLE * 2) / scenes.length;

    let textSvgs = scenes.map((scene, j) => {
      console.log("compute scene")
      let baseArc = arc()
        .startAngle(startAngle + j * sectionLength + PAD_ANGLE)
        .endAngle(startAngle + (j + 1) * sectionLength + PAD_ANGLE);

      let [textX, textY] = baseArc
        .innerRadius(SECTION_OUTER_RADIUS + SCENE_LINE_LENGTH + SCENE_PADDING)
        .outerRadius(SECTION_OUTER_RADIUS + SCENE_LINE_LENGTH + SCENE_PADDING)
        .centroid();

      let textWidth = width / 2 - Math.abs(textX);

      let [lineInnerX, lineInnerY] = baseArc
        .innerRadius(SECTION_INNER_RADIUS)
        .outerRadius(SECTION_OUTER_RADIUS)
        .centroid();

      return {
        textX,
        textY,
        textWidth,
        textAnchor: textX < 0 ? 'end' : 'start',
        alignmentBaseline: textY < 0 ? 'middle' : 'middle',
        lineInnerX,
        lineInnerY,
      };
    })

    let lineOuterSvgs = textSvgs.map(textSvg => {
      console.log(textSvg);
      let lineOuterX = 0;
      let lineOuterY = 0;

      return {
        lineOuterX,
        lineOuterY,
      };
    });

    return textSvgs.map((textSvg, i) => assign(textSvg, lineOuterSvgs[i]));
  })
}

function generateWheel({sections, width}) {
  let sectionAngles = generateSectionAngles(sections);
  return {
    sections: generateSectionSvgs(sectionAngles),
    scenes: generateSceneSvgs(sections, sectionAngles, width),
  }
}

export default generateWheel;
