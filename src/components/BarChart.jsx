import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const BarChart = ({ priceVolumeList }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
        text: "Chart.js Bar Chart",
      },
    },
    scales: {
      "y-axis-1": {
        display: false,
        grid: {
          display: false,
          drawBorder: false,
        },
      },
      "y-axis-2": {
        display: false,
        grid: {
          display: false,
          drawBorder: false,
        },
      },
      "y-axis-3": {
        display: false,
        grid: {
          display: false,
          drawBorder: false,
        },
      },
      x: {
        display: true,
        grid: {
          display: false,
          drawBorder: false,
        },
      },
    },
    tension: 0.5,
  };

  const colors = ["#7878FA", "#D878FA", "#01F1E3"];

  const volumeData = {
    labels:
      priceVolumeList.length !== 0 &&
      priceVolumeList[0].total_volumes.map((item) =>
        new Date(item[0]).toLocaleDateString(undefined, { day: "numeric" })
      ),
    datasets: priceVolumeList.map((item) => {
      const borderColor = colors[priceVolumeList.indexOf(item)];
      const backgroundColor = colors[priceVolumeList.indexOf(item)];
      return {
        label: `Trade Price`,
        data: item.total_volumes.map((volume) => volume[1]),
        borderColor,
        backgroundColor,
        pointRadius: 0,
        borderWidth: 3,
        borderRadius: 4,
        fill: true,
        yAxisID: `y-axis-${priceVolumeList.indexOf(item) + 1}`,
      };
    }),
  };
  return <Bar data={volumeData} options={options} />;
};

export default BarChart;
