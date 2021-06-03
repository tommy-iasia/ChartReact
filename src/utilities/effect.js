import { useEffect } from "react";

export function useAsync(func, dependencies) {
  useEffect(
    () => {
      let cancellation = { value: false };

      func(cancellation);

      return () => (cancellation.value = true);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    dependencies
  );
}

export function useTimeout(func, length, dependencies) {
  useEffect(
    () => {
      const handle = setTimeout(() => func(), length);

      return () => clearTimeout(handle);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    dependencies
  );
}

export function useInterval(func, interval, dependencies) {
  useEffect(
    () => {
      const handle = {
        value: undefined,
        cleared: false,
      };

      const tryClear = () => {
        if (handle.cleared) {
          return;
        }

        clearTimeout(handle.value);

        handle.cleared = false;
      };

      handle.value = setInterval(() => {
        const $continue = func();
        if ($continue === false) {
          tryClear();
        }
      }, interval);

      return tryClear;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    dependencies
  );
}
