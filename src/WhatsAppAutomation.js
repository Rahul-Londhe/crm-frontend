import React, { useState } from "react";

function WhatsAppAutomation() {

  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // ---------------- SEND FUNCTION ----------------
  const sendWhatsApp = async () => {

    if (!phone.trim() || !message.trim()) {
      setStatus("⚠ Please enter phone number and message");
      return;
    }

    if (!token) {
      setStatus("⚠ Login required");
      return;
    }

    setLoading(true);
    setStatus("Sending message...");

    try {

      // ---------------- CLEAN NUMBER ----------------
      let cleanNumber = phone.replace(/\D/g, "");

      if (cleanNumber.length < 10) {
        setStatus("❌ Invalid phone number");
        setLoading(false);
        return;
      }

      if (!cleanNumber.startsWith("91")) {
        cleanNumber = "91" + cleanNumber;
      }

      // ---------------- API CALL ----------------
      const res = await fetch(
        "https://crm-backend-production-eec9.up.railway.app/api/send-whatsapp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`   // ✅ FIX
          },
          body: JSON.stringify({
            phone: cleanNumber,
            message
          })
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {

        setStatus("✅ WhatsApp Sent Successfully");

        setPhone("");
        setMessage("");

      } else {
        setStatus("❌ Failed to send WhatsApp");
      }

    } catch (err) {
      console.log("Error:", err);
      setStatus("⚠ Server Error");
    }

    setLoading(false);
  };

  // ---------------- UI ----------------
  return (

    <div style={{
      border: "1px solid #ddd",
      padding: "20px",
      borderRadius: "10px",
      maxWidth: "400px",
      background: "#fafafa"
    }}>

      <h2>📲 WhatsApp Automation</h2>

      <input
        type="text"
        placeholder="Enter Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc"
        }}
      />

      <textarea
        placeholder="Enter Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows="5"
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc"
        }}
      />

      <br /><br />

      <button
        onClick={sendWhatsApp}
        disabled={loading}
        style={{
          padding: "10px 20px",
          background: loading ? "#9ca3af" : "#25D366",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: loading ? "not-allowed" : "pointer"
        }}
      >
        {loading ? "Sending..." : "Send WhatsApp"}
      </button>

      <br /><br />

      {status && <p>{status}</p>}

    </div>

  );
}

export default WhatsAppAutomation;