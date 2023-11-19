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

const LineChartCurrencyConverter = ({ priceVolumeList }) => {
  //console.log("price volume from LineChartCurrencyConverter", priceVolumeList)
  /*const priceLeft = priceVolumeList[0].prices.map((price) => price[1]);
  const priceRight = priceVolumeList[1].prices.map((price) => price[1]);

  const convertionRate = [];

  for (let i = 0; i < priceLeft.length; i++) {
    const quotient = priceLeft[i] / priceRight[i];
    convertionRate.push(quotient);
  }

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

  const priceData = {
    labels: priceVolumeList.length !== 0 && priceVolumeList[0].prices.map((item) =>
      new Date(item[0]).toLocaleDateString()
    ),
    datasets:      
      priceVolumeList.map((item) => {
        return {
          label: `Trade Price`,
          data: convertionRate ,
          borderColor: "blue",
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

  return <Line data={priceData} options={options} />;*/
};

export default LineChartCurrencyConverter;

