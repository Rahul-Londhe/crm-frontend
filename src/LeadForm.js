import React, { useState, useEffect } from "react";
import API from "./api/api";

function LeadForm({ lead, onSave, onClose }) {

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    priority: "Medium",
    value: "",
    source: "Manual",
    nextFollowUp: "",
    status: "New"
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ GET USER + COMPANY FROM LOCALSTORAGE
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const companyId = user?.companyId;

  // ================= PREFILL =================
  useEffect(() => {
    if (lead) {
      setForm({
        name: lead.name || "",
        email: lead.email || "",
        phone: lead.phone || "",
        priority: lead.priority || "Medium",
        value: lead.value || "",
        source: lead.source || "Manual",
        status: lead.status || "New",
        nextFollowUp: lead.nextFollowUp
          ? new Date(lead.nextFollowUp).toISOString().slice(0, 16)
          : ""
      });
    }
  }, [lead]);

  // ================= CHANGE =================
  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "phone" || name === "value") {
      value = value.replace(/\D/g, "");
    }

    setForm(prev => ({ ...prev, [name]: value }));
  };

  // ================= FILE =================
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // ================= VALIDATION =================
  const validate = () => {
    if (!form.name.trim()) return alert("Enter Name"), false;
    if (!form.phone || form.phone.length !== 10)
      return alert("Enter valid 10 digit phone"), false;

    if (!companyId) {
      alert("Company not found, please login again");
      return false;
    }

    return true;
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const formData = new FormData();

      Object.keys(form).forEach(key => {
        formData.append(key, form[key] || "");
      });

      // ✅ ADD REQUIRED FIELDS
      formData.append("user", user?._id);
      formData.append("companyId", companyId);

      // ✅ VALUE FIX
      formData.set("value", Number(form.value || 0));

      if (file) {
        formData.append("file", file);
      }

      let res;

      if (lead?._id) {
        res = await API.put(`/leads/${lead._id}`, formData);
      } else {
        res = await API.post("/leads", formData);
      }

      if (res.data.success) {
        onSave?.(res.data.lead);
        onClose?.();
        alert("✅ Lead Saved");
      }

    } catch (err) {
      console.log("ERROR:", err.response?.data || err.message);

      // ✅ DUPLICATE ERROR HANDLE
      if (err.response?.data?.message === "Phone already exists") {
        alert("❌ This phone number already exists");
      } else {
        alert(err.response?.data?.message || "Server Error");
      }
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>{lead ? "Edit Lead" : "Add Lead"}</h3>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name *" value={form.name} onChange={handleChange} /><br /><br />

        <input name="phone" placeholder="Phone *" value={form.phone} onChange={handleChange} /><br /><br />

        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} /><br /><br />

        <select name="source" value={form.source} onChange={handleChange}>
          <option>Manual</option>
          <option>Facebook</option>
          <option>Website</option>
        </select><br /><br />

        <select name="priority" value={form.priority} onChange={handleChange}>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select><br /><br />

        <input
          type="datetime-local"
          name="nextFollowUp"
          value={form.nextFollowUp}
          onChange={handleChange}
        /><br /><br />

        <input
          type="number"
          name="value"
          placeholder="Deal Value"
          value={form.value}
          onChange={handleChange}
        /><br /><br />

        <input type="file" onChange={handleFileChange} /><br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default LeadForm;