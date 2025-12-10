import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

export default function HiringLineChart() {
  return (
    <Line
      data={{
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            data: [400, 600, 900, 300, 1200, 800],
            borderColor: "#2563eb",
            tension: 0.4,
            fill: false,
          },
        ],
      }}
      options={{
        plugins: { legend: { display: false } },
        scales: {
          y: { grid: { color: "#f1f5f9" } },
          x: { grid: { display: false } },
        },
      }}
      height={90}
    />
  );
}
