function getSectionAngles(sections) {
  let endAngle = 0;

  return sections.map(({ size, id }) => {
    let startAngle = endAngle;
    endAngle = startAngle + size * Math.PI * 2;
    return { startAngle, endAngle, key: id };
  });
}

export default getSectionAngles;
