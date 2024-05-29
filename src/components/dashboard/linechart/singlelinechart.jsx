import React from "react";
import { Chart as ChartJS, LineElement, PointElement, Tooltip, Legend, LinearScale, LineController } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LinearScale, LineElement, PointElement, Tooltip, Legend, LineController);

const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul","Aug","Sep"],
    datasets: [
   
      {
        label: "Product",
        data: [10, 41, 35, 51, 54, 49,69,91,148],
        fill: false,
        borderWidth: 4,
        pointBorderWidth : 0,
        borderColor: "#9a55ff"
      }
    ]
  };
const SingleChart =()=> {
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
export default SingleChart;