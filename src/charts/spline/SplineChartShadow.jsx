import _ from "lodash";
import { Point } from "../Point";
import { SplineChartContext } from "./SplineChartContext";
import PropTypes from "prop-types";
import { useContext } from "react";

import "./SplineChartShadow.scss";

export default function SplineChartShadow(props) {
  const { value } = props;

  const { coordinate } = useContext(SplineChartContext);

  const from = coordinate.convert(coordinate.range.minimum);
  const to = coordinate.convert(new Point(coordinate.range.maximum.x, value));

  return (
    <div
      className="spline-chart-shadow"
      style={{
        left: _.clamp(from.x, coordinate.view.left, coordinate.view.right),
        top: _.clamp(to.y, coordinate.view.top, coordinate.view.bottom),
        width: _.clamp(to.x - from.x, 0, coordinate.view.width),
        height: _.clamp(from.y - to.y, 0, coordinate.view.height),
      }}
    ></div>
  );
}

SplineChartShadow.propTypes = {
  className: PropTypes.string,
  value: PropTypes.number.isRequired,
};
