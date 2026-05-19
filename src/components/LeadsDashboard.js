import React from "react";

function LeadsDashboard({ leads }) {

  const totalLeads = leads.length;

  const newLeads = leads.filter(l => l.status === "New").length;
  const contacted = leads.filter(l => l.status === "Contacted").length;
  const closed = leads.filter(l => l.status === "Closed").length;

  return (
    <div style={{display:"flex",gap:"20px",marginBottom:"20px"}}>

      <div style={{padding:"20px",background:"#f1f1f1",borderRadius:"8px"}}>
        <h3>Total Leads</h3>
        <h2>{totalLeads}</h2>
      </div>

      <div style={{padding:"20px",background:"#d1ecf1",borderRadius:"8px"}}>
        <h3>New Leads</h3>
        <h2>{newLeads}</h2>
      </div>

      <div style={{padding:"20px",background:"#fff3cd",borderRadius:"8px"}}>
        <h3>Contacted</h3>
        <h2>{contacted}</h2>
      </div>

      <div style={{padding:"20px",background:"#d4edda",borderRadius:"8px"}}>
        <h3>Closed</h3>
        <h2>{closed}</h2>
      </div>

    </div>
  );
}

export default LeadsDashboard;