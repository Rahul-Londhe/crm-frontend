import React, { useState, useEffect } from "react";
import API from "./api/api";

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

  // ================= FETCH LEADS =================
  useEffect(() => {

    const fetchLeads = async () => {

      try {

        const res = await API.get("/leads");

        console.log("LEADS:", res.data);

        if (res.data?.success) {
          setLeads(res.data.leads || []);
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

    if (!form.lead) {
      setError("Please select a Lead ❌");
      return;
    }

    try {

      setLoading(true);
      setError("");

      const payload = {
        invoiceNumber: form.invoiceNumber,
        lead: form.lead,
        amount: Number(form.amount),
        dueDate: form.dueDate
      };

      console.log("FINAL PAYLOAD:", payload);

      const res = await API.post(
        "/invoices",
        payload
      );

      if (res.data?.success) {

        alert("Invoice Created ✅");

        setForm({
          invoiceNumber: "",
          lead: "",
          amount: "",
          dueDate: ""
        });

        onSuccess && onSuccess();

      } else {

        setError(
          res.data?.message ||
          "Failed to create invoice ❌"
        );

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

      {error && (
        <p style={styles.error}>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>

        {/* Invoice Number */}
        <input
          placeholder="Invoice Number"
          value={form.invoiceNumber}
          onChange={(e) =>
            setForm({
              ...form,
              invoiceNumber: e.target.value
            })
          }
          style={styles.input}
        />

        {/* Lead Dropdown */}
        <select
          value={form.lead}
          onChange={(e) =>
            setForm({
              ...form,
              lead: e.target.value
            })
          }
          style={styles.input}
        >

          <option value="">
            Select Lead
          </option>

          {leads.map((l) => (

            <option
              key={l._id}
              value={l._id}
            >
              {l.name} ({l.phone})
            </option>

          ))}

        </select>

        {/* Amount */}
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) =>
            setForm({
              ...form,
              amount: e.target.value
            })
          }
          style={styles.input}
        />

        {/* Due Date */}
        <input
          type="date"
          value={form.dueDate}
          onChange={(e) =>
            setForm({
              ...form,
              dueDate: e.target.value
            })
          }
          style={styles.input}
        />

        <button
          type="submit"
          disabled={loading}
          style={styles.button}
        >

          {loading
            ? "Creating..."
            : "Create Invoice"}

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