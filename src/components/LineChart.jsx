import React, { useContext, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale, 
  PointElement,
  LineElement,
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
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);
import { CryptoContext } from "../contexts/cryptoContext";

const LineChart = ({ priceVolumeList }) => {
  const { selectedCoinId, setPriceVolumeList, selectedCoinData, setSelectedCoinData } =
    useContext(CryptoContext);

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
        display: true,
        grid: {
          display: false,
          drawBorder: false,
        },
        type: 'logarithmic',
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

  const priceData = {
    labels: priceVolumeList.length !== 0 && priceVolumeList[0].prices.map((item) =>
      new Date(item[0]).toLocaleDateString()
    ),
    datasets:      
      priceVolumeList.map((item) => {
        const borderColor = colors[priceVolumeList.indexOf(item)]; 
        return {
          label: `Trade Price`,
          data: item.prices.map((price) => price[1]),
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

  return <Line data={priceData} options={options} />;
};

export default LineChart;
