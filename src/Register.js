import React, { useState } from "react";

import API from "./api/api";

function Register({ setShowRegister }) {
  const [form, setForm] = useState({
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  companyName: "",
  businessType: "",
  logo: null,
  agree: false,
});

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
const [fileKey, setFileKey] = useState(0);
  // ================= INPUT =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= VALIDATION =================
  const validate = () => {
    if (
      !form.businessType.trim()
|| !form.phone.trim() ||
      !form.name.trim() ||
      !form.email.trim() ||
      !form.password.trim() ||
      !form.companyName.trim()
    ) {
      setError("All fields are required");
      return false;
    }
if (!form.agree) {

  setError("Please accept Terms");

  return false;

}
const phonePattern = /^[0-9]{10}$/;

if (!phonePattern.test(form.phone)) {

  setError("Mobile number must be 10 digits");

  return false;

}
    const strongPassword =
  /^(?=.*[A-Z])(?=.*[0-9]).{6,}$/;

if (!strongPassword.test(form.password)) {

  setError(
    "Password must contain 1 Capital Letter and 1 Number"
  );

  return false;
}

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email)) {
      setError("Invalid email format");
      return false;
    }

    setError("");
    return true;
  };

  // ================= REGISTER =================
const register = async () => {

  if (!validate() || loading) return;

  setLoading(true);
  setError("");
  setMessage("");

  try {

    // ✅ FORM DATA
    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("password", form.password);
    formData.append("companyName", form.companyName);
    formData.append("businessType", form.businessType);

    if (form.logo) {
      formData.append("logo", form.logo);
    }

    // ✅ API CALL
    const res = await API.post(
      "/auth/register",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const data = res.data;

    console.log("REGISTER RESPONSE:", data);

    // ✅ EMAIL EXISTS
    if (res.status === 409) {

      setError("Email already exists");

      return;
    }

    // ✅ FAILED
    if (!data.success) {

      setError(data.message || "Registration failed");

      return;
    }

    // ✅ SAVE LOGIN
    localStorage.setItem("token", data.token);

    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    // ✅ SUCCESS
    setMessage(
      "🎉 Company + Admin Created Successfully!"
    );
setFileKey(prev => prev + 1);
    // ✅ RESET FORM
    setForm({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      companyName: "",
      businessType: "",
      logo: null,
      agree: false,
    });

    // ✅ CLOSE
    setTimeout(() => {

      setShowRegister(false);

    }, 1200);

  } catch (err) {

    console.error("Register Error:", err);

    // ✅ AXIOS ERROR
    if (err.response?.status === 409) {

      setError("Email already exists");

    } else {

      setError(
        err.response?.data?.message ||
        "Server error. Please try again."
      );

    }

  } finally {

    setLoading(false);

  }

};
  // ================= ENTER KEY =================
  const handleKey = (e) => {
    if (e.key === "Enter") register();
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Create CRM Account 🚀</h2>

      <input
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        onKeyDown={handleKey}
        style={styles.input}
        autoFocus
      />

      <input
        name="email"
        placeholder="Email Address"
        value={form.email}
        onChange={handleChange}
        onKeyDown={handleKey}
        style={styles.input}
      />
<input
  name="phone"
  placeholder="Mobile Number"
  value={form.phone}
  onChange={handleChange}
  style={styles.input}
/>
      <input
        name="companyName"
        placeholder="Company Name"
        value={form.companyName}
        onChange={handleChange}
        onKeyDown={handleKey}
        style={styles.input}
      />
<select
  name="businessType"
  value={form.businessType}
  onChange={handleChange}
  style={styles.input}
>
  <option value="">Select Business Type</option>

  <option>Real Estate</option>

  <option>Education</option>

  <option>Marketing</option>

  <option>Hospital</option>

  <option>Finance</option>

  <option>Retail Shop</option>

  <option>IT Company</option>

</select>
<input
  key={fileKey}
  type="file"
  accept="image/*"
  onChange={(e) =>
    setForm({
      ...form,
      logo: e.target.files[0]
    })
  }
  style={styles.input}
/>
      <div style={{ position: "relative" }}>
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          onKeyDown={handleKey}
          style={styles.input}
        />
        <span
          style={styles.eye}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "🙈" : "👁️"}
        </span>
      </div>

      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        value={form.confirmPassword}
        onChange={handleChange}
        onKeyDown={handleKey}
        style={styles.input}
      />
<label
  style={{
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "15px",
    fontSize: "14px"
  }}
>
  <input
    type="checkbox"
    checked={form.agree}
    onChange={(e) =>
      setForm({
        ...form,
        agree: e.target.checked
      })
    }
  />

  I agree to Terms & Conditions
</label>
      <button
        onClick={register}
        style={loading ? styles.btnDisabled : styles.btn}
        disabled={loading}
      >
        {loading ? (
  <>
    ⏳ Creating...
  </>
) : (
  "Create Company"
)}
      </button>

      {message && <p style={styles.success}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

// ================= STYLES =================
const styles = {
  container: {
    width: "360px",
    padding: "30px",
    borderRadius: "12px",
    background: "#fff",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    outline: "none",
  },
  btn: {
    width: "100%",
    padding: "12px",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  btnDisabled: {
    width: "100%",
    padding: "12px",
    background: "#9ca3af",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "not-allowed",
  },
  success: {
    color: "green",
    marginTop: "10px",
  },
  error: {
    color: "red",
    marginTop: "10px",
  },
  eye: {
    position: "absolute",
    right: "10px",
    top: "12px",
    cursor: "pointer",
  },
};

export default Register;