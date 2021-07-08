import _ from "lodash";
import DonutChartAnimator from "./DonutChartAnimator";
import { DonutChartContext } from "./DonutChartContext";
import DonutGraph from "./DonutGraph";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";

import "./DonutChart.scss";

export default function DonutChart(props) {
  const { width, height, outerRadius, innerRadius, opacity } = props;
  const { items, activeItems, setActiveItems } = props;
  const { children } = props;

  const rawSlices = useMemo(() => {
    const total = _.sumBy(items, (t) => t.value) || 1;
    const { slices } = items.reduce(
      (s, t) => {
        const angle = 359.9 * (t.value / total);
        return {
          angle: s.angle + angle,
          slices: [
            ...s.slices,
            {
              key: t.key || "",
              item: t,
              fromAngle: s.angle,
              toAngle: s.angle + angle,
            },
          ],
        };
      },
      { angle: 0, slices: [] }
    );

    return slices;
  }, [items]);

  const [animatedSlices, setAnimatedSlices] = useState([]);

  const activeSlices = useMemo(() => {
    const activeKeys = activeItems?.map((t) => t.key) || [];
    return animatedSlices.filter((t) => activeKeys.includes(t.key));
  }, [activeItems, animatedSlices]);

  return (
    <div className="donut-chart" style={{ width, height, opacity }}>
      <DonutChartAnimator inputSlices={rawSlices} setOutputSlices={setAnimatedSlices} />

      <DonutChartContext.Provider
        value={{
          width,
          height,
          outerRadius,
          innerRadius,
          slices: animatedSlices,
          activeSlices,
        }}
      >
        {children}
      </DonutChartContext.Provider>

      <DonutGraph
        width={width}
        height={height}
        outerRadius={outerRadius}
        innerRadius={innerRadius}
        slices={animatedSlices}
        activeSlices={activeSlices}
        setActiveSlices={(t) => {
          const activeKeys = t.map((s) => s.key);
          const activeKeyItems = items.filter((s) => activeKeys.includes(s.key));
          setActiveItems?.(activeKeyItems);
        }}
      />
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
      key: PropTypes.any.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
  activeItems: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.any.isRequired,
      value: PropTypes.number.isRequired,
    })
  ),
  setActiveItems: PropTypes.func,
  opacity: PropTypes.number,
};
