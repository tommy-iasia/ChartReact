import DonutChart from "./charts/DonutChart";
import DonutChartCenter from "./charts/DonutChartCenter";
import DonutChartLabeler from "./charts/DonutChartLabeler";
import { useState } from "react";

import "./App.scss";

export default function App() {
  const [items] = useState([
    { key: "A", value: 1 },
    { key: "B", value: 2 },
    { key: "C", value: 3 },
    { key: "D", value: 5 },
  ]);

  const [activeItems, setActiveItems] = useState([]);

  return (
    <div className="app">
      <DonutChart
        width={350}
        height={350}
        outerRadius={100}
        innerRadius={55}
        items={items}
        activeItems={activeItems}
        setActiveItem={(t) => setActiveItems([t])}
      >
        <DonutChartCenter getView={(t) => t.value} />
        <DonutChartLabeler margin={30} getView={(t) => t.key} viewWidth={20} viewHeight={20} />
      </DonutChart>
    </div>
  );
}
