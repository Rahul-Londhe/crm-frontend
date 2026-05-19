import React, { useState } from "react"
import axios from "axios"

function FileUpload() {
  const [file, setFile] = useState(null)
  const [uploadedFile, setUploadedFile] = useState("")

  const handleChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleUpload = async () => {
    const formData = new FormData()
    formData.append("file", file)

    const res = await axios.post("http://localhost:5000/api/upload", formData)

    setUploadedFile(res.data.file)
  }

  return (
    <div>
      <h3>Upload File</h3>

      <input type="file" onChange={handleChange} />
      <button onClick={handleUpload}>Upload</button>

      {uploadedFile && (
        <div>
          <p>Uploaded:</p>
          <a
            href={`http://localhost:5000/uploads/${uploadedFile}`}
            target="_blank"
            rel="noreferrer"
          >
            View File
          </a>
        </div>
      )}
    </div>
  )
}

export default FileUpload