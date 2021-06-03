import _ from "lodash";
import { DonutChartContext } from "./DonutChartContext";
import DonutChartLabel from "./DonutChartLabel";
import { Point } from "../Point";
import PropTypes from "prop-types";
import { Rectangle } from "../Rectangle";
import { useContext } from "react";

import "./DonutChartLabeler.scss";

export default function DonutChartLabeler(props) {
  const { margin, getView, viewWidth, viewHeight } = props;

  const { outerRadius, slices } = useContext(DonutChartContext);

  const labelRadius = outerRadius + margin;
  const centerPoint = new Point(labelRadius, labelRadius);

  const slicings = slices.map((t, i) => {
    const angle = (t.fromAngle + t.toAngle) / 2;
    const labelPoint = new Point(labelRadius).rotate(angle).add(centerPoint);

    const leftSide = angle > 90 && angle < 270;
    const rectangle = new Rectangle(
      labelPoint.x + (leftSide ? -1 : 0) * (10 + viewWidth),
      labelPoint.y - viewHeight / 2,
      10 + viewWidth,
      viewHeight
    );

    return {
      ...t,
      index: i,
      weight: t.toAngle - t.fromAngle,
      angle,
      labelPoint,
      rectangle,
    };
  });

  const showings = _.sortBy(slicings, (t) => -t.weight).reduce((s, t) => {
    const collided = s.map((u) => u.rectangle).some((u) => u.collide(t.rectangle));
    return collided ? s : [...s, t];
  }, []);

  return (
    <div className="donut-chart-labeler">
      <svg
        width={labelRadius * 2}
        height={labelRadius * 2}
        viewBox={`0 0 ${labelRadius * 2} ${labelRadius * 2}`}
        style={{ left: -labelRadius, top: -labelRadius }}
      >
        {showings.map((t) => {
          const outerPoint = new Point(outerRadius).rotate(t.angle).add(centerPoint);
          return (
            <path
              key={t.index}
              d={`M ${outerPoint.x} ${outerPoint.y}
                  L ${t.labelPoint.x} ${t.labelPoint.y}`}
              stroke="#ddd"
            />
          );
        })}
      </svg>

      {showings.map((t) => (
        <DonutChartLabel
          key={t.index}
          radius={labelRadius}
          angle={t.angle}
          view={getView(t.item)}
        />
      ))}
    </div>
  );
}

DonutChartLabeler.propTypes = {
  margin: PropTypes.number.isRequired,
  getView: PropTypes.func.isRequired,
  viewWidth: PropTypes.number.isRequired,
  viewHeight: PropTypes.number.isRequired,
};
