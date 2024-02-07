import React from "react";
import {HorizontalBar} from 'react-chartjs-2';


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
           <HorizontalBar
              data={state}          
              options={{
                legend:{
                  display:false,
                }
              }}
            />
          </div>
          );
        }
export default HorizontalBarChart;          