import React, {
  useEffect,
  useState
} from "react";
import "../styles/dashboard.css";
import API from "../api/api";

function EmployeePage() {

  const [employees, setEmployees] =
    useState([]);

  const [form, setForm] =
    useState({

      name: "",
      email: "",
      phone: "",
      role: ""

    });

  // ================= LOAD =================

  const loadEmployees =
    async () => {

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

  useEffect(() => {

    loadEmployees();

  }, []);

  // ================= HANDLE =================

  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value

    });

  };

  // ================= ADD =================

  const addEmployee =
    async () => {

      try {

        console.log("FORM:", form);

        await API.post(
          "/employees",
          form
        );

        alert(
          "Employee Added"
        );

        setForm({

          name: "",
          email: "",
          phone: "",
          role: ""

        });

        loadEmployees();

      } catch (err) {

        console.log(err);

        alert(
          err.response?.data?.message
        );

      }

    };

  // ================= DELETE =================

  const deleteEmployee =
    async (id) => {

      try {

        await API.delete(
          `/employees/${id}`
        );

        loadEmployees();

      } catch (err) {

        console.log(err);

      }

    };

  return (

  <div className="dashboard-page">

    <h1 className="dashboard-title">
      👨‍💼 Employees
    </h1>

    <div className="dashboard-table">

      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) =>
          setForm({
            ...form,
            name: e.target.value
          })
        }
      />

      <input
        placeholder="Email"
        value={form.email}
        onChange={(e) =>
          setForm({
            ...form,
            email: e.target.value
          })
        }
      />

      <button
        type="button"
        onClick={addEmployee}
      >
        Add Employee
      </button>

      <hr />

      {employees.map(emp => (

        <div
          key={emp._id}
          className="dashboard-card"
          style={{
            marginBottom: 15
          }}
        >

          <h3>{emp.name}</h3>

          <p>{emp.email}</p>

          <p>{emp.role}</p>

        </div>

      ))}

    </div>

  </div>

);

}

export default EmployeePage;