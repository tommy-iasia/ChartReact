import _ from "lodash";
import { Point } from "../Point";

export class SplineChartCoordinate {
  constructor(rectangle, values) {
    this.rectangle = rectangle;

    this.values = values;

    const xs = values.map((t) => t.x);
    const ys = values.map((t) => t.y);
    this.maximum = new Point(_.max(xs), _.max(ys));
    this.minimum = new Point(_.min(xs), _.minBy(ys));

    this.range = this.maximum.minus(this.minimum);
  }

  convert(value) {
    return new Point(
      this.rectangle.left + this.rectangle.width * ((value.x - this.minimum.x) / this.range.x),
      this.rectangle.top + this.rectangle.height * (1 - (value.y - this.minimum.y) / this.range.y)
    );
  }

  revert(location) {
    return new Point(
      ((location.x - this.rectangle.left) / this.rectangle.width) * this.range.x + this.minimum.x,
      ((location.y - this.rectangle.top) / this.rectangle.height) * this.range.y + this.minimum.y
    );
  }
}
