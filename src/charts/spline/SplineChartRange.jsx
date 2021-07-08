import _ from "lodash";
import { Point } from "../Point";
import PropTypes from "prop-types";
import { Rectangle } from "../Rectangle";
import { SplineChartContext } from "./SplineChartContext";
import { useContext, useRef, useState } from "react";

import "./SplineChartRange.scss";

export default function SplineChartRange(props) {
  const { start, end, setRange } = props;

  const { coordinate } = useContext(SplineChartContext);

  const startX = coordinate.convertX(Math.max(start, coordinate.range.minimum.x));
  const endX = coordinate.convertX(Math.min(end, coordinate.range.maximum.x));

  const areaRef = useRef(null);
  const [downCursor, setDownCursor] = useState(null);

  const mouseDowned = (e) => {
    const mousePoint = new Point(e.clientX, e.clientY);

    const clientRectangle = new Rectangle(areaRef.current?.getBoundingClientRect());
    const relativePoint = mousePoint.minus(new Point(clientRectangle.left, clientRectangle.top));

    const pointValue = coordinate.revert(relativePoint);
    const clampedValue = _.clamp(
      pointValue.x,
      coordinate.range.minimum.x,
      coordinate.range.maximum.x
    );

    const startDistance = Math.abs(startX - relativePoint.x);
    const endDistance = Math.abs(endX - relativePoint.x);

    if (startDistance <= endDistance) {
      setDownCursor("start");
      setRange(clampedValue, end);
    } else {
      setDownCursor("end");
      setRange(start, clampedValue);
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
    const clampedValue = _.clamp(
      pointValue.x,
      coordinate.range.minimum.x,
      coordinate.range.maximum.x
    );

    switch (downCursor) {
      case "start":
        if (clampedValue <= end) {
          setRange(clampedValue, end);
        } else {
          setRange(end, clampedValue);
          setDownCursor("end");
        }
        break;

      case "end":
        if (pointValue.x >= start) {
          setRange(start, clampedValue);
        } else {
          setRange(clampedValue, start);
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
        className="before"
        style={{
          left: coordinate.view.left,
          width: _.clamp(startX - coordinate.view.left, 0, coordinate.view.width),
          top: coordinate.view.top,
          height: coordinate.view.height,
        }}
      ></div>
      <div
        className="after"
        style={{
          left: _.clamp(endX, coordinate.view.left, coordinate.view.right),
          width: coordinate.view.right - _.clamp(endX, coordinate.view.left, coordinate.view.right),
          top: coordinate.view.top,
          height: coordinate.view.height,
        }}
      ></div>
    </div>
  );
}

SplineChartRange.propTypes = {
  start: PropTypes.number,
  end: PropTypes.number,
  setRange: PropTypes.func.isRequired,
};
