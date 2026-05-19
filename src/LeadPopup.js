import React from "react";
import { FiX, FiPhoneCall, FiMail } from "react-icons/fi";
import { BsWhatsapp } from "react-icons/bs";

function LeadPopup({ lead, onClose }) {

  if (!lead) return null;

  const getIcon = (type) => {
    switch (type) {
      case "Call":
        return <FiPhoneCall color="purple" />;
      case "Email":
        return <FiMail color="blue" />;
      case "WhatsApp":
        return <BsWhatsapp color="#25D366" />;
      case "Status":
        return <span>🔄</span>;
      default:
        return <span>📝</span>;
    }
  };

  return (
    <div style={overlay}>
      <div style={popup}>

        {/* HEADER */}
        <div style={header}>
          <h2>{lead.name}</h2>
          <button onClick={onClose}><FiX /></button>
        </div>

        {/* DETAILS */}
        <div style={section}>
          <p><b>Phone:</b> {lead.phone}</p>
          <p><b>Email:</b> {lead.email || "No Email"}</p>
          <p><b>Status:</b> {lead.status}</p>
          <p><b>Value:</b> ₹{lead.value}</p>
          <p><b>Source:</b> {lead.source}</p>
        </div>

        {/* NOTES */}
        <div style={section}>
          <h3>📝 Notes</h3>
          <p>{lead.note || "No Notes"}</p>
        </div>

        {/* TIMELINE */}
        <div style={section}>
          <h3>📊 Activity History</h3>

          <div style={{ maxHeight: "250px", overflowY: "auto" }}>
            {(lead.activities || []).slice().reverse().map((a, i) => (
              <div key={i} style={activityItem}>
                <div>{getIcon(a.type)}</div>
                <div>
                  <b>{a.message}</b>
                  <br />
                  <small>{new Date(a.createdAt).toLocaleString()}</small>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ---------------- STYLES ----------------
const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999
};

const popup = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  width: "400px",
  maxHeight: "90vh",
  overflowY: "auto"
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const section = {
  marginTop: "15px"
};

const activityItem = {
  display: "flex",
  gap: "10px",
  padding: "10px",
  borderBottom: "1px solid #eee"
};

export default LeadPopup;