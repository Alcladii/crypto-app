import React from 'react'
import { Bar } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Filler,
    Legend,
  } from 'chart.js';
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Filler,
    Legend
  );

const BarChart = ({volumeList}) => {

    const options = {
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: false,
            text: "Chart.js Line Chart"
          }
        },
        scales: {
          y: {
            display: false,
            grid: {
              display: false,
              drawBorder: false
            }
          },
          x: {
            display: true,
            grid: {
              display: false,
              drawBorder: false
            }
          }
        },
        tension: 0.5
      };

    const volumeData = {
        labels: volumeList.map((item) => new Date(item[0]).toLocaleDateString()),
        datasets: [
          {
            label: "Trade volume",
            data: volumeList.map((item) => item[1]),
            backgroundColor: "blue", 
            borderColor: "blue", 
            borderWidth: 1, 
            borderRadius: 3,
            pointRadius: 0,
            fill: true
          }
        ]
      }

  return <Bar data={volumeData} options={options}/>
  
}

export default BarChart