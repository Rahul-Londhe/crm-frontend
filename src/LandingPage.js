import React, { useState } from "react"

const API = "http://localhost:5000"

function LandingPage() {

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    message: ""
  })

  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // ---------------- CHANGE ----------------
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  // ---------------- FILE ----------------
  const handleFile = (e) => {
    setFile(e.target.files[0])
  }

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.name || !form.phone) {
      alert("Name & Phone required")
      return
    }

    setLoading(true)

    try {

      let fileName = ""

      // ✅ STEP 1: Upload file
      if (file) {
        const fd = new FormData()
        fd.append("file", file)

        const uploadRes = await fetch(`${API}/upload`, {
          method: "POST",
          body: fd
        })

        const uploadData = await uploadRes.json()

        if (uploadData.success) {
          fileName = uploadData.file
        }
      }

      // ✅ STEP 2: Save lead
      const res = await fetch(`${API}/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          file: fileName,
          source: "Website"
        })
      })

      const data = await res.json()

      if (data.success) {
        setSuccess(true)
        setForm({
          name: "",
          phone: "",
          email: "",
          company: "",
          message: ""
        })
        setFile(null)
      } else {
        alert("Error")
      }

    } catch {
      alert("Server Error")
    }

    setLoading(false)
  }

  // ---------------- UI ----------------
  return (
    <div style={{
      textAlign: "center",
      padding: "50px",
      background: "#f4f4f4",
      height: "100vh"
    }}>

      <h1>🚀 Grow Your Business</h1>
      <p>Submit your details</p>

      {success && <h3 style={{ color: "green" }}>✅ Submitted</h3>}

      <form onSubmit={handleSubmit} style={{
        background: "#fff",
        padding: "25px",
        display: "inline-block",
        borderRadius: "10px",
        width: "300px"
      }}>

        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <br /><br />

        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
        <br /><br />

        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <br /><br />

        <input name="company" placeholder="Company" value={form.company} onChange={handleChange} />
        <br /><br />

        <textarea name="message" placeholder="Message" value={form.message} onChange={handleChange} />
        <br /><br />

        {/* ✅ FILE UPLOAD */}
        <input type="file" onChange={handleFile} />
        <br /><br />

        <button type="submit">
          {loading ? "Submitting..." : "Submit"}
        </button>

      </form>

    </div>
  )
}

export default LandingPage