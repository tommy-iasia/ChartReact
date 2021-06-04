import { Point } from "../Point";
import { SplineChartContext } from "./SplineChartContext";
import PropTypes from "prop-types";
import { useContext } from "react";

import "./SplineChartShadow.scss";

export default function SplineChartShadow(props) {
  const { value } = props;

  const { coordinate } = useContext(SplineChartContext);
  const from = coordinate.convert(coordinate.minimum);
  const to = coordinate.convert(new Point(coordinate.maximum.x, value));

  return (
    <div
      className="spline-chart-shadow"
      style={{ left: from.x, top: to.y, width: to.x - from.x, height: from.y - to.y }}
    ></div>
  );
}

SplineChartShadow.propTypes = {
  className: PropTypes.string,
  value: PropTypes.number.isRequired,
};
