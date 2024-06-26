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
import { setMaxTicksLimit } from "./setMaxTicksLimitLineChartCurrencyConverter";
import { setDisplayIntervalLineBarChart } from "./setDisplayTimeIntervalLineBarChart";


type LineChartCurrencyConverterProps = {
  priceVolumeList: any; 
}

type Price = [number, number]

const LineChartCurrencyConverter: React.FC<LineChartCurrencyConverterProps> = ({ priceVolumeList }) => {
  if (priceVolumeList[0].length !== 0 && priceVolumeList[1].length !== 0) {
    const priceLeft = priceVolumeList[0].prices.map((price: Price) => price[1]);
    const priceRight = priceVolumeList[1].prices.map((price: Price) => price[1]);
    const { currencyConverterDays } = useContext(CryptoContext) as CryptoContextProps;

    const convertionRate = [];

    for (let i = 0; i < priceLeft.length; i++) {
      const quotient = priceLeft[i] / priceRight[i];
      convertionRate.push(quotient);
    }

    const maxTicksLimit = setMaxTicksLimit(currencyConverterDays);

    const options = {
      aspectRatio: 2,
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
          ticks: {
            maxTicksLimit: maxTicksLimit,
          },
        },
      },
      tension: 0.5,
       
    };

    const priceData = {
      labels:
        priceVolumeList.length !== 0 &&
        priceVolumeList[0].prices.map((item: Price) => {
          return setDisplayIntervalLineBarChart(currencyConverterDays, item);
        }),

      datasets: [
        {
          label: `Currency Converter Line Chart`,
          data: convertionRate,
          borderColor: "#7878FA",
          backgroundColor: (context: any) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 350);
            gradient.addColorStop(0, "rgba(116, 116, 242, 0.6)");
            gradient.addColorStop(1, "rgba(116, 116, 242, 0.1)");
            return gradient;
          },
          pointRadius: 0,
          borderWidth: 3,
          fill: true,
        },
      ],
    };

    return (
      <div className="w-full">
        <Line data={priceData} options={options} />
      </div>
        
    ) 
  }
};

export default LineChartCurrencyConverter;
