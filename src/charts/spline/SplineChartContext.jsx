import { createContext } from "react";

export const SplineChartContext = createContext({
  coordinate: null,
  splines: [],
  active: null,
  setActive: null,
});
