import React, {
  useEffect,
  useState
} from "react";

import API from "../api/api";

function PayrollPage() {

  const [employees, setEmployees] =
    useState([]);

  const [payrolls, setPayrolls] =
    useState([]);

  const [form, setForm] =
    useState({

      employee: "",
      month: "",
      basicSalary: "",
      bonus: "",
      deduction: ""

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

  // ================= LOAD PAYROLL =================

  const loadPayrolls =
    async () => {

      const res =
        await API.get("/payroll");

      setPayrolls(
        res.data.payrolls || []
      );

    };

  useEffect(() => {

    loadEmployees();
    loadPayrolls();

  }, []);

  // ================= CREATE =================

  const createPayroll =
    async () => {

      await API.post(
        "/payroll",
        form
      );

      setForm({

        employee: "",
        month: "",
        basicSalary: "",
        bonus: "",
        deduction: ""

      });

      loadPayrolls();

    };

  // ================= PAY =================

  const markPaid =
    async (id) => {

      await API.put(
        `/payroll/${id}`,
        {
          status: "Paid"
        }
      );

      loadPayrolls();

    };

  return (

    <div style={{ padding: 20 }}>

      <h2>
        💰 Payroll System
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
        placeholder="Month"
        value={form.month}
        onChange={(e) =>
          setForm({
            ...form,
            month:
              e.target.value
          })
        }
      />

      <br /><br />

      <input
        type="number"
        placeholder="Basic Salary"
        value={form.basicSalary}
        onChange={(e) =>
          setForm({
            ...form,
            basicSalary:
              e.target.value
          })
        }
      />

      <br /><br />

      <input
        type="number"
        placeholder="Bonus"
        value={form.bonus}
        onChange={(e) =>
          setForm({
            ...form,
            bonus:
              e.target.value
          })
        }
      />

      <br /><br />

      <input
        type="number"
        placeholder="Deduction"
        value={form.deduction}
        onChange={(e) =>
          setForm({
            ...form,
            deduction:
              e.target.value
          })
        }
      />

      <br /><br />

      <button
        onClick={createPayroll}
      >
        Create Payroll
      </button>

      <hr />

      {payrolls.map((p) => (

        <div
          key={p._id}
          style={{
            background: "#fff",
            padding: 15,
            marginBottom: 10,
            borderRadius: 10
          }}
        >

          <h3>
            {p.employee?.name}
          </h3>

          <p>
            Month:
            {p.month}
          </p>

          <p>
            Salary:
            ₹{p.basicSalary}
          </p>

          <p>
            Bonus:
            ₹{p.bonus}
          </p>

          <p>
            Deduction:
            ₹{p.deduction}
          </p>

          <p>
            Final:
            ₹{p.finalSalary}
          </p>

          <p>
            Status:
            {p.status}
          </p>

          {p.status !== "Paid" && (

            <button
              onClick={() =>
                markPaid(p._id)
              }
            >
              Mark Paid
            </button>

          )}

        </div>

      ))}

    </div>

  );

}

export default PayrollPage;