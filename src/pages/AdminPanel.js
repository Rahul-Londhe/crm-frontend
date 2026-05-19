import React, { useEffect, useState } from "react";

const API = "http://localhost:5000/api";

function AdminPanel() {

  const [users, setUsers] = useState([]);

  const token =
    localStorage.getItem("token");

  useEffect(() => {

    fetchUsers();

  }, []);

  // ================= FETCH USERS =================
  const fetchUsers = async () => {

    try {

      const res = await fetch(
        `${API}/users`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      setUsers(data.users || []);

    } catch (err) {

      console.log(err);

    }

  };

  // ================= UPDATE ROLE =================
  const updateRole = async (
    id,
    role
  ) => {

    try {

      await fetch(
        `${API}/users/${id}/role`,
        {

          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`
          },

          body: JSON.stringify({
            role
          })

        }
      );

      fetchUsers();

    } catch (err) {

      console.log(err);

    }

  };

  return (

    <div>

      <h2>
        👨‍💼 Admin Panel
      </h2>

      {users.map(user => (

        <div
          key={user._id}

          style={{
            marginBottom: 15,
            padding: 10,
            background: "#fff",
            borderRadius: 8
          }}
        >

          <h4>
            {user.name}
          </h4>

          <p>
            {user.email}
          </p>

          <select
            value={user.role}

            onChange={(e) =>
              updateRole(
                user._id,
                e.target.value
              )
            }
          >

            <option value="admin">
              Admin
            </option>

            <option value="employee">
              Employee
            </option>

          </select>

        </div>

      ))}

    </div>

  );

}

export default AdminPanel;