import React, { useState, useRef, useEffect } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function ContractItem({ title, amount, date, status, user, avatar }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const statusClass = status.toLowerCase();

  return (
    <div className="contract-row">
      <div className="row-left">
        <div className="row-title">
          {title}
          <span className={`badge ${statusClass}`}>{status}</span>
        </div>

        <div className="row-meta">
          <span className="meta-amount">{amount}</span>
          <span>•</span>
          <span className="meta-date">{date}</span>
        </div>
      </div>

      <div className="row-right">
        <div className="user">
          <img src={avatar} alt="" className="user-avatar" />
          <span className="user-name">{user}</span>
        </div>

        {/* Dots button */}
        <div style={{ position: "relative" }}>
          <button
            ref={btnRef}
            className="dots"
            onClick={() => setOpen((prev) => !prev)}
          >
            <FiMoreHorizontal size={18} />
          </button>

          {open && (
            <div ref={menuRef} className="action-menu">
              <button
                className="action-item"
                onClick={() =>navigate("/user/user-contract-view") }
              >
                View Contract
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
