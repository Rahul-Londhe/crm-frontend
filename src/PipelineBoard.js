import React, { useEffect, useState, useMemo, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import LeadDetailsModal from "./LeadDetailsModal";

const API = process.env.REACT_APP_API || "http://localhost:5000/api";

const columns = ["New", "Contacted", "Interested", "Closed"];

function PipelineBoard() {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= TOKEN =================
  const getToken = () => {
    try {
      const t = localStorage.getItem("token");
      return t && t !== "undefined" && t !== "null" ? t : null;
    } catch {
      return null;
    }
  };

  // ================= FETCH =================
  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();
      if (!token) {
        setError("Login required");
        return;
      }

      const res = await fetch(`${API}/leads`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data?.success && Array.isArray(data.leads)) {
        const fixed = data.leads.map((l) => ({
          ...l,
          _id: l._id || l.id || Math.random().toString(),
          status: columns.includes(l.status) ? l.status : "New",
          value: Number(l.value) || 0,
        }));

        setLeads(fixed);
      } else {
        setLeads([]);
      }
    } catch (err) {
      console.error("Fetch Error:", err.message);
      setError("Failed to load pipeline");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // ================= GROUP =================
  const grouped = useMemo(() => {
    const map = columns.reduce((acc, col) => ({ ...acc, [col]: [] }), {});
    leads.forEach((l) => {
      const status = columns.includes(l.status) ? l.status : "New";
      map[status].push(l);
    });
    return map;
  }, [leads]);

  // ================= DRAG =================
  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const leadId = result.draggableId;
    const newStatus = result.destination.droppableId;

    if (!leadId) return;

    const oldLeads = [...leads];

    // ✅ Optimistic UI update
    setLeads((prev) =>
      prev.map((l) =>
        l._id.toString() === leadId
          ? { ...l, status: newStatus }
          : l
      )
    );

    try {
      const token = getToken();

      await fetch(`${API}/leads/${leadId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error("Drag Error:", err.message);

      // ❌ rollback if failed
      setLeads(oldLeads);
      alert("Failed to update status");
    }
  };

  // ================= FORMAT =================
  const formatCurrency = (num) =>
    new Intl.NumberFormat("en-IN").format(num || 0);

  // ================= COLOR =================
  const getStatusColor = (status) => {
    switch (status) {
      case "New":
        return "#3b82f6";
      case "Contacted":
        return "#f59e0b";
      case "Interested":
        return "#10b981";
      case "Closed":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  // ================= UI =================
  if (loading) {
    return <h3 style={{ padding: 20 }}>⏳ Loading Pipeline...</h3>;
  }

  if (error) {
    return (
      <div style={{ padding: 20 }}>
        <h3 style={{ color: "red" }}>{error}</h3>
        <button onClick={fetchLeads} style={retryBtn}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div style={container}>
        <DragDropContext onDragEnd={onDragEnd}>
          {columns.map((col) => (
            <Droppable droppableId={col} key={col}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={columnStyle}
                >
                  <h3
  style={{
    textAlign: "center",
    color: "#111827",
    fontSize: "20px",
    marginBottom: "15px",
    background: "#fff",
    padding: "10px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
  }}
>
  {col} ({grouped[col].length})
</h3>

                  {grouped[col].length === 0 && (
                    <p style={emptyText}>No leads</p>
                  )}

                  {grouped[col].map((lead, index) => (
                    <Draggable
                      key={lead._id}
                      draggableId={lead._id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => setSelectedLead(lead)}
                          style={{
                            ...cardStyle,
                            ...provided.draggableProps.style,
                          }}
                        >
                          <div style={{
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
}}>
  <strong style={{
    fontSize: "16px",
    color: "#111827"
  }}>
    {lead.name || "No Name"}
  </strong>

  <span style={{
    background:
      lead.temperature === "Hot"
        ? "#dc2626"
        : lead.temperature === "Warm"
        ? "#f59e0b"
        : "#6b7280",

    color: "#fff",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "bold"
  }}>
    {lead.temperature || "Cold"}
  </span>
</div>

<p style={{ marginTop: "10px" }}>
  📞 {lead.phone || "-"}
</p>

<p>
  💰 ₹{formatCurrency(lead.value)}
</p>

<p style={meta}>
  🌐 {lead.source || "Manual"}
</p>

{lead.assignedTo?.name && (
  <p style={{
    fontSize: "12px",
    color: "#2563eb",
    fontWeight: "bold"
  }}>
    👤 {lead.assignedTo.name}
  </p>
)}

{lead.nextFollowUp &&
 new Date(lead.nextFollowUp) < new Date() && (
  <div style={{
    background: "#fee2e2",
    color: "#dc2626",
    padding: "6px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "bold",
    marginTop: "8px"
  }}>
    ⚠ Follow Up Pending
  </div>
)}
                          <span
                            style={{
                              color: getStatusColor(lead.status),
                              fontWeight: "bold",
                              fontSize: "12px",
                            }}
                          >
                            {lead.status}
                          </span>
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>

      {/* MODAL */}
      {selectedLead && (
        <LeadDetailsModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}
    </>
  );
}

// ================= STYLES =================
const container = {
  display: "flex",
  gap: "25px",
  padding: "25px",
  overflowX: "auto",
  background: "#f1f5f9",
  minHeight: "100vh"
};

const columnStyle = {
  background: "linear-gradient(to bottom, #f8fafc, #e2e8f0)",
  padding: "15px",
  width: "320px",
  minHeight: "550px",
  borderRadius: "18px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
  border: "1px solid #dbeafe",
  flexShrink: 0
};

const cardStyle = {
  padding: "15px",
  margin: "12px 0",
  background: "#ffffff",
  borderRadius: "16px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
  cursor: "pointer",
  transition: "0.3s",
  borderLeft: "6px solid #2563eb"
};

const meta = {
  fontSize: "12px",
  color: "#666",
};

const emptyText = {
  color: "#999",
  textAlign: "center",
  marginTop: "20px",
};

const retryBtn = {
  padding: "10px 15px",
  border: "none",
  background: "#2563eb",
  color: "#fff",
  borderRadius: "6px",
  cursor: "pointer",
};

export default PipelineBoard;