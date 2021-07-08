import _ from "lodash";
import { Point } from "../Point";
import PropTypes from "prop-types";

import "./SplineGraphLine.scss";

export default function SplineGraphLine(props) {
  const { points } = props;

  if (points.length <= 2) {
    return <path />;
  }

  return <path className="spline-graph-line" d={getPath(points)} />;
}

SplineGraphLine.propTypes = {
  className: PropTypes.string,
  points: PropTypes.arrayOf(PropTypes.instanceOf(Point)).isRequired,
};

export function getPath(points) {
  const controls = getControls(points);

  const parts = zipBeforeAfter(controls).map(({ before, current }) => {
    if (before === null) {
      return `M ${current.point.x} ${current.point.y}`;
    } else {
      return `C ${before.after.x} ${before.after.y} ${current.before.x} ${current.before.y} ${current.point.x} ${current.point.y}`;
    }
  });

  return parts.join(" ");
}

function getControls(points) {
  return zipBeforeAfter(points).map(({ before, current, after }) => {
    const forward =
      (current.y > before?.y && after?.y > current.y) ||
      (current.y < before?.y && after?.y < current.y);

    if (forward) {
      const direction = (after || current).minus(before || current);
      const anchor = direction.multiply(0.1);
      return {
        point: current,
        before: current.minus(anchor),
        after: current.add(anchor),
        direction: direction,
      };
    } else {
      const beforeX = before?.x || current.x;
      const afterX = after?.x || current.x;
      return {
        point: current,
        before: current.minus(new Point((current.x - beforeX) * 0.5, 0)),
        after: current.add(new Point((afterX - current.x) * 0.5, 0)),
        direction: new Point(afterX - beforeX, 0),
      };
    }
  });
}

function zipBeforeAfter(items) {
  const befores = [null, ...items.slice(0, items.length - 1)];
  const afters = [...items.slice(1), null];
  return _.zip(befores, items, afters).map(([before, current, after]) => ({
    before,
    current,
    after,
  }));
}
