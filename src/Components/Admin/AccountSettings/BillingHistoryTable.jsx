import React, { useState, useMemo } from "react";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import { FaSort } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";

const initialBillings = [
  {
    date: "Sep 12, 2023",
    description: "Professional Plan (Annual)",
    amount: "$2,388.00",
    status: "Paid",
    invoice: "#INV-20230912-01",
  },
  {
    date: "Aug 12, 2023",
    description: "Professional Plan (Annual)",
    amount: "$2,388.00",
    status: "Paid",
    invoice: "#INV-20230812-01",
  },
  {
    date: "Jul 12, 2023",
    description: "Professional Plan (Annual)",
    amount: "$2,388.00",
    status: "Paid",
    invoice: "#INV-20230712-01",
  },
];

const BillingHistoryTable = () => {
  const [billings] = useState(initialBillings);
  const [selectedInvoices, setSelectedInvoices] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const getStatusClass = (status = "") => {
    if (status.toLowerCase() === "paid") return "status-green";
    if (status.toLowerCase() === "pending") return "status-yellow";
    if (status.toLowerCase() === "failed") return "status-red";
    return "status-blue";
  };

  const sortedBillings = useMemo(() => {
    const items = [...billings];
    if (sortConfig.key) {
      items.sort((a, b) => {
        const A = String(a[sortConfig.key] ?? "").toLowerCase();
        const B = String(b[sortConfig.key] ?? "").toLowerCase();
        if (A < B) return sortConfig.direction === "ascending" ? -1 : 1;
        if (A > B) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return items;
  }, [billings, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const onToggleSelect = (invoice) => {
    setSelectedInvoices((prev) => {
      const next = new Set(prev);
      if (next.has(invoice)) next.delete(invoice);
      else next.add(invoice);
      return next;
    });
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey)
      return <FaSort style={{ color: "#fefefe" }} className="tt-sort-icon" />;
    return sortConfig.direction === "ascending" ? (
      <FiChevronUp className="tt-sort-icon active" />
    ) : (
      <FiChevronDown className="tt-sort-icon active" />
    );
  };

  return (
    <div className="upload-table-panel">
      <div className="table-scroll">
        <table className="custom-table history-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}></th>

              <th onClick={() => requestSort("date")}>
                DATE <SortIcon columnKey="date" />
              </th>

              <th onClick={() => requestSort("description")}>
                DESCRIPTION <SortIcon columnKey="description" />
              </th>

              <th onClick={() => requestSort("amount")}>
                AMOUNT <SortIcon columnKey="amount" />
              </th>

              <th onClick={() => requestSort("status")}>
                STATUS <SortIcon columnKey="status" />
              </th>

              <th onClick={() => requestSort("invoice")}>
                INVOICE <SortIcon columnKey="invoice" />
              </th>

              {/* <th>ACTIONS</th> */}
            </tr>
          </thead>

          <tbody>
            {sortedBillings.map((row, i) => {
              const isSelected = selectedInvoices.has(row.invoice);
              return (
                <tr key={i} className={isSelected ? "row-selected" : ""}>
                  <td>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(row.invoice)}
                    />
                  </td>

                  {/* DATE */}
                  <td>{row.date}</td>

                  {/* DESCRIPTION */}
                  <td>{row.description}</td>

                  {/* AMOUNT */}
                  <td>{row.amount}</td>

                  {/* STATUS */}
                  <td>
                    <span
                      className={`status-tag ${getStatusClass(row.status)}`}
                    >
                      {row.status}
                    </span>
                  </td>

                  {/* INVOICE */}
                  <td>{row.invoice}</td>

                  {/* ACTIONS */}
                  {/* <td>
                    <button
                      className="border-0 w-50"
                      style={{ background: "none" }}
                      // replace with actual handler (download / view invoice)
                      onClick={() => console.log("View invoice", row.invoice)}
                    >
                      <IoEyeOutline size={16} />
                    </button>
                  </td> */}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .custom-table tbody tr.row-selected td {
          background-color: #dcfce7 !important;
        }

        .custom-table tbody tr.row-selected:hover td {
          background-color: #bbf7d0 !important;
        }
      `}</style>
    </div>
  );
};

export default BillingHistoryTable;
