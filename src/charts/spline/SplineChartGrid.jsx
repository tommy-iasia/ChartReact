import { Point } from "../Point";
import { SplineChartContext } from "./SplineChartContext";
import PropTypes from "prop-types";
import { useContext } from "react";

import "./SplineChartGrid.scss";

export default function SplineChartGrid(props) {
  const { xAxis, yAxis } = props;

  const { coordinate } = useContext(SplineChartContext);

  return (
    <div className="spline-chart-grid">
      {xAxis
        .filter((t) => t >= coordinate.range.minimum.x && t <= coordinate.range.maximum.x)
        .map((t, i) => {
          const top = coordinate.convert(new Point(t, coordinate.range.maximum.y));
          const bottom = coordinate.convert(new Point(t, coordinate.range.minimum.y));
          return (
            <div
              key={i}
              className="x"
              style={{ left: top.x, top: top.y, height: bottom.y - top.y }}
            />
          );
        })}

      {yAxis
        .filter((t) => t >= coordinate.range.minimum.y && t <= coordinate.range.maximum.y)
        .map((t, i) => {
          const left = coordinate.convert(new Point(coordinate.range.minimum.x, t));
          const right = coordinate.convert(new Point(coordinate.range.maximum.x, t));
          return (
            <div
              key={i}
              className="y"
              style={{ left: left.x, top: left.y, width: right.x - left.x }}
            />
          );
        })}
    </div>
  );
}

SplineChartGrid.propTypes = {
  xAxis: PropTypes.arrayOf(PropTypes.number).isRequired,
  yAxis: PropTypes.arrayOf(PropTypes.number).isRequired,
};
