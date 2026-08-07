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
        labels: ["Developer", "Designer", "Manager", "Analyst", "Other"],
        datasets: [
          {
            label: "Total Candidates",
            data: [25, 18, 12, 15, 10],
            backgroundColor: "#c7d2fe",
          },
          {
            label: "Available",
            data: [15, 10, 8, 5, 4],
            backgroundColor: "#3b82f5",
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
