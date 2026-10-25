import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: {
      display: true,
      text: "Current value by holding",
      align: "start",
      color: "#29384d",
      font: { size: 14, weight: "600" },
    },
    tooltip: {
      callbacks: {
        label: (context) =>
          `${context.dataset.label}: ₹${Number(context.raw || 0).toLocaleString(
            "en-IN",
            { minimumFractionDigits: 2, maximumFractionDigits: 2 }
          )}`,
      },
    },
  },
  scales: {
    x: { grid: { display: false }, ticks: { color: "#778397" } },
    y: {
      beginAtZero: true,
      grid: { color: "#edf1f5" },
      ticks: {
        color: "#778397",
        callback: (value) => `₹${Number(value).toLocaleString("en-IN")}`,
      },
    },
  },
};

export function VerticalGraph({ data }) {
  return (
    <div className="holdings-chart">
      <Bar options={options} data={data} />
    </div>
  );
}