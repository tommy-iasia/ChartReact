import ChartColors from "../ChartColors";
import DonutGraphSlice from "./DonutGraphSlice";
import { Point } from "../Point";
import PropTypes from "prop-types";
import { Rectangle } from "../Rectangle";
import { useRef } from "react";

export default function DonutGraph(props) {
  const { width, height, outerRadius, innerRadius } = props;
  const { slices, setActive } = props;

  const chartRef = useRef(null);
  const mouseMoved = (e) => {
    const { clientX, clientY } = e;
    const mousePoint = new Point(clientX, clientY);

    const clientRectangle = new Rectangle(chartRef.current?.getBoundingClientRect());
    const relativePoint = mousePoint.minus(clientRectangle.center());

    const angle = relativePoint.angle();

    const slice = slices.find((t) => angle >= t.fromAngle && angle <= t.toAngle);
    setActive?.(slice);
  };

  const center = new Point(width / 2, height / 2);

  return (
    <svg
      className="donut-graph"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      ref={chartRef}
      onMouseMove={mouseMoved}
      onMouseLeave={() => setActive?.(null)}
    >
      <defs>
        <ChartColors />
      </defs>

      <g>
        {slices.map((t, i) => {
          return (
            <DonutGraphSlice
              key={i}
              className={t.active ? "active" : ""}
              center={center}
              outerRadius={outerRadius * (t.active ? 1.1 : 1)}
              innerRadius={innerRadius}
              fromAngle={t.fromAngle}
              toAngle={t.toAngle}
            />
          );
        })}
      </g>
    </svg>
  );
}

DonutGraph.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  outerRadius: PropTypes.number.isRequired,
  innerRadius: PropTypes.number.isRequired,
  slices: PropTypes.arrayOf(
    PropTypes.shape({
      fromAngle: PropTypes.number.isRequired,
      toAngle: PropTypes.number.isRequired,
    })
  ).isRequired,
  setActive: PropTypes.func,
};
