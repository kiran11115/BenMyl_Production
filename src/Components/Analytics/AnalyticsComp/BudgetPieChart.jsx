import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";

ChartJS.register(ArcElement, Tooltip);

export default function BudgetPieChart() {
  return (
    <Pie
      data={{
        labels: ["Recruitment", "Job Boards", "Agency", "Tools", "Other"],
        datasets: [
          {
            data: [35, 25, 20, 10, 10],
            backgroundColor: [
              "#f59e0b",
              "#11ba82",
              "#3b82f5",
              "#93c5fd",
              "#e5e7eb",
            ],
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "bottom" } },
      }}
    />
  );
}
