import React, { useState } from "react";
import API from "../api/api";

const BASE_URL =
  process.env.REACT_APP_API ||
  "http://localhost:5000";
function FileUpload() {

  const [file, setFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState("");

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {

    try {

      const formData = new FormData();

      formData.append("file", file);

      const res = await API.post(
        "/upload",
        formData
      );

      setUploadedFile(res.data.file);

    } catch (err) {

      console.log(err);

    }

  };

  return (

    <div>

      <h3>Upload File</h3>

      <input
        type="file"
        onChange={handleChange}
      />

      <button onClick={handleUpload}>
        Upload
      </button>

      {uploadedFile && (

        <div>

          <p>Uploaded:</p>

          <a
            href={`${BASE_URL}/uploads/${uploadedFile}`}
            target="_blank"
            rel="noreferrer"
          >
            View File
          </a>

        </div>

      )}

    </div>

  );

}

export default FileUpload;