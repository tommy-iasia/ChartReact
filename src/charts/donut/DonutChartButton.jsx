import { DonutChartContext } from "./DonutChartContext";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useContext } from "react";

import "./DonutChartButton.scss";

export default function DonutChartButton(props) {
  const { buttonLink, buttonText, requested } = props;

  const { width, height, innerRadius } = useContext(DonutChartContext);

  const size = innerRadius / Math.sqrt(2);
  const left = width / 2 - size;
  const top = height / 2 - size;

  return (
    <div className={`donut-chart-button`} style={{ left, right: left, top, bottom: top }}>
      <Link
        className={`donut-chart-button-text ${requested ? "active" : ""}`}
        to={buttonLink}
        style={{ width: width * 1.5 }}
      >
        {buttonText}
      </Link>
    </div>
  );
}

DonutChartButton.propTypes = {
  buttonLink: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  requested: PropTypes.bool.isRequired,
};
