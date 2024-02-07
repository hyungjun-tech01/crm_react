import React from "react";
import {Bar} from 'react-chartjs-2';


const state = {
  labels: ['0','100', '150','200'],
  datasets: [
    {
      label: 'Total Cost',
      backgroundColor: '#fe7096',
      borderWidth: 1,
      data: [133, 221, 783, 2478]
    },
    {
      label: 'Total Revenue',
      backgroundColor: '#9a55ff',
      borderWidth: 1,
      data: [408, 547, 675, 734]
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
                    display: true,
                    position:'top'
                },
              }}
            />
          </div>
          );
        }
export default BarChart;      