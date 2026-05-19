import React, {
  useEffect,
  useState
} from "react";
import "../styles/dashboard.css";
import API from "../api/api";

function EmployeeDashboard() {

  const [attendance, setAttendance] =
    useState([]);

  const [leaves, setLeaves] =
    useState([]);

  const [payrolls, setPayrolls] =
    useState([]);

  // ================= LOAD =================

  const loadData =
    async () => {

      try {

        const att =
          await API.get("/attendance");

        const lev =
          await API.get("/leaves");

        const pay =
          await API.get("/payroll");

        setAttendance(
          att.data.attendance || []
        );

        setLeaves(
          lev.data.leaves || []
        );

        setPayrolls(
          pay.data.payrolls || []
        );

      } catch (err) {

        console.log(err);

      }

    };

  useEffect(() => {

    loadData();

  }, []);

  return (

  <div className="dashboard-page">

    <h1 className="dashboard-title">
      👨‍💼 Employee Dashboard
    </h1>

    <div className="dashboard-grid">

      <div className="dashboard-card">
        <h3>Attendance</h3>
        <h1>{attendance.length}</h1>
      </div>

      <div className="dashboard-card">
        <h3>Leaves</h3>
        <h1>{leaves.length}</h1>
      </div>

      <div className="dashboard-card">
        <h3>Payroll</h3>
        <h1>{payrolls.length}</h1>
      </div>

    </div>

  </div>

);

}

const styles = {

  card: {

    background: "#fff",

    padding: 20,

    marginBottom: 20,

    borderRadius: 10,

    boxShadow:
      "0 2px 10px rgba(0,0,0,0.1)"

  }

};

export default EmployeeDashboard;