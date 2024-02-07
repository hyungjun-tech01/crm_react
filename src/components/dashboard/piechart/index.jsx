import React, { Component } from "react";
import {Pie} from 'react-chartjs-2';


const state = {
    labels: ['Asia', 'Europe'],
    datasets: [
      {
        label: 'Rainfall',
        backgroundColor: [
          '#9a55ff',
          '#ff4d7c'
        
        ],
        // hoverBackgroundColor: [
        // '#9a55ff',
        // '#fe7096'
        // ],
        data: [2478,5267]
      }
    ]
  }


const PieChart =()=> {
      return (
        <div>
          <Pie
            data={state}
            options={{
              title:{
                display:true,
                fontSize:20
              },
              legend:{
                display:true,
                position:'top'
              }
            }}
          />
          </div>
          );
        }
export default PieChart;