import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";

ChartJS.register(ArcElement, Tooltip);

export default function BudgetPieChart() {
  return (
    <Pie
      data={{
        labels: [
          "Recruitment Channels",
          "Job Boards",
          "Agency Fees",
          "Assessment Tools",
          "Other Expenses",
        ],
        datasets: [
          {
            data: [35, 25, 20, 10, 10],
            backgroundColor: [
              "#2563eb",
              "#60a5fa",
              "#818cf8",
              "#93c5fd",
              "#e5e7eb",
            ],
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,   // ✅ must
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      }}
    />

  );
}
