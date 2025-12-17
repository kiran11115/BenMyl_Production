import React, { useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";

export default function DocPickerButton() {
  const [files, setFiles] = useState([]);

  const handleChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  return (
    <div>
      {/* Upload Button */}
      <label className="upload-cloud-btn">
        <IoCloudUploadOutline className="upload-cloud-icon" />
        <span>Upload Talent</span>

        <input
          type="file"
          hidden
          multiple
          accept=".pdf,.doc,.docx"
          onChange={handleChange}
        />
      </label>

      {/* FILE LIST */}
      {files.length > 0 && (
        <ul className="file-list">
          {files.map((file, index) => (
            <li key={index} className="file-item">
              {file.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
