// InviteTeamMemberModal.jsx
import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function InviteTeamMemberModal({ show, onHide }) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
      backdrop="static"
      keyboard
    >
      <Modal.Header closeButton>
        <Modal.Title style={{fontSize: "18px"}}>Invite Team Member</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form className="d-flex gap-2">
          <Form.Group className="mb-3 w-100" controlId="inviteName">
            <Form.Label className="section-title">Full Name</Form.Label>
            <Form.Control type="text" className="auth-input" placeholder="Enter full name" />
          </Form.Group>

          <Form.Group className="mb-3 w-100" controlId="inviteEmail">
            <Form.Label className="section-title">Email</Form.Label>
            <Form.Control type="email" className="auth-input" placeholder="Enter email" />
          </Form.Group>

          <Form.Group className="mb-0 w-100" controlId="inviteRole">
            <Form.Label className="section-title">Role</Form.Label>
            <Form.Select className="btn-secondary">
              <option>Admin</option>
              <option>Recruiter</option>
              <option>Viewer</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <button className="btn-secondary" onClick={onHide}>
          Cancel
        </button>
        <button className="btn-primary" onClick={onHide}>
          Send Invite
        </button>
      </Modal.Footer>
    </Modal>
  );
}
