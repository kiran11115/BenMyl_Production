import React from "react";

export default function ContractItem({ title, amount, date, status, user, avatar }) {
  return (
    <div className="contract-row">
      <div className="row-left">
        <div className="row-title">{title} <span className={`badge ${status.toLowerCase()}`}>{status}</span></div>
        <div className="row-meta">
          <span className="meta-amount">{amount}</span>
          <span className="meta-date"> {date}</span>
        </div>
      </div>

      <div className="row-right">
        <div className="user">
          <img src={avatar} alt="" className="user-avatar"/>
          <span className="user-name">{user}</span>
        </div>
        <button className="dots">⋯</button>
      </div>
    </div>
  );
}
