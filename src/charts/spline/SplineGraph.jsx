import ChartColors from "../ChartColors";
import { Point } from "../Point";
import PropTypes from "prop-types";
import SplineGraphArea from "./SplineGraphArea";
import SplineGraphLine from "./SplineGraphLine";

export default function SplineGraph(props) {
  const { width, height, splines, bottom } = props;

  return (
    <svg className="spline-graph" width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <ChartColors />
      </defs>

      <g>
        {splines.map((t, i) => (
          <SplineGraphArea key={i} points={t} bottom={bottom} />
        ))}
      </g>

      <g>
        {splines.map((t, i) => (
          <SplineGraphLine key={i} points={t} />
        ))}
      </g>
    </svg>
  );
}

SplineGraph.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  splines: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.instanceOf(Point))).isRequired,
  bottom: PropTypes.number.isRequired,
};
