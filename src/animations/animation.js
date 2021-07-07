import _ from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";

export function useAnimation(lap, length) {
  const [time, setTime] = useState(0);

  useEffect(() => setTime(0), [lap]);

  const requestRef = useRef();
  const previousTimeRef = useRef();

  const animate = useMemo(
    () => (time) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;

        setTime((t) => _.clamp(t + deltaTime, 0, length));
      }

      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    },
    [length]
  );

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animate]);

  return time / length;
}
