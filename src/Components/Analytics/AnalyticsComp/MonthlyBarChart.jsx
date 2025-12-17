import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function MonthlyBarChart() {
  return (
    <Bar
      data={{
        labels: ["Eng", "Sales", "Mark", "HR", "Fin"],
        datasets: [
          {
            label: "Budget",
            data: [40000, 30000, 20000, 15000, 18000],
            backgroundColor: "#3b82f5",
          },
          {
            label: "Actual",
            data: [45000, 28000, 22000, 12000, 17000],
            backgroundColor: "#dce8fc",
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y",
        plugins: { legend: { position: "bottom" } },
      }}
    />
  );
}
