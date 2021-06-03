import PropTypes from "prop-types";
import { Point } from "../Point";

import "./DonutSlice.scss";

export default function DonutSlice(props) {
  const { className, center, outerRadius, innerRadius, fromAngle, toAngle } = props;

  var outerFrom = new Point(outerRadius, 0).rotate(fromAngle).add(center);
  var outerTo = new Point(outerRadius, 0).rotate(toAngle).add(center);

  var innerFrom = new Point(innerRadius, 0).rotate(fromAngle).add(center);
  var innerTo = new Point(innerRadius, 0).rotate(toAngle).add(center);

  const totalAngle = toAngle - fromAngle;
  const largeArcFlag = totalAngle >= 180 ? 1 : 0;

  return (
    <path
      className={`donut-slice ${className || ""}`}
      d={`M ${outerFrom.x} ${outerFrom.y}
          A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerTo.x} ${outerTo.y}
          L ${innerTo.x} ${innerTo.y}
          A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerFrom.x} ${innerFrom.y}
          Z`}
    />
  );
}

DonutSlice.propTypes = {
  className: PropTypes.string,
  center: PropTypes.instanceOf(Point).isRequired,
  outerRadius: PropTypes.number.isRequired,
  innerRadius: PropTypes.number.isRequired,
  fromAngle: PropTypes.number.isRequired,
  toAngle: PropTypes.number.isRequired,
};
