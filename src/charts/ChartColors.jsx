import _ from "lodash";

import "./ChartColors.scss";

export default function ChartColors() {
  return _.range(10).map((i) => (
    <linearGradient key={i} id={`chart-color-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" />
      <stop offset="100%" />
    </linearGradient>
  ));
}
