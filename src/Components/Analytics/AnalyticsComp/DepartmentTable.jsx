import React from "react";


const rows = [
  { dep: "Engineering", open: 12, app: 450, int: 85, off: 15, bud: "78%" },
  { dep: "Sales", open: 8, app: 320, int: 62, off: 10, bud: "65%" },
  { dep: "Marketing", open: 5, app: 280, int: 45, off: 7, bud: "72%" },
  { dep: "HR", open: 3, app: 180, int: 28, off: 4, bud: "58%" },
  { dep: "Finance", open: 4, app: 220, int: 35, off: 6, bud: "63%" },
];

export default function DepartmentTable() {
  return (
    <div className="metrics-card">
      <table className="metrics-table">
        <thead>
          <tr>
            <th>Department</th>
            <th>Open Positions</th>
            <th>Applications</th>
            <th>Interviews</th>
            <th>Offers</th>
            <th>Budget Used</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.dep}>
              <td>{r.dep}</td>
              <td>{r.open}</td>
              <td>{r.app}</td>
              <td>{r.int}</td>
              <td>{r.off}</td>
              <td>{r.bud}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="table-footer">
        <span className="table-entries">
          Showing 1 to 5 of 5 entries
        </span>

        <div className="table-pagination">
          <button className="page-btn disabled">Previous</button>
          <button className="page-btn active">1</button>
          <button className="page-btn">Next</button>
        </div>
      </div>
    </div>
  );
}
