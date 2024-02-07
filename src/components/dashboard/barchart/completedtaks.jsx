import React from "react";
import {Bar} from 'react-chartjs-2';


const state = {
  labels: ['Task1','Task2', 'Task3','Task4'],
  datasets: [{
    label: 'Completed',
    data: [408, 547, 675, 734],
}, {
    label: 'Started',
    data: [133, 221, 783, 2478],
},
{
    label: 'Completed',
    data: [408, 547, 675, 734],
    borderColor: '#8e5ea2',
    type: 'line',
    fill : false,
},{
    label: 'Started',
    data: [133, 221, 783, 2478],
    borderColor: '#fe7096',
    type: 'line',
    fill : false,
}],
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