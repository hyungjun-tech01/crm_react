import React from "react";
import { Chart as ChartJS, LineElement, Tooltip, Legend, LinearScale, LineController } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LinearScale, LineElement, Tooltip, Legend, LineController);


const data = {
    labels: ["2006", "2007", "2008", "2009", "2010", "2011", "2012"],
    datasets: [
      {
        label: "Total Sales",
        data: [50, 75, 50, 75, 50, 75,100],
        fill: false,
        borderColor: "#9a55ff"
       
        
      },
      {
        label: "Total Revenue",
        data: [90, 65, 40, 65, 40, 65,50],
        fill: false,
        borderColor: "#da8cff"
      }
    ]
  };

const LineChart =()=>{
      return (       
        <div className="App chartContainer">
          <Line data={data}         
              options={{
                legend:{
                  display:false,
                }
              }} />
        </div>
          );
        }
export default LineChart;
