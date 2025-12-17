const rows = [
  ["Engineering", 12, 450, 85, 15, "78%"],
  ["Sales", 8, 320, 62, 10, "65%"],
  ["Marketing", 5, 280, 45, 7, "72%"],
  ["HR", 3, 180, 28, 4, "58%"],
  ["Finance", 4, 220, 35, 6, "63%"],
];

export default function DepartmentTable() {
  return (
    <table className="analytics-table-analytics">
      <thead>
        <tr>
          <th>Department</th>
          <th>Open</th>
          <th>Applications</th>
          <th>Interviews</th>
          <th>Offers</th>
          <th>Budget</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((c, j) => (
              <td key={j}>{c}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
