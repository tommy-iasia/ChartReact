import { createContext } from "react";

export const SplineChartContext = createContext({
  width: 0,
  height: 0,
  coordinate: null,
  splines: [],
  active: null,
  setActive: null,
});
