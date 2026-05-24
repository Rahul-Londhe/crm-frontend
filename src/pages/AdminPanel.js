import React, { useEffect, useState } from "react";
import API from "../api/api";


function AdminPanel() {

  const [users, setUsers] = useState([]);

  

  useEffect(() => {

    fetchUsers();

  }, []);

  // ================= FETCH USERS =================
  const fetchUsers = async () => {

    try {

      const res =
  await API.get("/users");

setUsers(
  res.data.users || []
);
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

      await API.put(
  `/users/${id}/role`,
  { role }
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