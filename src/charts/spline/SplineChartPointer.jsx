import _ from "lodash";
import { Point } from "../Point";
import PropTypes from "prop-types";
import { Rectangle } from "../Rectangle";
import { SplineChartContext } from "./SplineChartContext";
import { useContext, useRef } from "react";

import "./SplineChartPointer.scss";

export default function SplineChartPointer(props) {
  const { getLabel } = props;

  const { coordinate, splines, active, setActive } = useContext(SplineChartContext);

  const point = active?.point || new Point(coordinate.rectangle.left, coordinate.rectangle.bottom);

  const areaRef = useRef(null);
  const mouseMoved = (e) => {
    const mousePoint = new Point(e.clientX, e.clientY);

    const clientRectangle = new Rectangle(areaRef.current?.getBoundingClientRect());
    const relativePoint = mousePoint.minus(new Point(clientRectangle.left, clientRectangle.top));

    if (!coordinate.rectangle.contains(relativePoint)) {
      setActive?.(null);
      return;
    }

    const values = splines.flatMap((t, i) =>
      t.values.map((s) => ({ ...s, spline: t, splineIndex: i }))
    );
    const minimum = _.minBy(values, (t) => t.point.minus(relativePoint).length());

    setActive(minimum);
  };

  return (
    <div
      className={`spline-chart-pointer ${active ? "active" : ""}`}
      ref={areaRef}
      onMouseMove={mouseMoved}
      onMouseLeave={() => setActive(null)}
    >
      <div
        className="line"
        style={{
          left: point.x,
          top: coordinate.rectangle.top,
          height: coordinate.rectangle.height,
        }}
      ></div>

      <div
        className={`point ${active ? `spline-${active.splineIndex + 1}` : ""}`}
        style={{
          left: point.x,
          top: point.y,
        }}
      >
        <div className={`label ${point.x > coordinate.rectangle.center().x ? "left" : "right"}`}>
          {active && getLabel(active.spline.item, active.value)}
        </div>
      </div>
    </div>
  );
}

SplineChartPointer.propTypes = {
  getLabel: PropTypes.func.isRequired,
};
