import React, { useEffect, useState } from "react";

const API = "http://localhost:5000/api";

function AssignLead({ leadId }) {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.log(err);
    }
  };

  const assignLead = async (userId) => {
    try {
      await fetch(`${API}/leads/assign/${leadId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId })
      });

      alert("Lead Assigned ✅");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <select onChange={(e) => assignLead(e.target.value)}>
        <option>Select Employee</option>
        {users.map(u => (
          <option key={u._id} value={u._id}>
            {u.name} ({u.role})
          </option>
        ))}
      </select>
    </div>
  );
}

export default AssignLead;