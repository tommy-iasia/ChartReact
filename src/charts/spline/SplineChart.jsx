import { Point } from "../Point";
import PropTypes from "prop-types";
import { Rectangle } from "../Rectangle";
import { SplineChartContext } from "./SplineChartContext";
import { SplineChartCoordinate } from "./SplineChartCoordinate";
import SplineGraph from "./SplineGraph";
import { useState } from "react";

import "./SplineChart.scss";

export default function SplineChart(props) {
  const { width, height, rectangle, items, children } = props;

  const points = items.flatMap((t) => t.values);
  const coordinate = new SplineChartCoordinate(rectangle, points);

  const splines = items.map((t) => ({
    item: t,
    values: t.values.map((s) => ({
      value: s,
      point: coordinate.convert(s),
    })),
  }));

  const [active, setActive] = useState(null);

  return (
    <div className="spline-chart" style={{ width, height }}>
      <SplineChartContext.Provider
        value={{ width, height, coordinate, splines, active, setActive }}
      >
        <SplineGraph
          width={width}
          height={height}
          splines={splines.filter((t) => !t.item.disabled).map((t) => t.values.map((s) => s.point))}
          bottom={rectangle.bottom}
        />

        {children}
      </SplineChartContext.Provider>
    </div>
  );
}

SplineChart.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  rectangle: PropTypes.instanceOf(Rectangle).isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      values: PropTypes.arrayOf(PropTypes.instanceOf(Point)),
      disabled: PropTypes.bool,
    })
  ).isRequired,
};
