import _ from "lodash";
import { Point } from "../Point";
import { SplineChartContext } from "./SplineChartContext";
import PropTypes from "prop-types";
import { useContext } from "react";

import "./SplineChartYAxis.scss";

export default function SplineChartYAxis(props) {
  const { items, labelHeight } = props;

  const orderedItems = _.sortBy(items, (t) => t.value);

  const { coordinate } = useContext(SplineChartContext);

  const { labels } = orderedItems.reduce(
    (s, t, i) => {
      if (t.value < coordinate.range.minimum.y) {
        return s;
      }

      if (t.value > coordinate.range.maximum.y) {
        return s;
      }

      const { x, y } = coordinate.convert(new Point(coordinate.range.minimum.x, t.value));

      if (y + labelHeight >= s.top) {
        return s;
      }

      const label = (
        <div key={i} className="label" style={{ left: x, top: y }}>
          <div className="content">{t.key}</div>
        </div>
      );

      return {
        top: y,
        labels: [...s.labels, label],
      };
    },
    { top: Number.MAX_VALUE, labels: [] }
  );

  return (
    <div className="spline-chart-y-axis">
      <div
        className="line"
        style={{
          left: coordinate.view.left,
          top: coordinate.view.top,
          height: coordinate.view.height,
        }}
      ></div>

      {labels}
    </div>
  );
}

SplineChartYAxis.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.any.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
  labelHeight: PropTypes.number.isRequired,
};
