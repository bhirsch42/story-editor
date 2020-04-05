import { arc } from 'd3-shape';

const PAD_ANGLE = Math.PI / 30;
const SECTION_INNER_RADIUS = 90;
const SECTION_OUTER_RADIUS = 100;
const SCENE_PADDING = 10;
const CORNER_RADIUS = 3;

function sectionAngles(index, sectionCount) {
  let startAngle = (index / sectionCount) * (Math.PI * 2)
  let endAngle = ((index + 1) / sectionCount) * (Math.PI * 2);
  // let angleOffset = (endAngle - startAngle) / 2;
  let angleOffset = 0;

  return {
    startAngle: startAngle - angleOffset,
    endAngle: endAngle - angleOffset,
  }
}

function svgForSection(index, sectionCount) {
  let { startAngle, endAngle } = sectionAngles(index, sectionCount);

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
}

function sectionSvgs(sections) {
  return sections.map((_section, i) => svgForSection(i, sections.length));
}

function sceneSvgs(sections) {
  return sections.map((section, i) => {
    let { startAngle, endAngle } = sectionAngles(i, sections.length);
    let scenes = section.scenes;
    let sectionLength = (endAngle - startAngle - PAD_ANGLE * 2) / scenes.length;

    return scenes.map((scene, j) => {

      let base = arc()
        .innerRadius(SECTION_OUTER_RADIUS + SCENE_PADDING)
        .outerRadius(SECTION_OUTER_RADIUS + SCENE_PADDING)
        .startAngle(startAngle + j * sectionLength + PAD_ANGLE)
        .endAngle(startAngle + (j + 1) * sectionLength + PAD_ANGLE);

      let [x, y] = base.centroid();

      return {x, y};
    })
  })
}

function generateSectionSvgs(sections) {
  return {
    sections: sectionSvgs(sections),
    scenes: sceneSvgs(sections),
  }
}

export default generateSectionSvgs;
