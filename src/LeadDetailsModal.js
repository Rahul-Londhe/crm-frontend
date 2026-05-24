import React from "react";
import LeadNotes from "./LeadNotes";
function LeadDetailsModal({ lead, onClose }) {
  if (!lead) return null;

  const fileUrl = lead.file
    ? `https://crm-backend-production-eec9.up.railway.app/api/uploads/${lead.file}`
    : null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">

        {/* HEADER */}
        <div className="modal-header">
          <h2>Lead Details</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* CONTENT */}
        <div className="modal-content">

          {/* BASIC INFO */}
          <div className="info-card">
            <h3>👤 Basic Info</h3>
            <p><b>Name:</b> {lead.name || "No Name"}</p>
            <p><b>Phone:</b> {lead.phone || "-"}</p>
            <p><b>Email:</b> {lead.email || "No Email"}</p>

            <p>
              <b>Status:</b>{" "}
              <span className={`status ${(lead.status || "new").toLowerCase()}`}>
                {lead.status || "New"}
              </span>
            </p>

            <p><b>Value:</b> ₹{lead.value || 0}</p>
            <p><b>Source:</b> {lead.source || "-"}</p>
<p>
  <b>Next Follow Up:</b>{" "}
  {lead.nextFollowUp
    ? new Date(lead.nextFollowUp).toLocaleString()
    : "No Follow Up"}
</p>
            <p>
              <b>Assigned To:</b>{" "}
              {lead.assignedTo?.name || "Not Assigned"}
            </p>

            <p>
              <b>Created:</b>{" "}
              {lead.createdAt
                ? new Date(lead.createdAt).toLocaleString()
                : "-"}
            </p>
          </div>

          {/* FILE */}
          {fileUrl && (
            <div className="info-card">
              <h3>📁 File</h3>

              <button
                onClick={() => window.open(fileUrl, "_blank")}
                className="preview-btn"
              >
                👁 Preview
              </button>

              <button
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = fileUrl;
                  link.download = lead.file;
                  link.click();
                }}
                className="download-btn"
              >
                ⬇ Download
              </button>
            </div>
          )}

          {/* NOTES */}
          <div className="info-card">
            <h3>📝 Notes</h3>

            {lead.notes?.length > 0 ? (
              lead.notes.map((n, i) => (
                <p key={i}>
                  • {n.text}{" "}
                  <small>
                    ({new Date(n.createdAt).toLocaleString()})
                  </small>
                </p>
              ))
            ) : (
              <p>No Notes</p>
            )}
          </div>
{/* LEAD NOTES COMPONENT */}
<LeadNotes leadId={lead.id} />
          {/* ACTIVITIES */}
          <div className="info-card">
            <h3>📊 Activity History</h3>

            {lead.activities?.length > 0 ? (
              lead.activities.map((a, i) => (
                <p key={i}>
                  • {a.action}{" "}
                  <small>
                    ({new Date(a.createdAt).toLocaleString()})
                  </small>
                </p>
              ))
            ) : (
              <p>No Activity</p>
            )}
          </div>

        </div>
      </div>

      {/* STYLES */}
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-container {
          width: 90%;
          max-width: 700px;
          max-height: 90%;
          background: #fff;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          padding: 15px;
          background: #3b82f6;
          color: #fff;
        }

        .modal-content {
          padding: 15px;
          overflow-y: auto;
        }

        .info-card {
          padding: 10px;
          border: 1px solid #eee;
          border-radius: 8px;
          margin-bottom: 10px;
          background: #f9fafb;
        }

        .preview-btn, .download-btn {
          margin-right: 10px;
          padding: 6px 10px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .preview-btn {
          background: blue;
          color: #fff;
        }

        .download-btn {
          background: green;
          color: #fff;
        }

        .status {
          padding: 2px 8px;
          border-radius: 5px;
          color: #fff;
        }

        .status.new { background: #6366f1; }
        .status.contacted { background: #f59e0b; }
        .status.interested { background: #10b981; }
        .status.closed { background: #ef4444; }
      `}</style>
    </div>
  );
}

export default LeadDetailsModal;