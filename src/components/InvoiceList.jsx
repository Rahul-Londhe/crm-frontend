import React, { useState, useEffect } from "react";
import { getInvoices } from "../api/invoiceApi";
import AddPaymentModal from "./AddPaymentModal";

const API = "http://localhost:5000/api";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getToken = () => {
    const t = localStorage.getItem("token");
    return t && t !== "undefined" && t !== "null" ? t : null;
  };

  // ================= FETCH =================
  const fetchInvoices = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await getInvoices();

      // 🔥 FIX: backend returns { success, invoices }
      if (res?.success && Array.isArray(res.invoices)) {
        setInvoices(res.invoices);
      } else {
        setInvoices([]);
        setError("Failed to load invoices ❌");
      }
    } catch (err) {
      console.error("Invoice Error:", err);
      setInvoices([]);
      setError("Server error while loading invoices ❌");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // ================= PDF DOWNLOAD =================
  const downloadPDF = (id) => {
    const token = getToken();

    if (!token) {
      alert("Please login again");
      return;
    }

    // 🔥 FIX: backend uses header auth, not query
    fetch(`${API}/invoices/${id}/pdf`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      })
      .catch(() => alert("Failed to download PDF"));
  };

  // ================= STATUS COLOR =================
  const getStatusStyle = (status) => {
    switch (status) {
      case "Paid":
        return { color: "#16a34a", fontWeight: "bold" };
      case "Partial":
        return { color: "#f59e0b", fontWeight: "bold" };
      default:
        return { color: "#dc2626", fontWeight: "bold" };
    }
  };

  return (
    <div style={container}>
      <h2 style={title}>📄 Invoice Tracking</h2>

      {loading && <p>Loading invoices...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && invoices.length === 0 && (
        <p>No invoices found ❌</p>
      )}

      {!loading && invoices.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table style={table}>
            <thead>
              <tr>
                <th>Invoice No</th>
                <th>Lead</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Payments</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {invoices.map((inv) => (
                <tr key={inv._id}>
                  <td>{inv.invoiceNo || "N/A"}</td>

                  <td>{inv.lead?.name || "N/A"}</td>

                  <td>₹{inv.amount}</td>

                  <td style={getStatusStyle(inv.status)}>
                    {inv.status || "Pending"}
                  </td>

                  <td>
                    {inv.payments?.length > 0 ? (
                      inv.payments.map((p, i) => (
                        <div key={i}>
                          ₹{p.amount} ({p.method})
                        </div>
                      ))
                    ) : (
                      <span>No Payment</span>
                    )}
                  </td>

                  <td style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => {
                        setSelectedInvoice(inv);
                        setShowModal(true);
                      }}
                      style={btn("#16a34a")}
                    >
                      + Payment
                    </button>

                    <button
                      onClick={() => downloadPDF(inv._id)}
                      style={btn("#2563eb")}
                    >
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && selectedInvoice && (
        <AddPaymentModal
          invoice={selectedInvoice}
          onClose={() => {
            setShowModal(false);
            fetchInvoices();
          }}
        />
      )}
    </div>
  );
};

// ================= STYLES =================
const container = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const title = {
  marginBottom: "15px",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const btn = (color) => ({
  padding: "6px 12px",
  background: color,
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
});

export default InvoiceList;