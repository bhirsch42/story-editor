import { arc } from 'd3-shape';
import { assign, flatten } from 'lodash';

const PAD_ANGLE = Math.PI / 90;
const SECTION_INNER_RADIUS = 90;
const SECTION_OUTER_RADIUS = 100;
const SCENE_LINE_LENGTH = 10
const SCENE_LINE_PADDING = 5;
const SCENE_PADDING = 5;
const CORNER_RADIUS = 3;
const LINE_HEIGHT = 20;
const CHAR_WIDTH = 16;

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
  let scenesBySection = sections.map((section, i) => {
    let { startAngle, endAngle } = sectionAngles[i];
    let scenes = section.scenes;
    let sectionLength = (endAngle - startAngle - PAD_ANGLE * 2) / scenes.length;

    return scenes.map((scene, j) => {
      let baseArc = arc()
        .startAngle(startAngle + j * sectionLength + PAD_ANGLE)
        .endAngle(startAngle + (j + 1) * sectionLength + PAD_ANGLE);

      let [textX, textY] = baseArc
        .innerRadius(SECTION_OUTER_RADIUS + SCENE_LINE_LENGTH + SCENE_LINE_PADDING)
        .outerRadius(SECTION_OUTER_RADIUS + SCENE_LINE_LENGTH + SCENE_LINE_PADDING)
        .centroid();

      let [lineInnerX, lineInnerY] = baseArc
        .innerRadius(SECTION_INNER_RADIUS)
        .outerRadius(SECTION_INNER_RADIUS)
        .centroid();

      return {
        text: scene.body,
        textX,
        textY,
        lineInnerX,
        lineInnerY,
        textAnchor: textX < 0 ? 'end' : 'start',
        alignmentBaseline: textY < 0 ? 'baseline' : 'hanging',
      };
    })
  });

  spaceOutScenes(flatten(scenesBySection), width);

  flatten(scenesBySection).forEach(scene => {
    let x = scene.textX;
    let y = scene.textY

    if (y < 0) {
      y += LINE_HEIGHT * (scene.lines.length - 1);
    }

    let angle = Math.atan2(y, x);
    scene.lineOuterX = x - Math.cos(angle) * SCENE_LINE_PADDING;
    scene.lineOuterY = y - Math.sin(angle) * SCENE_LINE_PADDING;
  });

  return scenesBySection;
}

function breakSceneLines(scene, width) {
  let textWidth = width / 2 - Math.abs(scene.textX);
  let charsPerLine = Math.floor(textWidth / CHAR_WIDTH);

  let lines = scene.text.split(' ').reduce((lines, word) => {
    let lastLine = lines[lines.length - 1];

    if (lastLine.charCount + word.length <= charsPerLine) {
      lastLine.words.push(word);
      lastLine.charCount += word.length;
    } else {
      lines.push({charCount: word.length, words: [word]});
    }

    return lines;
  }, [{charCount: 0, words: []}]).map(line => {
    return line.words.join(' ');
  });

  scene.lines = lines;
}

function spaceOutScenes(scenes, width) {
  scenes.forEach(scene => breakSceneLines(scene, width));

  let leftScenes = scenes.filter(scene => scene.textX < 0);
  let rightScenes = scenes.filter(scene => scene.textX >= 0);

  [leftScenes, rightScenes].forEach(sideScenes => {

    let bottomScenes = sideScenes
      .filter(scene => scene.textY + LINE_HEIGHT > 0)
      .sort((scene1, scene2) => scene1.textY - scene2.textY);


    let prevBottom = 0;

    bottomScenes.forEach(scene => {
      scene.textY = scene.textY > prevBottom ? scene.textY : prevBottom;
      prevBottom = scene.textY + scene.lines.length * LINE_HEIGHT + SCENE_PADDING;
    });

    let topScenes = sideScenes
      .filter(scene => scene.textY + LINE_HEIGHT <= 0)
      .sort((scene1, scene2) => scene2.textY - scene1.textY);

    let prevTop = 0;

    topScenes.forEach(scene => {
      scene.textY = scene.textY < prevTop ? scene.textY : prevTop;
      scene.textY -= (scene.lines.length - 1) * LINE_HEIGHT;
      prevTop = scene.textY - LINE_HEIGHT - SCENE_PADDING;
    });
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
