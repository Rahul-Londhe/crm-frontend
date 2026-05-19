import React, { useState } from "react";
import { addPayment } from "../api/invoiceApi";
import handlePayment from "../utils/handlePayment"; // 🔥 Razorpay

const AddPaymentModal = ({ invoice, onClose }) => {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Cash");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 FIX: calculate paid from payments array
  const totalPaid = invoice.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
  const remainingAmount = invoice.amount - totalPaid;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ================= VALIDATION =================
    if (!amount || Number(amount) <= 0) {
      alert("Enter valid amount");
      return;
    }

    if (Number(amount) > remainingAmount) {
      alert(`Max allowed amount is ₹${remainingAmount}`);
      return;
    }

    if (!date) {
      alert("Select date");
      return;
    }

    try {
      setLoading(true);

      // 🔥 ONLINE PAYMENT FLOW (Razorpay)
      if (method === "Online") {
        await handlePayment({
          amount: Number(amount),
          invoiceId: invoice._id,
          customer: {
            name: invoice.lead?.name,
            email: invoice.lead?.email,
            phone: invoice.lead?.phone,
          },
        });

        onClose();
        return;
      }

      // 🔥 NORMAL PAYMENT (Cash / UPI / Card)
      await addPayment(invoice._id, {
        amount: Number(amount),
        method,
        date,
      });

      alert("✅ Payment Added Successfully");
      onClose();

    } catch (err) {
      console.error("Payment Error:", err);
      alert(err?.response?.data?.message || "❌ Payment Failed");
    }

    setLoading(false);
  };

  return (
    <div style={overlay}>
      <div style={modal}>

        <h2 style={title}>💰 Add Payment</h2>

        {/* 🔹 Invoice Info */}
        <div style={infoBox}>
          <p><b>Invoice:</b> {invoice.invoiceNo || "N/A"}</p>
          <p><b>Total:</b> ₹{invoice.amount}</p>
          <p><b>Paid:</b> ₹{totalPaid}</p>
          <p><b>Remaining:</b> ₹{remainingAmount}</p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* 🔹 Amount */}
          <input
            type="number"
            placeholder="Enter Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={input}
          />

          {/* 🔹 Method */}
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            style={input}
          >
            <option>Cash</option>
            <option>UPI</option>
            <option>Card</option>
            <option>Online</option> {/* 🔥 Razorpay */}
          </select>

          {/* 🔹 Date (hide for online) */}
          {method !== "Online" && (
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={input}
            />
          )}

          {/* 🔹 Buttons */}
          <button type="submit" disabled={loading} style={btnGreen}>
            {loading
              ? "Processing..."
              : method === "Online"
              ? "Pay Now"
              : "Add Payment"}
          </button>

          <button type="button" onClick={onClose} style={btnRed}>
            Close
          </button>

        </form>
      </div>
    </div>
  );
};

// ---------------- STYLES ----------------
const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
};

const modal = {
  background: "#fff",
  padding: "25px",
  borderRadius: "12px",
  width: "360px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
};

const title = {
  marginBottom: "12px",
};

const input = {
  width: "100%",
  marginBottom: "12px",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const infoBox = {
  background: "#f1f5f9",
  padding: "12px",
  borderRadius: "8px",
  marginBottom: "15px",
  fontSize: "14px",
};

const btnGreen = {
  width: "100%",
  padding: "10px",
  background: "#16a34a",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  marginBottom: "10px",
  cursor: "pointer",
};

const btnRed = {
  width: "100%",
  padding: "10px",
  background: "#dc2626",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

export default AddPaymentModal;