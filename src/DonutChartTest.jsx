import DonutChart from "./charts/donut/DonutChart";
import DonutChartCenter from "./charts/donut/DonutChartCenter";
import DonutChartLabeler from "./charts/donut/DonutChartLabeler";
import { useInterval } from "./utilities/effect";
import { useState } from "react";

export default function DonutChartTest() {
  const [items, setItems] = useState([
    { key: "A", value: 1 },
    { key: "B", value: 2 },
    { key: "C", value: 3 },
    { key: "D", value: 5 },
  ]);

  useInterval(
    () => {
      if (items.length < 8) {
        const firstItem = items[0];

        setItems([
          { key: firstItem.key, value: firstItem.value * 2 },
          ...items.slice(1),
          { key: `H${items.length}`, value: 4 },
        ]);
      }
    },
    1000,
    []
  );

  const [activeItems, setActiveItems] = useState([]);

  return (
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
  );
}
