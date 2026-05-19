import React, {
  useEffect,
  useState
} from "react";

import API from "../api/api";

function AttendancePage() {

  const [employees, setEmployees] =
    useState([]);

  const [attendance, setAttendance] =
    useState([]);

  // ================= LOAD EMPLOYEES =================
  const loadEmployees = async () => {

    try {

      const res =
        await API.get("/employees");

      setEmployees(
        res.data.employees || []
      );

    } catch (err) {

      console.log(err);

    }

  };

  // ================= LOAD ATTENDANCE =================
  const loadAttendance = async () => {

    try {

      const res =
        await API.get("/attendance");

      setAttendance(
        res.data.attendance || []
      );

    } catch (err) {

      console.log(err);

    }

  };

  useEffect(() => {

    loadEmployees();
    loadAttendance();

  }, []);

  // ================= CHECK IN =================
  const checkIn = async (id) => {

    try {

      await API.post(
        "/attendance/checkin",
        {
          employeeId: id
        }
      );

      loadAttendance();

    } catch (err) {

      console.log(err);

    }

  };

  // ================= CHECK OUT =================
  const checkOut = async (id) => {

    try {

      await API.put(
        `/attendance/checkout/${id}`
      );

      loadAttendance();

    } catch (err) {

      console.log(err);

    }

  };

  return (

    <div style={{ padding: 20 }}>

      <h2>
        📅 Attendance Management
      </h2>

      <hr />

      <h3>Employees</h3>

      {employees.map((emp) => (

        <div
          key={emp._id}
          style={{
            background: "#fff",
            padding: 15,
            marginBottom: 10,
            borderRadius: 10
          }}
        >

          <h3>{emp.name}</h3>

          <p>{emp.email}</p>

          <button
            onClick={() =>
              checkIn(emp._id)
            }
          >
            Check In
          </button>

        </div>

      ))}

      <hr />

      <h3>Attendance Records</h3>

      {attendance.map((a) => (

        <div
          key={a._id}
          style={{
            background: "#fff",
            padding: 15,
            marginBottom: 10,
            borderRadius: 10
          }}
        >

          <h3>
            {a.employee?.name}
          </h3>

          <p>
            Date: {a.date}
          </p>

          <p>
            Check In:
            {a.checkIn}
          </p>

          <p>
            Check Out:
            {a.checkOut || "Pending"}
          </p>

          {!a.checkOut && (

            <button
              onClick={() =>
                checkOut(a._id)
              }
            >
              Check Out
            </button>

          )}

        </div>

      ))}

    </div>

  );

}

export default AttendancePage;