import React, { useState, useEffect, useMemo, useCallback } from "react";
import API from "./api/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import LeadsList from "./LeadsList";
import LeadForm from "./LeadForm";
import LeadDetailsModal from "./LeadDetailsModal";
import LeadsDashboard from "./LeadsDashboard";
import NotificationBell from "./components/NotificationBell";
import FollowUpReminder from "./components/FollowUpReminder";


// ✅ TOKEN ATTACH (SAFE)


function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ================= FETCH =================
  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/leads");

      console.log("LEADS RESPONSE:", res.data); // ✅ DEBUG

      if (res.data.success) {
        setLeads(res.data.leads || []);
      } else {
        setLeads([]);
      }

    } catch (err) {
      console.error("FETCH ERROR:", err.response?.data || err.message);

      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        localStorage.clear();
        window.location.reload();
      } else {
        setError("Failed to load leads");
      }

      setLeads([]);

    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {

  fetchLeads();

  const interval = setInterval(() => {
    fetchLeads();
  }, 20000);

  return () => clearInterval(interval);

}, [fetchLeads]);
// ================= WHATSAPP =================
const sendWhatsApp = async (lead) => {
  try {
    await API.post("/whatsapp/send-message", {
      phone: lead.phone,
      message: `Hello ${lead.name}, we have an update for you.`
    });

    setMessage("✅ WhatsApp message sent");

  } catch (err) {
    console.error("WHATSAPP ERROR:", err.response?.data || err.message);
    setError("❌ Failed to send WhatsApp");
  }
};

// ================= EMAIL =================
const sendEmail = async (lead) => {
  try {
    await API.post("/email/send", {
      email: lead.email,
      subject: "Regarding your inquiry",
      message: `Hello ${lead.name}, thank you for your interest.`
    });

    setMessage("✅ Email sent successfully");

  } catch (err) {
    console.error("EMAIL ERROR:", err.response?.data || err.message);
    setError("❌ Failed to send Email");
  }
};
  // ================= SEARCH =================
  const filteredLeads = useMemo(() => {
    return leads.filter((l) =>
      `${l.name || ""} ${l.email || ""} ${l.phone || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [leads, search]);

  // ================= DELETE REFRESH =================
  const handleLeadsUpdate = () => {
    fetchLeads(); // 🔥 FORCE REFRESH
  };


// ================= EXPORT PDF =================

const exportPDF = () => {

  const doc = new jsPDF();

  // TITLE
  doc.text(
    "CRM Leads Report",
    14,
    10
  );

  // TABLE
  autoTable(doc, {

    head: [[
      "Name",
      "Phone",
      "Email",
      "Status"
    ]],

    body: leads.map((lead) => [

      lead.name || "",

      lead.phone || "",

      lead.email || "",

      lead.status || ""

    ])

  });

  // SAVE PDF
  doc.save("crm-leads-report.pdf");

};

// ================= EXPORT EXCEL =================

const exportExcel = async () => {

  try {

    const res = await API.get(
      "/leads/export",
      {
        responseType: "blob"
      }
    );

    const url =
      window.URL.createObjectURL(
        new Blob([res.data])
      );

    const link =
      document.createElement("a");

    link.href = url;

    link.setAttribute(
      "download",
      "leads.xlsx"
    );

    document.body.appendChild(link);

    link.click();

  } catch (err) {

    console.error(
      "EXPORT ERROR:",
      err.response?.data || err.message
    );

    setError("❌ Export failed");

  }

};
  return (
  <div style={{ padding: "20px" }}>
    
    {/* ✅ ADD THIS */}
    <LeadsDashboard />

    <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "20px"
  }}
>
  <h2>🚀 Leads</h2>

  <NotificationBell />
  <FollowUpReminder />
</div>

      {/* MESSAGE */}
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* SEARCH */}
      <input
  placeholder="🔍 Search Leads..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  style={{
    marginRight: "10px",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    width: "100%",
maxWidth: "300px",
    outline: "none"
  }}
/>

      {/* ADD BUTTON */}
   <div
  style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "15px",
    marginBottom: "15px"
  }}
>

<button
  onClick={() => setShowForm(true)}
  style={{
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold"
  }}
>
  + Add Lead
</button>

<button
  onClick={exportExcel}
  style={{
    background: "#16a34a",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "10px",
    cursor: "pointer"
  }}
>
  📥 Export Excel
</button>

<button
  onClick={exportPDF}
  style={{
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "10px",
    cursor: "pointer"
  }}
>
  📄 Export PDF
</button>

</div>
<h3 style={{ marginTop: "20px" }}>
  Total Leads: {filteredLeads.length}
</h3>
      {/* LIST */}
      {loading ? (
        <h3 style={{ color: "#2563eb" }}>
  🚀 Loading Leads...
</h3>
      ) : filteredLeads.length === 0 ? (
        <h3>No Leads Found</h3>
      ) : (
        <LeadsList
  leads={filteredLeads}
  setLeads={setLeads}
  onSelect={setSelectedLead}
  refreshLeads={handleLeadsUpdate}
  onWhatsApp={sendWhatsApp}   // ✅ ADD
  onEmail={sendEmail}         // ✅ ADD
/>
      )}

      {/* MODAL */}
      {selectedLead && (
        <LeadDetailsModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}

      {/* FORM */}
      {showForm && (
        <LeadForm
          onClose={() => setShowForm(false)}
          onSave={() => {

  fetchLeads();

  setMessage("✅ Lead Added Successfully");

  // 🔔 SOUND
  window.dispatchEvent(
    new Event("crm-notification")
  );

  // 🔥 LIVE POPUP
  window.dispatchEvent(
    new CustomEvent(
      "crm-popup",
      {
        detail: "New Lead Added Successfully"
      }
    )
  );

  setTimeout(() => {

    setMessage("");

  }, 2000);

}}
        />
      )}
    </div>
  );
}

export default Leads;