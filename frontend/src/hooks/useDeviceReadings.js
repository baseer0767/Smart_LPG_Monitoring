import { useEffect, useState, useRef } from "react";
import { getReadings } from "../api/readingsApi";

export function useDeviceReadings(deviceName, refreshKey) {
  const [metrics, setMetrics] = useState({ totalWeightKg: 0, percentage: 0 });
  const [chartData, setChartData] = useState([]);
  const chartRef = useRef(null);

  function updateChart(data) {
    const labels = data.slice(-20).map((d) =>
      new Date(d.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
    const weightData = data.slice(-20).map((d) => d.totalWeightKg);

    if (chartRef.current) {
      chartRef.current.data.labels = labels;
      chartRef.current.data.datasets[0].data = weightData;
      chartRef.current.update("none");
    }
  }

  useEffect(() => {
    if (!deviceName) return;

    const loadData = async () => {
      try {
        const data = await getReadings(deviceName);
        console.log("📡 API response:", data);

        if (!data || !Array.isArray(data.readings)) return;

        const sortedData = [...data.readings].sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );

        setChartData(sortedData);

        if (sortedData.length > 0) {
          const latest = sortedData[sortedData.length - 1];

          setMetrics({
            totalWeightKg: Number(latest.totalWeightKg?.toFixed(1)) || 0,
            percentage: Number(latest.percentage?.toFixed(1)) || 0,
          });

          updateChart(sortedData);
        } else {
          setMetrics({ totalWeightKg: 0, percentage: 0 });
        }
      } catch (err) {
        console.error("❌ Failed to load device readings:", err);
      }
    };

    loadData();

    // 🔁 refresh every 2s
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, [deviceName, refreshKey]); // also re-run when parent triggers refreshKey

  return { metrics, chartData, chartRef };
}
