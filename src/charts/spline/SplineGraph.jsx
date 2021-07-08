import ChartColors from "../ChartColors";
import { Point } from "../Point";
import PropTypes from "prop-types";
import SplineGraphArea from "./SplineGraphArea";
import SplineGraphLine from "./SplineGraphLine";
import { Rectangle } from "../Rectangle";
import { useEqualObject } from "../../utilities/hooks";

export default function SplineGraph(props) {
  const { splines, view } = props;

  const viewObject = useEqualObject(view);

  return (
    <svg
      className="spline-graph"
      style={{ left: viewObject.left, top: viewObject.top }}
      width={viewObject.width}
      height={viewObject.height}
      viewBox={`${viewObject.left} ${viewObject.top} ${viewObject.width} ${viewObject.height}`}
    >
      <defs>
        <ChartColors />
      </defs>

      <g>
        {splines.map((t, i) => (
          <SplineGraphArea key={i} points={t} bottom={viewObject.bottom} />
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
  splines: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.instanceOf(Point))).isRequired,
  view: PropTypes.instanceOf(Rectangle).isRequired,
};
