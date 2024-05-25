import React from "react";
import { Chart as ChartJS, ArcElement, Legend, PieController } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Legend, PieController);

const state = {
  labels: ["Asia", "Europe"],
  datasets: [
    {
      label: "Rainfall",
      backgroundColor: ["#9a55ff", "#ff4d7c"],
      data: [2478, 5267],
    },
  ],
};

const PieChart = () => {
  return (
    <div className="chartContainer">
      <Pie
        data={state}
        options={{
          title: {
            display: true,
            fontSize: 20,
          },
          legend: {
            display: true,
            position: "top",
          },
          responsive: true,
        }}
      />
    </div>
  );
};
export default PieChart;
