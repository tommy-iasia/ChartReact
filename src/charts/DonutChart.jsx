import _ from "lodash";
import { DonutChartContext } from "./DonutChartContext";
import DonutGraph from "./DonutGraph";
import { ease } from "./easing";
import PropTypes from "prop-types";
import { useInterval } from "../utilities/effect";
import { useState } from "react";

import "./DonutChart.scss";

export default function DonutChart(props) {
  const { width, height, outerRadius, innerRadius } = props;
  const { items, activeItems, setActiveItem } = props;
  const { children } = props;

  const [progress, setProgress] = useState(0);
  useInterval(() => progress < 1 && setProgress(Math.min(progress + 0.02, 1)), 10);

  const easedProgress = ease(progress);

  const total = _.sumBy(items, (t) => t.value);
  const { slices } = items.reduce(
    (s, t) => {
      const angle = 359.9 * (t.value / total);
      return {
        angle: s.angle + angle,
        slices: [
          ...s.slices,
          {
            item: t,
            fromAngle: s.angle,
            toAngle: s.angle + angle * easedProgress,
            active: activeItems?.includes(t),
          },
        ],
      };
    },
    { angle: 0, slices: [] }
  );

  return (
    <div className="donut-chart" style={{ width, height }}>
      <DonutChartContext.Provider value={{ width, height, outerRadius, innerRadius, slices }}>
        <DonutGraph
          width={width}
          height={height}
          outerRadius={outerRadius}
          innerRadius={innerRadius}
          slices={slices}
          setActive={(t) => setActiveItem?.(t?.item)}
        />

        {children}
      </DonutChartContext.Provider>
    </div>
  );
}

DonutChart.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  outerRadius: PropTypes.number.isRequired,
  innerRadius: PropTypes.number.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
  activeItems: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number.isRequired,
    })
  ),
  setActiveItem: PropTypes.func,
};
