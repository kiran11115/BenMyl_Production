// InviteTeamMemberModal.jsx
import React, { useState } from "react";
import { Modal, Form } from "react-bootstrap";
import { useInviteUserMutation } from "../../../State-Management/Api/SignupApiSlice";

export default function InviteTeamMemberModal({ show, onHide, user }) {
  const [inviteUser, { isLoading }] = useInviteUserMutation();
  const companyId = localStorage.getItem("CompanyId");
  const companyName = localStorage.getItem("CompanyName");
  const username = localStorage.getItem("UserName");
  const Email = localStorage.getItem("Email");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "Admin",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInvite = async () => {
  try {
    const formDataPayload = new FormData();

    formDataPayload.append("emails", formData.email);
    formDataPayload.append("role", formData.role);
    formDataPayload.append("companyEmailID", Email);
    formDataPayload.append("CompanyID", companyId);
    formDataPayload.append("CompanyName", companyName);
    formDataPayload.append("inviterusername", username);
    formDataPayload.append("FullName", formData.fullName);

    await inviteUser(formDataPayload).unwrap();

    alert("Invitation sent successfully");
    onHide();
  } catch (err) {
    console.error(err);
    alert("Failed to send invite");
  }
};


  return (
    <Modal show={show} onHide={onHide} centered size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "18px" }}>
          Invite Team Member
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form className="d-flex gap-2">
          <Form.Group className="mb-3 w-100">
            <Form.Label className="section-title">Full Name</Form.Label>
            <Form.Control
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
            />
          </Form.Group>

          <Form.Group className="mb-3 w-100">
            <Form.Label className="section-title">Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
            />
          </Form.Group>

          <Form.Group className="mb-0 w-100">
            <Form.Label className="section-title">Role</Form.Label>
            <Form.Select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="Admin">Admin</option>
              <option value="Recruiter">Recruiter</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <button className="btn-secondary" onClick={onHide}>
          Cancel
        </button>
        <button
          className="btn-primary"
          onClick={handleInvite}
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send Invite"}
        </button>
      </Modal.Footer>
    </Modal>
  );
}
