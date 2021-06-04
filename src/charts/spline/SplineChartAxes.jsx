import { Point } from "../Point";
import { SplineChartContext } from "./SplineChartContext";
import PropTypes from "prop-types";
import { useContext } from "react";

import "./SplineChartAxes.scss";

export default function SplineChartAxes(props) {
  const { xAxis, yAxis } = props;

  const { coordinate } = useContext(SplineChartContext);

  return (
    <div className="spline-chart-axies">
      <div
        className="area"
        style={{
          left: coordinate.rectangle.left,
          top: coordinate.rectangle.top,
          width: coordinate.rectangle.width,
          height: coordinate.rectangle.height,
        }}
      ></div>

      {xAxis.map((t, i) => {
        const { x, y } = coordinate.convert(new Point(t.value, coordinate.minimum.y));
        return (
          <div key={i} className="x" style={{ left: x, top: y }}>
            <div className="content">{t.key}</div>
          </div>
        );
      })}

      {yAxis.map((t, i) => {
        const { x, y } = coordinate.convert(new Point(coordinate.minimum.x, t.value));
        return (
          <div key={i} className="y" style={{ left: x, top: y }}>
            <div className="content">{t.key}</div>
          </div>
        );
      })}
    </div>
  );
}

SplineChartAxes.propTypes = {
  xAxis: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.any.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
  yAxis: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.any.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
};
