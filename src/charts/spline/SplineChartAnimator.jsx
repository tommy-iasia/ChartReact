import _ from "lodash";
import { ease } from "../../animations/easing";
import { Point } from "../Point";
import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { useAnimation } from "../../animations/animation";

export default function SplineChartAnimator(props) {
  const { inputSplines, setOutputSplines } = props;

  const [beforeSplines, setBeforeSplines] = useState(
    inputSplines.map((t) => {
      const ys = t.map((s) => s.y);
      const mean = _.mean(ys);

      return t.map((s) => new Point(s.x, mean));
    })
  );

  const [afterSplines, setAfterSplines] = useState(inputSplines);

  const [version, setVersion] = useState(0);

  const progress = useAnimation(version, 500);
  const easedProgress = ease(progress);

  const currentSplines = useMemo(
    () =>
      _.zip(beforeSplines, afterSplines).map(([s, t]) =>
        _.zip(s, t).map(([u, v]) => u.multiply(1 - easedProgress).add(v.multiply(easedProgress)))
      ),
    [beforeSplines, afterSplines, easedProgress]
  );

  useEffect(() => setOutputSplines(currentSplines), [currentSplines, setOutputSplines]);

  useEffect(() => {
    if (inputSplines !== afterSplines) {
      const nextBeforeSplines = currentSplines
        .slice(0, inputSplines.length)
        .concat(inputSplines.slice(currentSplines.length));

      const fixedBeforeSplines = _.zip(nextBeforeSplines, inputSplines).map(([s, t]) => {
        const remainingBeforePoints = s.slice(0, t.length);
        const lastPoint = remainingBeforePoints[remainingBeforePoints.length - 1];
        return remainingBeforePoints.concat(t.slice(s.length).map((u) => lastPoint));
      });

      setBeforeSplines(fixedBeforeSplines);

      setAfterSplines(inputSplines);
      setVersion((t) => t + 1);
    }
  }, [currentSplines, afterSplines, inputSplines]);

  return <></>;
}

SplineChartAnimator.propTypes = {
  inputSplines: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.instanceOf(Point))).isRequired,
  setOutputSplines: PropTypes.func.isRequired,
};
