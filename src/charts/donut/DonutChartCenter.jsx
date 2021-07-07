import { DonutChartContext } from "./DonutChartContext";
import PropTypes from "prop-types";
import { useContext } from "react";

import "./DonutChartCenter.scss";

export default function DonutChartCenter(props) {
  const { getView } = props;

  const { width, height, innerRadius, activeSlices } = useContext(DonutChartContext);

  const size = innerRadius / Math.sqrt(2);
  const left = width / 2 - size;
  const top = height / 2 - size;

  return (
    <div className="donut-chart-center" style={{ left, right: left, top, bottom: top }}>
      {getView(activeSlices)}
    </div>
  );
}

DonutChartCenter.propTypes = {
  getView: PropTypes.func.isRequired,
};
