import _ from "lodash";
import { ease } from "../../animations/easing";
import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { useAnimation } from "../../animations/animation";

export default function DonutChartAnimator(props) {
  const { inputSlices, setOutputSlices } = props;

  const [beforeSlices, setBeforeSlices] = useState(
    inputSlices.map((t) => ({ ...t, toAngle: t.fromAngle }))
  );

  const [afterSlices, setAfterSlices] = useState(inputSlices);

  const [version, setVersion] = useState(0);

  const progress = useAnimation(version, 2000);
  const easedProgress = ease(progress);

  const currentSlices = useMemo(
    () =>
      _.zip(beforeSlices, afterSlices).map(([s, t]) => ({
        ...t,
        fromAngle: (t.fromAngle - s.fromAngle) * easedProgress + s.fromAngle,
        toAngle: (t.toAngle - s.toAngle) * easedProgress + s.toAngle,
      })),
    [beforeSlices, afterSlices, easedProgress]
  );

  useEffect(() => setOutputSlices(currentSlices), [currentSlices, setOutputSlices]);

  useEffect(() => {
    if (inputSlices !== afterSlices) {
      if (inputSlices.length === currentSlices.length) {
        setBeforeSlices(currentSlices);
      } else if (inputSlices.length > currentSlices.length) {
        const nextBeforeSlices = _.zip(inputSlices, currentSlices).map(
          ([s, t]) => t || { ...s, fromAngle: 359.9, toAngle: 359.9 }
        );
        setBeforeSlices(nextBeforeSlices);
      } else {
        const nextBeforeSlices = currentSlices.slice(0, inputSlices.length);
        setBeforeSlices(nextBeforeSlices);
      }

      setAfterSlices(inputSlices);
      setVersion((t) => t + 1);
    }
  }, [currentSlices, afterSlices, inputSlices]);

  return <></>;
}

DonutChartAnimator.propTypes = {
  inputSlices: PropTypes.arrayOf(
    PropTypes.shape({
      fromAngle: PropTypes.number.isRequired,
      toAngle: PropTypes.number.isRequired,
    })
  ).isRequired,
  setOutputSlices: PropTypes.func.isRequired,
};
