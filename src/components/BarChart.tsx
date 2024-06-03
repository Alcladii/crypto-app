import { useContext } from "react";
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
import { CryptoContext, CryptoContextProps } from "../contexts/cryptoContext";
import { setMaxTicksLimit } from "./setMaxTicksLimitLineBarChartCoinList";
import { setDisplayIntervalLineBarChart } from "./setDisplayTimeIntervalLineBarChart";

type BarChartProps = {
  priceVolumeList: any; 
}

const BarChart: React.FC<BarChartProps> = ({ priceVolumeList }) => {
  const { numOfDays, numOfDaysFromUrl } = useContext(CryptoContext) as CryptoContextProps;
  const maxTicksLimit = setMaxTicksLimit(numOfDays);
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
      y: {
        display: false,
        stacked: true,
        grid: {
          display: false,
          drawBorder: false,
        },
      },
      x: {
        display: true,
        stacked: true,
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

  const colors = ["#7878FA", "#D878FA", "#01F1E3"];

  type Volume = [number, number];

  type PriceVolume = {
    total_volumes: Volume[]; // An array of volumes
  };

  const volumeData = {
    labels:
      priceVolumeList !== null &&
      priceVolumeList[0].total_volumes.map((item: Volume) => {
        return setDisplayIntervalLineBarChart(numOfDaysFromUrl, item);
      }),
    datasets: priceVolumeList.map((item: PriceVolume) => {
      const backgroundColor = colors[priceVolumeList.indexOf(item)];
      return {
        label: `Trade Price`,
        data: item.total_volumes.map((volume: Volume) => volume[1]),
        backgroundColor,
        pointRadius: 3,
        borderWidth: 0,
        borderRadius: 3,
        fill: true,
      };
    }),
  };
  return <Bar data={volumeData} options={options} />;
};

export default BarChart;
