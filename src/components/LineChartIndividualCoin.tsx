//import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
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
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

type LineChartIndividualCoinProps = {
  priceList: any;
  color: string;
}

const LineChartIndividualCoin: React.FC<LineChartIndividualCoinProps> = ({ priceList, color }) => {
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

  const priceData = {
    labels: priceList.map(() => ""),
    datasets: [
      {
        label: "Trade Price",
        data: priceList,
        borderColor: color,
        //here is the part for the gradient fill
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 350);
          gradient.addColorStop(0, `${color}`);
          gradient.addColorStop(0.2, "rgba(0, 0, 0, 0.0)");
          return gradient;
        },
        pointRadius: 0,
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  return <Line data={priceData} options={options} />;
};

export default LineChartIndividualCoin;
