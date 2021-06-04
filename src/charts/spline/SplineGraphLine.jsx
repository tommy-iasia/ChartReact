import _ from "lodash";
import { Point } from "../Point";
import PropTypes from "prop-types";

import "./SplineGraphLine.scss";

export default function SplineGraphLine(props) {
  const { className, points } = props;

  return <path className={`spline-graph-line ${className || ""}`} d={getPath(points)} />;
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
    const direction = (after || current).minus(before || current);
    const anchor = direction.multiply(0.3);
    return {
      point: current,
      before: current.minus(anchor),
      after: current.add(anchor),
      direction: direction,
    };
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
