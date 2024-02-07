import React from "react";
import {Bar} from 'react-chartjs-2';


const state = {
  labels: ['2006','', '2008','', '2010','', '2012'],
  datasets: [
    {
      label: 'Total Income',
      backgroundColor: '#9a55ff',
      borderWidth: 1,
      data: [100, 75, 50, 75, 50, 75, 100]
    },
    {
      label: 'Total Outcome',
      backgroundColor: '#da8cff',
      borderWidth: 1,
      data: [90, 65, 40, 65, 40, 65, 90]
    }
  ]
  }

const BarChart =()=> {
      return (
        <div>
           <Bar
              data={state}
              options={{
                responsive: true,
                legend: {
                    display: false,
                },
              }}
            />
          </div>
          );
        }
export default BarChart;