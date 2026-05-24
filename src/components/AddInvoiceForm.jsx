import React, { useState, useEffect } from "react";
import API from "./api/api";
const API = "API";

const AddInvoiceForm = ({ onSuccess }) => {

  const [form, setForm] = useState({
    invoiceNumber: "",
    lead: "",
    amount: "",
    dueDate: ""
  });

  const [leads, setLeads] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= TOKEN =================
  const getToken = () => {
    const t = localStorage.getItem("token");
    return t && t !== "undefined" && t !== "null" ? t : null;
  };

  // ================= FETCH LEADS =================
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await fetch(`${API}/leads`, {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        });

        const data = await res.json();

        console.log("FULL LEADS DATA:", data); // 🔥 DEBUG

       if (data && Array.isArray(data.leads)) {
  setLeads(data.leads);
} else if (Array.isArray(data)) {
  setLeads(data);
} else {
  setLeads([]);
}
        

      } catch (err) {
        console.error("Lead Fetch Error:", err);
        setLeads([]);
      }
    };

    fetchLeads();
  }, []);

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("FINAL SELECTED LEAD:", form.lead);

  if (!form.lead) {
    setError("Please select a Lead ❌");
    return;
  }

  try {
    setLoading(true);
    setError("");

    const payload = {
      invoiceNumber: form.invoiceNumber,
      lead: form.lead, // ✅ MongoDB ID only
      amount: Number(form.amount),
      dueDate: form.dueDate
    };

    console.log("FINAL PAYLOAD:", payload);

    const res = await fetch(`${API}/invoices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (data.success) {
      alert("Invoice Created ✅");

      setForm({
        invoiceNumber: "",
        lead: "",
        amount: "",
        dueDate: ""
      });

      onSuccess && onSuccess();
    } else {
      setError(data.message || "Failed to create invoice ❌");
    }

  } catch (err) {
    console.error(err);
    setError("Server Error ❌");
  } finally {
    setLoading(false);
  }
};
  return (
    <div style={styles.container}>
      <h3>Create Invoice</h3>

      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit}>

        {/* Invoice Number */}
        <input
          placeholder="Invoice Number"
          value={form.invoiceNumber}
          onChange={(e) =>
            setForm({ ...form, invoiceNumber: e.target.value })
          }
          style={styles.input}
        />

        {/* ✅ FIXED DROPDOWN */}
        <select
  value={form.lead}
  onChange={(e) => {
    console.log("SELECTED LEAD ID:", e.target.value);

    setForm((prev) => ({
      ...prev,
      lead: e.target.value
    }));
  }}
  style={styles.input}
>
  <option value="">Select Lead</option>

  {leads.map((l) => (
    <option key={l.id} value={l.id}>
      {l.name} ({l.phone})
    </option>
  ))}
</select>
console.log("LEADS FROM API:", leads);
console.log("FINAL LEAD ID:", form.lead);
        {/* Amount */}
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) =>
            setForm({ ...form, amount: e.target.value })
          }
          style={styles.input}
        />

        {/* Due Date */}
        <input
          type="date"
          value={form.dueDate}
          onChange={(e) =>
            setForm({ ...form, dueDate: e.target.value })
          }
          style={styles.input}
        />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Creating..." : "Create Invoice"}
        </button>

      </form>
    </div>
  );
};

// ================= STYLES =================
const styles = {
  container: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px"
  },
  input: {
    width: "100%",
    marginBottom: "12px",
    padding: "10px",
    border: "1px solid #ddd"
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "green",
    color: "#fff",
    border: "none",
    cursor: "pointer"
  },
  error: {
    color: "red"
  }
};

export default AddInvoiceForm;