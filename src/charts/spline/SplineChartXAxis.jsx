import _ from "lodash";
import { Point } from "../Point";
import { SplineChartContext } from "./SplineChartContext";
import PropTypes from "prop-types";
import { useContext } from "react";

import "./SplineChartXAxis.scss";

export default function SplineChartXAxis(props) {
  const { items, labelWidth } = props;

  const orderedItems = _.sortBy(items, (t) => t.value);

  const { coordinate } = useContext(SplineChartContext);

  const { labels } = orderedItems.reduce(
    (s, t, i) => {
      if (t.value < coordinate.range.minimum.x) {
        return s;
      }

      if (t.value > coordinate.range.maximum.x) {
        return s;
      }

      const { x, y } = coordinate.convert(new Point(t.value, coordinate.range.minimum.y));

      if (x < s.right) {
        return s;
      }

      const label = (
        <div key={i} className="label" style={{ left: x, top: y }}>
          <div className="content">{t.key}</div>
        </div>
      );

      return {
        right: x + labelWidth,
        labels: [...s.labels, label],
      };
    },
    { right: 0, labels: [] }
  );

  return (
    <div className="spline-chart-x-axis">
      <div
        className="line"
        style={{
          left: coordinate.view.left,
          top: coordinate.view.bottom,
          width: coordinate.view.width,
        }}
      ></div>

      {labels}
    </div>
  );
}

SplineChartXAxis.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.any.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
  labelWidth: PropTypes.number.isRequired,
};
