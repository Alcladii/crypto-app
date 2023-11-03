import React, {useContext} from "react";
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
import { CryptoContext } from "../contexts/cryptoContext";

const BarChart = ({ priceVolumeList }) => {
  const { selectedCoinId, setPriceVolumeList } = useContext(CryptoContext);
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
        text: "Chart.js Line Chart",
      },
    },
    scales: {
      y: {
        display: false,
        grid: {
          display: false,
          drawBorder: false,
          type: "logarithmic"
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

  const colors = ["blue", "purple", "green"];

  const volumeData = {
    labels:
      priceVolumeList.length !== 0 &&
      priceVolumeList[0].total_volumes.map((item) =>
        new Date(item[0]).toLocaleDateString()
      ),
    datasets: priceVolumeList.map((item) => {
      const borderColor = colors[priceVolumeList.indexOf(item)];
      return {
        label: `Trade Price`,
        data: item.total_volumes.map((volume) => volume[1]),
        borderColor,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 350);
          gradient.addColorStop(0, "rgba(29, 26, 232, .5)");
          gradient.addColorStop(1, "rgba(0, 0, 0, 0.0)");
          return gradient;
        },
        pointRadius: 0,
        borderWidth: 3,
        fill: true,
      };
    }),
  };

  return <Bar data={volumeData} options={options} />;
};

export default BarChart;
