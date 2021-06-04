export class Point {
  constructor(x, y) {
    this.x = (x?.x !== undefined ? x.x : x) || 0;
    this.y = (y !== undefined ? y : x?.y) || 0;
  }

  add(point) {
    return new Point(this.x + point.x, this.y + point.y);
  }

  minus(point) {
    return new Point(this.x - point.x, this.y - point.y);
  }

  negate() {
    return new Point(-this.x, -this.y);
  }

  multiply(value) {
    return new Point(
      this.x * ((value?.x !== undefined ? value.x : value) || 0),
      this.y * ((value.y !== undefined ? value.y : value) || 0)
    );
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  angle() {
    const radian = Math.atan2(this.y, this.x);
    const angle = (radian * 180) / Math.PI;

    return (angle + 360) % 360;
  }

  rotate(angle) {
    const fromRadian = Math.atan2(this.y, this.x);

    const angleRadian = (angle * Math.PI) / 180;
    const toRadian = fromRadian + angleRadian;

    const length = this.length();

    return new Point(length * Math.cos(toRadian), length * Math.sin(toRadian));
  }
}
