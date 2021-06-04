import _ from "lodash";
import { Point } from "../Point";

export class SplineChartCoordinate {
  constructor(rectangle, points) {
    this.rectangle = rectangle;

    const xs = points.map((t) => t.x);
    const ys = points.map((t) => t.y);

    this.maximum = new Point(_.max(xs), _.max(ys));
    this.minimum = new Point(_.min(xs), _.minBy(ys));

    this.range = this.maximum.minus(this.minimum);
  }

  convert(point) {
    return new Point(
      this.rectangle.left + this.rectangle.width * ((point.x - this.minimum.x) / this.range.x),
      this.rectangle.top + this.rectangle.height * (1 - (point.y - this.minimum.y) / this.range.y)
    );
  }
}
