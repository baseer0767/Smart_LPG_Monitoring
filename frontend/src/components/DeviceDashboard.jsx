// // // DeviceDashboard.jsx
// // import React, { useEffect } from "react";
// // import { useParams, useOutletContext } from "react-router-dom";
// // import { useDeviceReadings } from "../hooks/useDeviceReadings";
// // import WeightCard from "./WeightCard";
// // import PercentageCard from "./PercentageCard";
// // import ChartSection from "./ChartSection";

// // const DeviceDashboard = () => {
// //   const { deviceName } = useParams();
// //   // const { setSubtitle, refreshKey } = useOutletContext();

// //    const outletCtx = useOutletContext() || {};
// //   const { setSubtitle, refreshKey } = outletCtx;
// //   // ✅ custom hook depends on deviceName + refreshKey
// //   const { metrics, chartData } = useDeviceReadings(deviceName, refreshKey);

// //   const lastReading =
// //     chartData.length > 0 ? chartData[chartData.length - 1] : null;
// // console.log(metrics)
// //   const lastRefill = lastReading?.lastRefill
// //     ? new Date(lastReading.lastRefill).toLocaleDateString()
// //     : "Never";

// //   useEffect(() => {
// //     if (setSubtitle) {
// //       setSubtitle(`Last Refill: ${lastRefill}`);
// //     }
// //   }, [lastRefill, setSubtitle]);

// //   // 🔁 Auto-refresh locally every 5s
// //   useEffect(() => {
// //     const interval = setInterval(() => {
// //       window.dispatchEvent(new Event("force-refresh"));
// //     }, 5000);
// //     return () => clearInterval(interval);
// //   }, []);

// //   return (
// //     <div className="flex flex-col gap-4">
// //       {/* Metrics Section */}
// //       <div className="grid gap-8 grid-cols-2 px-4 h-[350px]">
// //         <WeightCard value={metrics.totalWeightKg} unit="kg" />
// //         <PercentageCard level={metrics.percentage} />
// //       </div>

// //       {/* Chart Section */}
// //       <div className="px-4">
// //         <ChartSection data={chartData.slice(-7)} />
// //       </div>
// //     </div>
// //   );
// // };

// // export default DeviceDashboard;
// import React, { useEffect, useState } from "react";
// import { useParams, useOutletContext } from "react-router-dom";
// import { useDeviceReadings } from "../hooks/useDeviceReadings";
// import WeightCard from "./WeightCard";
// import PercentageCard from "./PercentageCard";
// import ChartSection from "./ChartSection";
// import io from "socket.io-client";

// const socket = io(import.meta.env.VITE_API_URL || "http://localhost:3000", {
//   transports: ["websocket"],
// });

// const DeviceDashboard = () => {
//   const { deviceName } = useParams();
//   const outletCtx = useOutletContext() || {};
//   const { setSubtitle, refreshKey } = outletCtx;

//   const { metrics, chartData: initialData, loading } = useDeviceReadings(
//     deviceName,
//     refreshKey
//   );

//   const [chartData, setChartData] = useState([]);
//   const [latestMetrics, setLatestMetrics] = useState(null);

//   // ✅ When initial data loads, set it once
//   useEffect(() => {
//     if (!loading && initialData.length > 0) {
//       setChartData(initialData);
//       setLatestMetrics(metrics);
//     }
//   }, [initialData, metrics, loading]);

//   // ✅ Subtitle update (last refill)
//   useEffect(() => {
//     const lastReading = chartData[chartData.length - 1];
//     const lastRefill = lastReading?.lastRefill
//       ? new Date(lastReading.lastRefill).toLocaleDateString()
//       : "Never";
//     if (setSubtitle) setSubtitle(`Last Refill: ${lastRefill}`);
//   }, [chartData, setSubtitle]);

//   // ✅ Listen for live readings (no 0s)
//   useEffect(() => {
//     socket.on("newReading", (newReading) => {
//       if (newReading.deviceName === deviceName) {
//         console.log("📡 Live reading:", newReading);

//         setChartData((prev) => [...prev, newReading]);
//         setLatestMetrics({
//           totalWeightKg: newReading.totalWeightKg,
//           percentage: newReading.percentage,
//         });
//       }
//     });

//     return () => socket.off("newReading");
//   }, [deviceName]);

//   // ✅ Show loading state first
//   if (loading || !latestMetrics) {
//     return (
//       <div className="flex items-center justify-center h-[400px] text-gray-500">
//         Loading device data...
//       </div>
//     );
//   }

//   const displayChart = chartData.slice(-7);

//   return (
//     <div className="flex flex-col gap-4">
//       {/* Metrics Section */}
//       <div className="grid gap-8 grid-cols-2 px-4 h-[350px]">
//         <WeightCard value={latestMetrics.totalWeightKg} unit="kg" />
//         <PercentageCard level={latestMetrics.percentage} />
//       </div>

//       {/* Chart Section */}
//       <div className="px-4">
//         <ChartSection data={displayChart} />
//       </div>
//     </div>
//   );
// };
//takyyy jo data nhi h to wo 0 show kr rha tha isliye maine initial data ko alag state m rkha or uske load hone pr hi latest metrics set kiye agr initial data m data h to agr nhi h to 0 set krdega
// export default DeviceDashboard;
import React, { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { useDeviceReadings } from "../hooks/useDeviceReadings";
import WeightCard from "./WeightCard";
import PercentageCard from "./PercentageCard";
import ChartSection from "./ChartSection";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL || "http://localhost:3000", {
  transports: ["websocket"],
});
//for deployed on railway
// const socket = io("https://smart-lpg-tracker-production.up.railway.app", {
//   transports: ["websocket"],
// });

const DeviceDashboard = () => {
  const { deviceName } = useParams();
  const outletCtx = useOutletContext() || {};
  const { setSubtitle, refreshKey } = outletCtx;

  const { metrics, chartData: initialData, loading } = useDeviceReadings(
    deviceName,
    refreshKey
  );

  const [chartData, setChartData] = useState([]);
  const [latestMetrics, setLatestMetrics] = useState({
    totalWeightKg: 0,
    percentage: 0,
  });

  // ✅ Set initial data if available
  useEffect(() => {
    if (!loading && initialData.length > 0) {
      setChartData(initialData);
      setLatestMetrics(metrics);
    } else if (!loading && initialData.length === 0) {
      // No readings → show placeholder metrics
      setChartData([]);
      setLatestMetrics({ totalWeightKg: 0, percentage: 0 });
    }
  }, [initialData, metrics, loading]);


useEffect(() => {
  if (!chartData || chartData.length === 0) {
    if (setSubtitle) setSubtitle(`Last Refill: Never`);
    return;
  }

  let lastRefillTimestamp = null;

  for (let i = 1; i < chartData.length; i++) {
    if (chartData[i].totalWeightKg > chartData[i - 1].totalWeightKg) {
      lastRefillTimestamp = chartData[i].timestamp; // the time it increased
    }
  }

  const lastRefill = lastRefillTimestamp
    ? new Date(lastRefillTimestamp).toLocaleDateString()
    : "Never";

  if (setSubtitle) setSubtitle(`Last Refill: ${lastRefill}`);
}, [chartData, setSubtitle]);

  // ✅ Listen for live readings
  useEffect(() => {
    socket.on("newReading", (newReading) => {
      if (newReading.deviceName === deviceName) {
        console.log("📡 Live reading:", newReading);

        setChartData((prev) => [...prev, newReading]);
        setLatestMetrics({
          totalWeightKg: newReading.totalWeightKg,
          percentage: newReading.percentage,
        });
      }
    });

    return () => socket.off("newReading");
  }, [deviceName]);

  // ✅ Show loading state first
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px] text-gray-500">
        Loading device data...
      </div>
    );
  }

  const displayChart = chartData.slice(-7);

  return (
    <div className="flex flex-col gap-4">
      {/* Metrics Section */}
      <div className="grid gap-8 grid-cols-2 px-4 h-[350px]">
        <WeightCard value={latestMetrics.totalWeightKg} unit="kg" />
        <PercentageCard level={latestMetrics.percentage} />
      </div>

      {/* Chart Section */}
      <div className="px-4">
        {displayChart.length > 0 ? (
          <ChartSection data={displayChart} />
        ) : (
          <p className="text-center text-gray-500 py-16 text-lg">
            No readings available yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default DeviceDashboard;
