import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

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
    <div>
      <Pie
        data={state}
        options={{
          responsive: true,
          title: {
            display: true,
            fontSize: 20,
          },
          legend: {
            display: true,
            position: "top",
          },
        }}
      />
    </div>
  );
};
export default PieChart;
