import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { FiUser, FiMail, FiShield, FiSend } from "react-icons/fi";
import { useInviteUserMutation } from "../../../State-Management/Api/SignupApiSlice";
import { toast } from "react-toastify";

export default function InviteTeamMemberModal({ show, onHide, onInviteSuccess }) {
  const [inviteUser, { isLoading }] = useInviteUserMutation();
  const companyId = localStorage.getItem("CompanyId");
  const companyName = localStorage.getItem("CompanyName");
  const username = localStorage.getItem("UserName");
  const loginEmail = localStorage.getItem("Email");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "Admin",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleInvite = async () => {
    if (!formData.fullName || !formData.email) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const formDataPayload = new FormData();
      formDataPayload.append("emails", formData.email);
      formDataPayload.append("role", formData.role);
      formDataPayload.append("companyEmailID", loginEmail);
      formDataPayload.append("CompanyID", companyId);
      formDataPayload.append("CompanyName", companyName);
      formDataPayload.append("inviterusername", username);
      formDataPayload.append("FullName", formData.fullName);

      const response = await inviteUser(formDataPayload).unwrap();
      
      // Clear form and notify success
      setFormData({ fullName: "", email: "", role: "Admin" });
      toast.success(response?.result_Message || "Invitation sent successfully!");
      if (onInviteSuccess) onInviteSuccess();
      onHide();
    } catch (err) {
      console.error(err);
      const msg = err?.data?.result_Message || "Failed to send invitation. Please try again.";
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="md" backdrop="static" className="premium-modal">
      <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "20px" }}>
        <div className="modal-header border-0 pb-0 px-4 pt-4 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-orange-soft p-3 rounded-circle" style={{ backgroundColor: "rgba(245, 129, 12, 0.1)", color: "#f5810c" }}>
              <FiUser size={24} />
            </div>
            <div>
              <h2 className="h5 fw-bold m-0" style={{ color: "#0f172a" }}>Invite Team Member</h2>
              <p className="small text-muted m-0">Add a new member to your organization</p>
            </div>
          </div>
        </div>

        <div className="modal-body p-4">
          {error && (
            <div className="alert alert-danger py-2 small border-0 mb-3" style={{ borderRadius: "10px" }}>
              {error}
            </div>
          )}

          <div className="mb-3">
            <label className="form-label small fw-bold text-slate-700" style={{ marginBottom: "6px" }}>Full Name</label>
            <div className="input-group-premium d-flex align-items-center bg-light px-3 rounded-3 border" style={{ height: "42px", transition: "all 0.2s" }}>
              <FiUser className="text-slate-400 me-2" size={18} />
              <input
                type="text"
                name="fullName"
                className="form-control border-0 bg-transparent p-0 shadow-none"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="full name"
                style={{ fontSize: "14px", color: "#1e293b" }}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-bold text-slate-700" style={{ marginBottom: "6px" }}>Email Address</label>
            <div className="input-group-premium d-flex align-items-center bg-light px-3 rounded-3 border" style={{ height: "42px" }}>
              <FiMail className="text-slate-400 me-2" size={18} />
              <input
                type="email"
                name="email"
                className="form-control border-0 bg-transparent p-0 shadow-none"
                value={formData.email}
                onChange={handleChange}
                placeholder="email address"
                style={{ fontSize: "14px", color: "#1e293b" }}
              />
            </div>
          </div>

          <div className="mb-1">
            <label className="form-label small fw-bold text-slate-700" style={{ marginBottom: "6px" }}>Assign Role</label>
            <div className="input-group-premium d-flex align-items-center bg-light px-3 rounded-3 border" style={{ height: "42px" }}>
              <FiShield className="text-slate-400 me-2" size={18} />
              <select
                name="role"
                className="form-select border-0 bg-transparent p-0 shadow-none"
                value={formData.role}
                onChange={handleChange}
                style={{ fontSize: "14px", color: "#1e293b", cursor: "pointer" }}
              >
                <option value="Admin">Administrator</option>
                <option value="Recruiter2">Recruiter</option>
                <option value="Recruiter">Hiring Manager</option>
                <option value="Benchsales">Bench Sales Personnel</option>
              </select>
            </div>
          </div>
        </div>

        <div className="modal-footer border-0 p-4 pt-0 d-flex flex-nowrap gap-2">
          <button 
            className="action-btn-premium w-50 py-2 border-0" 
            onClick={onHide} 
            style={{ background: "#f1f5f9", color: "#475569", borderRadius: "10px", fontWeight: "700", fontSize: "14px" }}
          >
            Discard
          </button>
          <button
            className="action-btn-premium w-50 py-2 border-0 d-flex align-items-center justify-content-center gap-2"
            onClick={handleInvite}
            disabled={isLoading}
            style={{ background: "#f5810c", color: "#fff", borderRadius: "10px", fontWeight: "700", fontSize: "14px" }}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span>Wait...</span>
              </>
            ) : (
              <>
                <FiSend />
                <span>Invite</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}

