function angleTo(x, y, el) {
  let angle;

  if (el) {
    let { x: elX, y: elY, width, height } = el.current.getClientRects()[0];
    angle = Math.atan2(y - height / 2 - elY, x - width / 2 - elX) + Math.PI / 2;
  } else {
    angle = Math.atan2(y, x) + Math.PI / 2;
  }

  return angle < 0 ? 2 * Math.PI + angle : angle;
}

export default angleTo;
