import _ from "lodash";
import { Point } from "../Point";
import PropTypes from "prop-types";
import { Rectangle } from "../Rectangle";
import { SplineChartContext } from "./SplineChartContext";
import { useContext, useRef, useState } from "react";

import "./SplineChartRange.scss";

export default function SplineChartRange(props) {
  const { start, setStart, end, setEnd } = props;

  const { coordinate } = useContext(SplineChartContext);
  const { x: startX } = coordinate.convert(new Point(start, 0));
  const { x: endX } = coordinate.convert(new Point(end, 0));

  const areaRef = useRef(null);
  const [downCursor, setDownCursor] = useState(null);

  const mouseDowned = (e) => {
    const mousePoint = new Point(e.clientX, e.clientY);

    const clientRectangle = new Rectangle(areaRef.current?.getBoundingClientRect());
    const relativePoint = mousePoint.minus(new Point(clientRectangle.left, clientRectangle.top));

    const pointValue = coordinate.revert(relativePoint);
    const clampedValue = _.clamp(pointValue.x, coordinate.minimum.x, coordinate.maximum.x);

    const startDistance = Math.abs(startX - relativePoint.x);
    const endDistance = Math.abs(endX - relativePoint.x);

    if (startDistance <= endDistance) {
      setDownCursor("start");
      setStart(clampedValue);
    } else {
      setDownCursor("end");
      setEnd(clampedValue);
    }

    e.preventDefault();
  };

  const mouseMoved = (e) => {
    if (!downCursor) {
      return;
    }

    const mousePoint = new Point(e.clientX, e.clientY);
    moveCursor(mousePoint);

    e.preventDefault();
  };
  function moveCursor(mousePoint) {
    const clientRectangle = new Rectangle(areaRef.current?.getBoundingClientRect());
    const relativePoint = mousePoint.minus(new Point(clientRectangle.left, clientRectangle.top));

    const pointValue = coordinate.revert(relativePoint);
    const clampedValue = _.clamp(pointValue.x, coordinate.minimum.x, coordinate.maximum.x);

    switch (downCursor) {
      case "start":
        if (clampedValue <= end) {
          setStart(clampedValue);
        } else {
          setStart(end);
          setEnd(clampedValue);
          setDownCursor("end");
        }
        break;

      case "end":
        if (pointValue.x >= start) {
          setEnd(clampedValue);
        } else {
          setEnd(start);
          setStart(clampedValue);
          setDownCursor("start");
        }
        break;

      default:
        console.error(`unknown downCursor ${downCursor}`);
        break;
    }
  }

  const mouseUped = () => setDownCursor(null);

  const mouseLeft = (e) => {
    if (!downCursor) {
      return;
    }

    const mousePoint = new Point(e.clientX, e.clientY);
    moveCursor(mousePoint);

    setDownCursor(null);

    e.preventDefault();
  };

  return (
    <div
      className={`spline-chart-range`}
      ref={areaRef}
      onMouseDown={mouseDowned}
      onMouseMove={mouseMoved}
      onMouseUp={mouseUped}
      onMouseLeave={mouseLeft}
    >
      <div
        className="area"
        style={{
          left: startX,
          width: endX - startX,
          top: coordinate.rectangle.top,
          height: coordinate.rectangle.height,
        }}
      ></div>
    </div>
  );
}

SplineChartRange.propTypes = {
  start: PropTypes.number,
  setStart: PropTypes.func.isRequired,
  end: PropTypes.number,
  setEnd: PropTypes.func.isRequired,
};
