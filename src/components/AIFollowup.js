import React from "react";

function AIFollowup({ lead }) {

  if (!lead) return null;

  const getMessage = () => {

    if (lead.status === "New") {
      return "Hi! Thanks for your interest. We will contact you soon.";
    }

    if (lead.status === "Interested") {
      return "Hi, just checking if you are ready to proceed?";
    }

    if (lead.status === "Closed") {
      return "Thank you for choosing us!";
    }

    return "We will get back to you soon.";
  };

  return (
    <div style={{
      background: "#f0fdf4",
      padding: "10px",
      borderRadius: "8px",
      marginTop: "10px"
    }}>
      <b>🤖 AI Follow-up:</b>
      <p>{getMessage()}</p>
    </div>
  );
}

export default AIFollowup;