import React, { useState } from "react";
import "./MasterShare.css";
import { useSendTemplateMailMutation } from "../../State-Management/Api/MasterAdminApiSlice";
import { toast } from "react-toastify";

const MasterShare = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [sendTemplateMail, { isLoading }] = useSendTemplateMailMutation();
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const templates = [
    { id: "temp-1", name: "Welcome Template v1", url: "/benmyl_welcome_template.html" },
    { id: "temp-2", name: "Welcome Template v2", url: "/benmyl_welcome_template_v2.html" },
    { id: "temp-3", name: "Welcome Template v3", url: "/benmyl_welcome_template_v5.html" },
    { id: "temp-4", name: "Welcome Template v4", url: "/benmyl_welcome_template_v4.html" },
    { id: "temp-5", name: "Welcome Template v5", url: "/benmyl_welcome_template_v3.html" },
    { id: "temp-6", name: "Welcome Template v6", url: "/benmyl_welcome_template_combined.html" },
  ];

  const selectedTemplateObj = templates.find((t) => t.id === selectedTemplate);

  const handleSend = async (e) => {
    e.preventDefault();

    if (!selectedTemplate) {
      toast.error("Please select a template.");
      return;
    }

    if (!name.trim()) {
      toast.error("Please enter recipient name.");
      return;
    }

    if (!email.trim()) {
      toast.error("Please enter recipient email.");
      return;
    }

    const payload = {
      templateId: selectedTemplate, // temp-1,temp-2,temp-3...
      toEmail: email,
      name: name,
      message: message,
    };

    try {
      const response = await sendTemplateMail(payload).unwrap();

      toast.success(response?.message || "Email sent successfully!");

      // Reset Form
      setSelectedTemplate("");
      setMessage("");
      setEmail("");
      setName("");

    } catch (error) {
      toast.error(
        error?.data?.message || "Failed to send email."
      );
    }
  };

  return (
    <div className="master-share-container">
      <div className="master-share-header">
        <h2>Share Templates</h2>
        <p>Select a template and send an email.</p>
      </div>

      <div className="master-share-content">
        <div className="master-share-form-card">
          <form onSubmit={handleSend} className="master-share-form">
            <div className="form-group">
              <label htmlFor="templateSelect">Select HTML Template</label>
              <select
                id="templateSelect"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
              >
                <option value="" disabled>Select a template...</option>
                {templates.map((tpl) => (
                  <option key={tpl.id} value={tpl.id}>
                    {tpl.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="templateId">Loaded Template ID</label>
              <input
                type="text"
                id="templateId"
                value={selectedTemplate}
                readOnly
                className="readonly-input"
                placeholder="Select a template above"
              />
            </div>

            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Recipient's Name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Send to Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Recipient's Email Address"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message here..."
                rows="5"
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="master-share-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Email"}
              </button>
            </div>
          </form>
        </div>

        {/* Template Preview Section */}
        <div className="master-share-preview-card">
          <h3>Template Preview</h3>
          <div className="preview-container">
            {selectedTemplateObj ? (
              <iframe
                src={selectedTemplateObj.url}
                title="Template Preview"
                className="template-iframe"
              />
            ) : (
              <div className="no-preview">
                <p>Select a template to view the preview</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterShare;
