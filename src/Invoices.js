import React, { useEffect, useState, useCallback } from "react";
import API from "./api/api";
import AddInvoiceForm from "./components/AddInvoiceForm";
import handlePayment from "./paymentHandler";



function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [payingId, setPayingId] = useState(null);

  // ================= FORMAT =================
  const formatCurrency = (num) => {
    return new Intl.NumberFormat("en-IN").format(Number(num) || 0);
  };

  // ================= FETCH =================
  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/invoices");

      const list = Array.isArray(res.data.invoices)
        ? res.data.invoices
        : [];

      const updated = list.map((inv) => {
        const payments = Array.isArray(inv.payments) ? inv.payments : [];

        const paidAmount = payments.reduce(
          (sum, p) => sum + Number(p?.amount || 0),
          0
        );

        return {
          ...inv,
          id: inv.id || inv._id, // ✅ FIX
          paidAmount,
          payments
        };
      });

      setInvoices(updated);

    } catch (err) {
      console.error("Invoice Error:", err.response?.data || err.message);
      setError("Failed to load invoices");
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  // ================= STATUS =================
  const getStatus = (total, paid) => {
    if (paid === 0) return "Pending";
    if (paid < total) return "Partial";
    return "Paid";
  };

  const getStatusColor = (status) => {
    if (status === "Paid") return "green";
    if (status === "Partial") return "orange";
    return "red";
  };

  // ================= PAYMENT =================
  const handlePay = async (invoice) => {
    const total = Number(invoice.amount || 0);
    const paid = Number(invoice.paidAmount || 0);
    const remaining = Math.max(total - paid, 0);

    if (remaining <= 0) {
      alert("Already Paid");
      return;
    }

    try {
      const invoiceId = invoice.id || invoice._id;

      console.log("PAYMENT DEBUG:", {
        invoiceId,
        amount: remaining
      });

      if (!invoiceId) {
        alert("Invalid invoice ID ❌");
        return;
      }

      setPayingId(invoiceId);

      await handlePayment({
        amount: remaining,
        invoiceId: invoiceId, // ✅ FINAL FIX
       customer: invoice.lead,
        onSuccess: fetchInvoices
      });

    } catch (err) {
      console.error("PAY ERROR:", err);
      alert("Payment failed");
    } finally {
      setPayingId(null);
    }
  };

  // ================= PDF =================
  // ================= PDF =================
const downloadPDF = async (id) => {
  try {
    const token = localStorage.getItem("token");

    if (!id) {
      alert("Invalid invoice ID");
      return;
    }

    const res = await API.get(
      `${API_URL}/invoices/${id}/pdf`,
      {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}` // ✅ TOKEN FIX
        }
      }
    );

    // ✅ DOWNLOAD FILE
    const blob = new Blob([res.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice_${id}.pdf`;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

  } catch (err) {
    console.error("PDF Error:", err);
    alert("PDF download failed");
  }
};

  return (
    <div style={styles.container}>
      <h2>💰 Invoice Tracking</h2>

      <AddInvoiceForm onSuccess={fetchInvoices} />

      <hr />

      {loading && <p>Loading...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {!loading && invoices.length === 0 && (
        <p>No invoices found</p>
      )}

      {invoices.map((inv) => {
        const total = Number(inv.amount || 0);
        const paid = Number(inv.paidAmount || 0);
        const remaining =
  Math.max(total - paid, 0);
        const status = getStatus(total, paid);

        return (
          <div key={inv.id || inv._id} style={styles.box}>
            <h3>{inv?.lead?.name || "No Lead"}</h3>

            <p>Email: {inv?.lead?.email || "-"}</p>
            <p>Total: ₹{formatCurrency(total)}</p>

            <p style={{ color: getStatusColor(status) }}>
              Status: {status}
            </p>

            <p>Paid: ₹{formatCurrency(paid)}</p>
            <p>Remaining: ₹{formatCurrency(remaining)}</p>

            {remaining > 0 && (
              <button
                style={styles.payBtn}
                disabled={
  payingId ===
  (inv.id || inv._id)
}
                onClick={() => handlePay(inv)}
              >
                {
  payingId === (inv.id || inv._id)
    ? "Processing..."
    : "Pay Now"
}
              </button>
            )}

            <button
              style={styles.pdfBtn}
              onClick={() =>
  downloadPDF(inv.id || inv._id)
}
            >
              Download PDF
            </button>

            {inv.payments?.length > 0 && (
              <div style={{ marginTop: "10px" }}>
                <b>Payments:</b>
                {inv.payments.map((p, idx) => (
                  <div key={idx}>
                    ₹{formatCurrency(p.amount)} ({p.method || "N/A"})
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  container: { padding: "20px" },
  box: {
    border: "1px solid #ddd",
    padding: "15px",
    margin: "10px 0",
    borderRadius: "10px",
    background: "#fff"
  },
  payBtn: {
    background: "green",
    color: "#fff",
    padding: "8px",
    marginRight: "10px",
    border: "none",
    cursor: "pointer"
  },
  pdfBtn: {
    background: "blue",
    color: "#fff",
    padding: "8px",
    border: "none",
    cursor: "pointer"
  },
  error: { color: "red" }
};

export default Invoices;