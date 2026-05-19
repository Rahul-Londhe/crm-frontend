import React, {
  useEffect,
  useState
} from "react";
import "../styles/dashboard.css";
import API from "../api/api";

function HRDashboard() {

  const [employees, setEmployees] =
    useState([]);

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

        const emp =
          await API.get("/employees");

        const att =
          await API.get("/attendance");

        const lev =
          await API.get("/leaves");

        const pay =
          await API.get("/payroll");

        setEmployees(
          emp.data.employees || []
        );

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

  // ================= CALCULATIONS =================

  const totalEmployees =
    employees.length;

  const presentToday =
    attendance.filter(
      (a) =>
        a.status === "Present"
    ).length;

  const pendingLeaves =
    leaves.filter(
      (l) =>
        l.status === "Pending"
    ).length;

  const paidSalary =
    payrolls.filter(
      (p) =>
        p.status === "Paid"
    ).length;

  const pendingSalary =
    payrolls.filter(
      (p) =>
        p.status !== "Paid"
    ).length;

  // ================= UI =================

  return (

  <div className="dashboard-page">

    <h1 className="dashboard-title">
      👨‍💼 HR Dashboard
    </h1>

    <div className="dashboard-grid">

      <div className="dashboard-card">
        <h3>Total Employees</h3>
        <h1>{totalEmployees}</h1>
      </div>

      <div className="dashboard-card">
        <h3>Present Today</h3>
        <h1>{presentToday}</h1>
      </div>

      <div className="dashboard-card">
        <h3>Pending Leaves</h3>
        <h1>{pendingLeaves}</h1>
      </div>

      <div className="dashboard-card">
        <h3>Paid Salary</h3>
        <h1>{paidSalary}</h1>
      </div>

      <div className="dashboard-card">
        <h3>Pending Salary</h3>
        <h1>{pendingSalary}</h1>
      </div>

    </div>

  </div>

);

}

const styles = {

  card: {

    background: "#fff",

    padding: 20,

    borderRadius: 12,

    boxShadow:
      "0 2px 10px rgba(0,0,0,0.1)",

    textAlign: "center"

  }

};

export default HRDashboard;