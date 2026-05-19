import React, { useState } from "react";

function UserProfile({ user, logout }) {

  const [open, setOpen] = useState(false);

  if (!user) return null;

  return (
    <div style={{
      position: "fixed",
      top: "70px",           // ✅ navbar खाली
      right: "20px",
      zIndex: 2000,          // ✅ navbar पेक्षा वर
      background: "#111",
      color: "#fff",
      padding: "10px",
      borderRadius: "10px",
      width: open ? "220px" : "150px",
      cursor: "pointer",
      boxShadow: "0 0 10px rgba(0,0,0,0.3)"
    }}>

      {/* CLICK AREA */}
      <div onClick={() => setOpen(!open)}>
        👤 {user.name}
      </div>

      {/* DETAILS */}
      {open && (
        <div style={{ marginTop: "10px" }}>
          
          <div>📧 {user.email}</div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              logout();
            }}
            style={{
              marginTop: "10px",
              width: "100%",
              padding: "8px",
              background: "red",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Logout
          </button>

        </div>
      )}

    </div>
  );
}

export default UserProfile;