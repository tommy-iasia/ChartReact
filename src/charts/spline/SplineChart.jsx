import _ from "lodash";
import PropTypes from "prop-types";
import { Point } from "../Point";
import { Rectangle } from "../Rectangle";
import SplineChartAnimator from "./SplineChartAnimator";
import { SplineChartContext } from "./SplineChartContext";
import { SplineChartCoordinate } from "./SplineChartCoordinate";
import SplineGraph from "./SplineGraph";
import { useMemo, useState } from "react";

import "./SplineChart.scss";
import { useEqualObject } from "../../utilities/hooks";

export default function SplineChart(props) {
  const { width, height, view } = props;
  const { items, range } = props;
  const { children } = props;

  const viewObject = useEqualObject(view);

  const inputRange = useEqualObject(range);
  const rangeObject = useMemo(() => {
    return inputRange || getRange();

    function getRange() {
      const values = items.flatMap((t) => t.values);
      const xs = values.map((t) => t.x);
      const ys = values.map((t) => t.y);

      return {
        minimum: new Point(_.min(xs), _.min(ys)),
        maximum: new Point(_.max(xs), _.max(ys)),
      };
    }
  }, [inputRange, items]);

  const coordinate = useMemo(
    () => new SplineChartCoordinate(viewObject, rangeObject),
    [viewObject, rangeObject]
  );

  const chartSplines = useMemo(
    () =>
      items.map((t) => ({
        item: t,
        values: t.values.map((s) => ({
          value: s,
          point: coordinate.convert(s),
        })),
      })),
    [coordinate, items]
  );

  const graphSplines = useMemo(
    () => chartSplines.filter((t) => !t.item.disabled).map((t) => t.values.map((s) => s.point)),
    [chartSplines]
  );

  const [animatedSpline, setAnimatedSpline] = useState([]);

  return (
    <div className="spline-chart" style={{ width, height }}>
      <SplineChartAnimator inputSplines={graphSplines} setOutputSplines={setAnimatedSpline} />

      <SplineGraph view={viewObject} splines={animatedSpline} />

      <SplineChartContext.Provider value={{ coordinate, splines: chartSplines }}>
        {children}
      </SplineChartContext.Provider>
    </div>
  );
}

SplineChart.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  view: PropTypes.instanceOf(Rectangle).isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.any.isRequired,
      values: PropTypes.arrayOf(
        PropTypes.shape({
          x: PropTypes.number.isRequired,
          y: PropTypes.number.isRequired,
        })
      ),
      disabled: PropTypes.bool,
    })
  ).isRequired,
  range: PropTypes.shape({
    minimum: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    }),
    maximum: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    }),
  }),
};
