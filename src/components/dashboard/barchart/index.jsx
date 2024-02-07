import React from "react";
import {Bar} from 'react-chartjs-2';


const state = {
    labels: ['2006', '2010', '2011','2012', '2018'],
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
        data: [2478, 5267, 734, 784, 433]
      }
    ]
  }

const BarChart =()=> {
      return (
        <div>
           <Bar
          data={state}
          options={{
            title:{
              
              display:true,
              text:'Projects Yearly Sales',
              fontSize:12
            },
            legend:{
              display:false,
            }
          }}
        />
          </div>
          );
        }
export default BarChart;      