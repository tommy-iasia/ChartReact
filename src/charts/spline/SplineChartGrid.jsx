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
      {xAxis.map((t, i) => {
        const top = coordinate.convert(new Point(t, coordinate.maximum.y));
        const bottom = coordinate.convert(new Point(t, coordinate.minimum.y));
        return (
          <div key={i} className="x" style={{ left: top.x, top: top.y, height: bottom.y - top.y }}>
            <div className="content">{t.key}</div>
          </div>
        );
      })}

      {yAxis.map((t, i) => {
        const left = coordinate.convert(new Point(coordinate.minimum.x, t));
        const right = coordinate.convert(new Point(coordinate.maximum.x, t));
        return (
          <div key={i} className="y" style={{ left: left.x, top: left.y, width: right.x - left.x }}>
            <div className="content">{t.key}</div>
          </div>
        );
      })}
    </div>
  );
}

SplineChartGrid.propTypes = {
  xAxis: PropTypes.arrayOf(PropTypes.number).isRequired,
  yAxis: PropTypes.arrayOf(PropTypes.number).isRequired,
};
