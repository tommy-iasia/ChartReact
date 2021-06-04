import _ from "lodash";
import { ease } from "../easing";
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

  const changed =
    newSlices.length !== afterSlices.length ||
    _.zip(newSlices, afterSlices).some(
      ([s, t]) => s.item !== t.item && s.fromAngle !== t.fromAngle && s.toAngle !== t.toAngle
    );

  const [lastVersion, setLastVersion] = useState(0);
  const nextVersion = lastVersion + (changed ? 1 : 0);

  const [progress, setProgress] = useState(0);
  useInterval(() => {
    if (progress < 1) {
      setProgress(Math.min(progress + 0.02, 1));
    }
  }, 10);

  const easedProgress = ease(progress);
  const nextSlices = _.zip(beforeSlices, afterSlices).map(([s, t]) => ({
    item: t.item,
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

      setLastVersion(nextVersion);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nextVersion]
  );

  useEffect(
    () => setSlices(nextSlices),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [beforeSlices, afterSlices, progress]
  );

  return <></>;
}
