"use client";
import "chartjs-adapter-date-fns";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineController,
  LineElement,
  BarController,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { useMemo, useState } from "react";
import {
  startOfDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  eachMonthOfInterval,
  startOfYear,
  endOfYear,
  format,
  subDays,
} from "date-fns";

ChartJS.register(
  LineController,
  BarController,
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Filler
);


export default function ChartSection({ data = [] }) {
//  const fakeData = [
//   // Daily data (already there)
//   { deviceName: "newdevice", consumptionKg: 1, timestamp: "2025-10-01T07:00:00Z" },
//   { deviceName: "newdevice", consumptionKg: 0.8, timestamp: "2025-10-02T07:00:00Z" },
//   { deviceName: "newdevice", consumptionKg: 2.3, timestamp: "2025-10-04T07:00:00Z" },
//   { deviceName: "newdevice", consumptionKg: 0.5, timestamp: "2025-10-07T07:00:00Z" },
//   { deviceName: "newdevice", consumptionKg: 3.1, timestamp: "2025-10-09T07:00:00Z" },

//   // Hourly data for 2025-10-01
//   { deviceName: "newdevice", consumptionKg: 0.1, timestamp: "2025-10-01T01:00:00Z" },
//   { deviceName: "newdevice", consumptionKg: 0.2, timestamp: "2025-10-01T03:00:00Z" },
//   { deviceName: "newdevice", consumptionKg: 0.15, timestamp: "2025-10-01T05:00:00Z" },
//   { deviceName: "newdevice", consumptionKg: 0.4, timestamp: "2025-10-01T08:00:00Z" },
//   { deviceName: "newdevice", consumptionKg: 0.3, timestamp: "2025-10-01T12:00:00Z" },
//   { deviceName: "newdevice", consumptionKg: 0.25, timestamp: "2025-10-01T16:00:00Z" },
//   { deviceName: "newdevice", consumptionKg: 0.2, timestamp: "2025-10-01T20:00:00Z" },
//   { deviceName: "newdevice", consumptionKg: 0.1, timestamp: "2025-10-01T23:00:00Z" },
// ];

//   const data = fakeData;

  const [view, setView] = useState("daily");
  const [currentDate, setCurrentDate] = useState(new Date());

  // Move to next / previous period
  const handlePrev = () => {
    setCurrentDate((prev) =>
      view === "daily"
        ? subDays(startOfMonth(prev), 1)
        : view === "monthly"
        ? subDays(startOfYear(prev), 1)
        : subDays(startOfDay(prev), 1)
    );
  };

  const handleNext = () => {
    setCurrentDate((prev) =>
      view === "daily"
        ? subDays(endOfMonth(prev), -1)
        : view === "monthly"
        ? subDays(endOfYear(prev), -1)
        : subDays(startOfDay(prev), -1)
    );
  };

  // Group readings
  const groupData = (interval) => {
    const grouped = {};
    data.forEach((d) => {
      if (!d.timestamp || isNaN(+d.consumptionKg)) return;
      const date = new Date(d.timestamp);
      let key;
      if (interval === "hour") key = format(date, "yyyy-MM-dd HH:00");
      else if (interval === "day") key = format(startOfDay(date), "yyyy-MM-dd");
      else key = format(startOfMonth(date), "yyyy-MM");
      grouped[key] = (grouped[key] || 0) + +d.consumptionKg;
    });
    return grouped;
  };

  // Compute chart data
  const chartData = useMemo(() => {
    if (view === "hourly") {
      const grouped = groupData("hour");
      const start = startOfDay(currentDate);
      const hours = Array.from({ length: 24 }, (_, i) => i); // 0–23

      return {
        datasets: [
          {
            label: "Hourly Consumption (g)",
            data: hours.map((h) => {
              const dateHour = new Date(start);
              dateHour.setHours(h, 0, 0, 0);
              const key = format(dateHour, "yyyy-MM-dd HH:00");
              return { x: dateHour, y: (grouped[key] || 0) * 1000 }; // kg → g
            }),
            borderColor: "#8e0b0b",
            backgroundColor: "rgba(142, 11, 11, 0.15)",
            pointBorderColor: "#8e0b0b",
            pointBackgroundColor: "#fff",
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 4,
            fill: true,
            type: "line",
            yAxisID: "yGram",
          },
        ],
      };
    } else if (view === "daily") {
      const grouped = groupData("day");
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      const days = eachDayOfInterval({ start, end });

      return {
        datasets: [
          {
            label: "Daily Consumption (kg)",
            data: days.map((day) => {
              const key = format(startOfDay(day), "yyyy-MM-dd");
              return { x: day, y: grouped[key] || 0 };
            }),
            borderColor: "#ff4d4f",
            backgroundColor: "#ff4d4f",
            pointBorderColor: "#1a1a1a",
            pointBackgroundColor: "#fff",
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 4,
            fill: true,
            type: "bar",
            yAxisID: "yKg",
          },
        ],
      };
    } else {
      const grouped = groupData("month");
      const months = eachMonthOfInterval({ start: startOfYear(currentDate), end: endOfYear(currentDate) });

      return {
        datasets: [
          {
            label: "Monthly Consumption (kg)",
            data: months.map((m) => {
              const key = format(startOfMonth(m), "yyyy-MM");
              return { x: m, y: grouped[key] || 0 };
            }),
            backgroundColor: "rgba(142, 11, 11, 0.6)",
            borderColor: "#8e0b0b",
            borderWidth: 1,
            type: "bar",
            yAxisID: "yKg",
          },
        ],
      };
    }
  }, [data, view]);

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "#000" } },
      tooltip: { backgroundColor: "#111", titleColor: "#fff", bodyColor: "#fff" },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "",
          color: "#000",
          font: { size: 20, weight: "bold" },
        },
        type: "time",
        time: {
          unit: view === "hourly" ? "hour" : view === "daily" ? "day" : "month",
          tooltipFormat: view === "hourly" ? "HH:00, MMM d" : view === "daily" ? "yyyy-MM-dd" : "yyyy-MM",
        },
        ticks: { color: "#1a1a1a", font: { size: 10 } },
        grid: { color: "rgba(0,0,0,0.05)" },
      },
      yGram: {
        display: view === "hourly",
        type: "linear",
        min: 0,
        ticks: { callback: (val) => val + " g", color: "#000" },
        grid: { color: "rgba(255,105,180,0.3)" },
      },
      yKg: {
        display: view !== "hourly",
        type: "linear",
        min: 0,
        ticks: { callback: (val) => val + " kg", color: "#000" },
        grid: { color: "rgba(255,105,180,0.3)" },
      },
    },
  };

  return (
    <section className="w-full h-120 p-6 rounded-2xl border border-black/20 bg-[#E7E7E7] shadow-lg">
      {/* Toggle buttons */}
      <div className="flex flex-col items-center gap-2 mb-4">
        <div className="flex gap-2">
          <button onClick={() => setView("hourly")} className={`px-4 py-1 rounded-lg ${view === "hourly" ? "bg-red-600 text-white" : "bg-gray-300"}`}>Hourly</button>
          <button onClick={() => setView("daily")} className={`px-4 py-1 rounded-lg ${view === "daily" ? "bg-red-600 text-white" : "bg-gray-300"}`}>Daily</button>
          <button onClick={() => setView("monthly")} className={`px-4 py-1 rounded-lg ${view === "monthly" ? "bg-red-600 text-white" : "bg-gray-300"}`}>Monthly</button>
        </div>

        {/* Prev / Next buttons */}
        <div className="flex items-center gap-3 mt-2 text-2xl">
          <button onClick={handlePrev} className="px-4 py-0.5 rounded-md text-black bg-gray-400 hover:bg-gray-300">←</button>
          <span className="font-semibold text-sm">
            {view === "hourly" ? format(currentDate, "MMM dd, yyyy") : view === "daily" ? format(currentDate, "MMMM yyyy") : format(currentDate, "yyyy")}
          </span>
          <button onClick={handleNext} className="px-4 py-0.5 rounded-md text-black bg-gray-400 hover:bg-gray-300">→</button>
        </div>
      </div>

      <div className="h-96">
        {chartData.datasets.some((ds) => ds.data.length > 0) ? (
          <Bar data={chartData} options={options} />
        ) : (
          <p className="text-center text-gray-600">No data available</p>
        )}
      </div>
    </section>
  );
}
