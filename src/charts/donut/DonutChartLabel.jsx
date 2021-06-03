import { Point } from "../Point";
import PropTypes from "prop-types";

import "./DonutChartLabel.scss";

export default function DonutChartLabel(props) {
  const { radius, angle, view } = props;

  const anchor = new Point(radius, 0).rotate(angle);

  return (
    <div
      className={`donut-chart-label ${angle > 90 && angle < 270 ? "left" : "right"}`}
      style={{ left: anchor.x, top: anchor.y }}
    >
      <div className="content">{view}</div>
    </div>
  );
}

DonutChartLabel.propTypes = {
  radius: PropTypes.number.isRequired,
  angle: PropTypes.number.isRequired,
  view: PropTypes.any.isRequired,
};
