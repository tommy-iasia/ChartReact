import _ from "lodash";
import { ease } from "../easing";
import PropTypes from "prop-types";
import { useInterval } from "../../utilities/effect";
import { useEffect, useState } from "react";

export default function DonutChartAnimator(props) {
  const { items, setSlices } = props;

  const total = _.sumBy(items, (t) => t.value);
  const { slices: newSlices } = items.reduce(
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

  const initialSlices = newSlices.map((t) => ({ ...t, toAngle: t.fromAngle }));
  const [beforeSlices, setBeforeSlices] = useState(initialSlices);

  const [afterSlices, setAfterSlices] = useState(newSlices);

  const getVersionText = (slices) => {
    const texts = slices.map((t) => `${t.key}: ${t.fromAngle} - ${t.toAngle}`);
    return texts.join(", ");
  };

  const newSlicesText = getVersionText(newSlices);

  const [progress, setProgress] = useState(0);
  useInterval(() => {
    if (progress < 1) {
      setProgress(Math.min(progress + 0.02, 1));
    }
  }, 10);

  const easedProgress = ease(progress);
  const nextSlices = _.zip(beforeSlices, afterSlices).map(([s, t]) => ({
    ...t,
    fromAngle: (t.fromAngle - s.fromAngle) * easedProgress + s.fromAngle,
    toAngle: (t.toAngle - s.toAngle) * easedProgress + s.toAngle,
  }));

  useEffect(
    () => {
      if (nextSlices.length >= newSlices.length) {
        setBeforeSlices(nextSlices.slice(0, newSlices.length));
      } else {
        const emptySlices = newSlices
          .slice(nextSlices.length)
          .map((t) => ({ ...t, fromAngle: 359.9, toAngle: 359.9 }));

        setBeforeSlices(nextSlices.concat(emptySlices));
      }

      setAfterSlices(newSlices);

      setProgress(0);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [newSlicesText]
  );

  useEffect(
    () => setSlices(nextSlices),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [beforeSlices, afterSlices, progress, setSlices]
  );

  return <></>;
}

DonutChartAnimator.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
  setSlices: PropTypes.func.isRequired,
};
