import DonutChartAnimator from "./DonutChartAnimator";
import { DonutChartContext } from "./DonutChartContext";
import DonutGraph from "./DonutGraph";
import PropTypes from "prop-types";
import { useState } from "react";

import "./DonutChart.scss";

export default function DonutChart(props) {
  const { width, height, outerRadius, innerRadius } = props;
  const { items, activeItems, setActiveItem } = props;
  const { children } = props;

  const [slices, setSlices] = useState([]);
  const activedSlices = slices.map((t) => ({
    ...t,
    active: activeItems?.includes(t.item),
  }));

  return (
    <div className="donut-chart" style={{ width, height }}>
      <DonutChartAnimator items={items} setSlices={setSlices} />

      <DonutChartContext.Provider
        value={{ width, height, outerRadius, innerRadius, slices: activedSlices }}
      >
        <DonutGraph
          width={width}
          height={height}
          outerRadius={outerRadius}
          innerRadius={innerRadius}
          slices={activedSlices}
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
