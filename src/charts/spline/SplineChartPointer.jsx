import _ from "lodash";
import { Point } from "../Point";
import PropTypes from "prop-types";
import { Rectangle } from "../Rectangle";
import { SplineChartContext } from "./SplineChartContext";
import { useContext, useRef } from "react";

import "./SplineChartPointer.scss";

export default function SplineChartPointer(props) {
  const { active, setActive, getLabel } = props;

  const { coordinate, splines } = useContext(SplineChartContext);

  const point = active?.point || new Point(coordinate.view.left, coordinate.view.bottom);

  const areaRef = useRef(null);
  const mouseMoved = (e) => {
    const mousePoint = new Point(e.clientX, e.clientY);

    const clientRectangle = new Rectangle(areaRef.current?.getBoundingClientRect());
    const clientOrigin = new Point(clientRectangle.left, clientRectangle.top);

    const relativePoint = mousePoint.minus(clientOrigin);

    const values = splines
      .filter((t) => !t.item.disabled)
      .flatMap((t, i) =>
        t.values.map((s, j) => ({
          item: t.item,
          spline: t,
          splineIndex: i,
          point: s.point,
          value: s.value,
          valueIndex: j,
        }))
      );

    const minimum = _.minBy(values, (t) => t.point.minus(relativePoint).length());

    setActive?.(minimum);
  };

  return (
    <div
      className={`spline-chart-pointer ${active ? "active" : ""}`}
      ref={areaRef}
      onMouseMove={mouseMoved}
      onMouseLeave={() => setActive?.(null)}
    >
      <div
        className="line"
        style={{
          left: point.x,
          top: coordinate.view.top,
          height: coordinate.view.height,
        }}
      ></div>

      <div
        className={`point ${active ? `spline-${active.splineIndex + 1}` : ""}`}
        style={{
          left: point.x,
          top: point.y,
        }}
      >
        <div className={`label ${point.x > coordinate.view.center().x ? "left" : "right"}`}>
          {active && getLabel(active)}
        </div>
      </div>
    </div>
  );
}

SplineChartPointer.propTypes = {
  active: PropTypes.object,
  setActive: PropTypes.func,
  getLabel: PropTypes.func.isRequired,
};
