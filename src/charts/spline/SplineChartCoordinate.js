import { Point } from "../Point";

export class SplineChartCoordinate {
  constructor(view, range) {
    this.view = view;
    this.range = range;
  }

  convert(value) {
    const x = this.convertX(value.x);
    const y = this.convertY(value.y);
    return new Point(x, y);
  }
  convertX(value) {
    return (
      this.view.left +
      this.view.width *
        ((value - this.range.minimum.x) / (this.range.maximum.x - this.range.minimum.x))
    );
  }
  convertY(value) {
    return (
      this.view.top +
      this.view.height *
        (1 - (value - this.range.minimum.y) / (this.range.maximum.y - this.range.minimum.y))
    );
  }

  revert(location) {
    const x = this.revertX(location.x);
    const y = this.revertY(location.y);

    return new Point(x, y);
  }
  revertX(location) {
    return (
      ((location - this.view.left) / this.view.width) *
        (this.range.maximum.x - this.range.minimum.x) +
      this.range.minimum.x
    );
  }
  revertY(location) {
    return (
      1 -
      ((location - this.view.top) / this.view.height) *
        (this.range.maximum.y - this.range.minimum.y) +
      this.range.minimum.y
    );
  }
}
