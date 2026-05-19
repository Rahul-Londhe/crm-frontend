import React, {
  useEffect,
  useState
} from "react";

import API from "../api/api";

function LeavePage() {

  const [employees, setEmployees] =
    useState([]);

  const [leaves, setLeaves] =
    useState([]);

  const [form, setForm] =
    useState({

      employee: "",
      reason: "",
      fromDate: "",
      toDate: ""

    });

  // ================= LOAD EMPLOYEES =================

  const loadEmployees =
    async () => {

      const res =
        await API.get("/employees");

      setEmployees(
        res.data.employees || []
      );

    };

  // ================= LOAD LEAVES =================

  const loadLeaves =
    async () => {

      const res =
        await API.get("/leaves");

      setLeaves(
        res.data.leaves || []
      );

    };

  useEffect(() => {

    loadEmployees();
    loadLeaves();

  }, []);

  // ================= APPLY =================

  const applyLeave =
    async () => {

      await API.post(
        "/leaves",
        form
      );

      setForm({

        employee: "",
        reason: "",
        fromDate: "",
        toDate: ""

      });

      loadLeaves();

    };

  // ================= UPDATE =================

  const updateStatus =
    async (id, status) => {

      await API.put(
        `/leaves/${id}`,
        { status }
      );

      loadLeaves();

    };

  return (

    <div style={{ padding: 20 }}>

      <h2>
        🌴 Leave Management
      </h2>

      <select
        value={form.employee}
        onChange={(e) =>
          setForm({
            ...form,
            employee:
              e.target.value
          })
        }
      >

        <option value="">
          Select Employee
        </option>

        {employees.map((e) => (

          <option
            key={e._id}
            value={e._id}
          >
            {e.name}
          </option>

        ))}

      </select>

      <br /><br />

      <input
        placeholder="Reason"
        value={form.reason}
        onChange={(e) =>
          setForm({
            ...form,
            reason:
              e.target.value
          })
        }
      />

      <br /><br />

      <input
        type="date"
        value={form.fromDate}
        onChange={(e) =>
          setForm({
            ...form,
            fromDate:
              e.target.value
          })
        }
      />

      <br /><br />

      <input
        type="date"
        value={form.toDate}
        onChange={(e) =>
          setForm({
            ...form,
            toDate:
              e.target.value
          })
        }
      />

      <br /><br />

      <button
        onClick={applyLeave}
      >
        Apply Leave
      </button>

      <hr />

      {leaves.map((l) => (

        <div
          key={l._id}
          style={{
            background: "#fff",
            padding: 15,
            marginBottom: 10,
            borderRadius: 10
          }}
        >

          <h3>
            {l.employee?.name}
          </h3>

          <p>
            {l.reason}
          </p>

          <p>
            {l.fromDate}
            {" "}to{" "}
            {l.toDate}
          </p>

          <p>
            {l.status}
          </p>

          <button
            onClick={() =>
              updateStatus(
                l._id,
                "Approved"
              )
            }
          >
            Approve
          </button>

          <button
            onClick={() =>
              updateStatus(
                l._id,
                "Rejected"
              )
            }
          >
            Reject
          </button>

        </div>

      ))}

    </div>

  );

}

export default LeavePage;