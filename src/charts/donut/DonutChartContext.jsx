import { createContext } from "react";

export const DonutChartContext = createContext({
  width: 0,
  height: 0,
  outerRadius: 0,
  innerRadius: 0,
  slices: [],
});
