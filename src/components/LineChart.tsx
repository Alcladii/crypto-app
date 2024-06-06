import { useContext } from "react";
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
import { CryptoContext, CryptoContextProps } from "../contexts/cryptoContext";
import { setMaxTicksLimit } from "./setMaxTicksLimitLineBarChartCoinList";
import { setDisplayIntervalLineBarChart } from "./setDisplayTimeIntervalLineBarChart";

type LineChartProps = {
  priceVolumeList: any; 
}

const LineChart: React.FC<LineChartProps> = ({ priceVolumeList }) => {
  
  const { numOfDaysFromUrl } = useContext(CryptoContext) as CryptoContextProps;
  const maxTicksLimit = setMaxTicksLimit(numOfDaysFromUrl);
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
        ticks: {
          maxTicksLimit: maxTicksLimit,
        },
      },
    },
    tension: 0.5,
  };

  const borderColors = ["#7878FA", "#D878FA", "#01F1E3"];
  const backgroundColors = [
    ["rgba(116, 116, 242, 0.1)", "rgba(116, 116, 242, 0.01)"],
    ["rgba(216, 120, 250, 0.1)", "rgba(216, 120, 250, 0.01)"],
    ["rgba(30, 213, 191, 0.1)", "rgba(145, 252, 228, 0.01)"],
  ];

  type Price = [number, number]

  type PriceVolume = {
    prices: Price[];
  };

  const priceData = {
    labels:
      priceVolumeList.length !== 0 &&
      priceVolumeList[0].prices.map((item: Price) => {
        return setDisplayIntervalLineBarChart(numOfDaysFromUrl, item);
      }),
    datasets: priceVolumeList.map((item: PriceVolume) => {
      return {
        label: `Trade Price`,
        data: item.prices.map((price: Price) => price[1]),
        borderColor: borderColors[priceVolumeList.indexOf(item)],
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 350);
          gradient.addColorStop(
            0,
            `${backgroundColors[priceVolumeList.indexOf(item)][0]}`
          );
          gradient.addColorStop(
            1,
            `${backgroundColors[priceVolumeList.indexOf(item)][1]}`
          );
          return gradient;
        },
        pointRadius: 0,
        borderWidth: 3,
        fill: true,
        yAxisID: `y-axis-${priceVolumeList.indexOf(item) + 1}`,
      };
    }),
  };

  return <Line data={priceData} options={options} />;
};

export default LineChart;
