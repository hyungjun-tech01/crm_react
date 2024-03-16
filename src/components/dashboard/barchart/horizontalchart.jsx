import React from "react";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  Legend,
  Tooltip,
  BarController,
} from 'chart.js';
import { Bar } from "react-chartjs-2";

ChartJS.register(LinearScale, CategoryScale, BarElement, Legend, Tooltip, BarController);

const state = {
    labels: [2000, 2010, 2011,2015, 2020],
    datasets: [
      {
        backgroundColor: [
          '#fe7096',
          '#9a55ff',
          '#3cba9f',
          '#e8c3b9',
          '#9a55ff'
        ],
        borderWidth: 2,
        label : 'sree',
        data: [2478, 5267, 734, 784, 433]
      }
    ]
  }

const HorizontalBarChart =()=> {
      return (
        <div>
           <Bar
              data={state}
              options={{
                scales: {
                  x: {
                    beginAtZero: true
                  }
                },
                legend:{
                  display:false,
                },
                indexAxis: 'y',
              }}
            />
          </div>
          );
        }
export default HorizontalBarChart;          