import React, { useState } from "react";

const API = process.env.REACT_APP_API || "http://localhost:5000/api";

function Register({ setShowRegister }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ================= INPUT =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= VALIDATION =================
  const validate = () => {
    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.password.trim() ||
      !form.companyName.trim()
    ) {
      setError("All fields are required");
      return false;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
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
      const res = await fetch(`${API}/auth/register`, {   // ✅ FIXED
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.toLowerCase().trim(),
          password: form.password.trim(),
          companyName: form.companyName.trim(),
        }),
      });

      // ✅ SAFE JSON PARSE (fix unexpected < error)
      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Server returned HTML instead of JSON");
      }

      if (!res.ok || !data.success) {
        setError(data.message || "Registration failed");
        return;
      }

      // ✅ SUCCESS
localStorage.setItem("token", data.token);   // ⭐ IMPORTANT
localStorage.setItem("user", JSON.stringify(data.user));

setMessage("🎉 Company + Admin Created Successfully!");

      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        companyName: "",
      });

      setTimeout(() => {
        setShowRegister(false);
      }, 1200);

    } catch (err) {
      console.error("Register Error:", err);
      setError(err.message || "Server error. Please try again.");
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
        name="companyName"
        placeholder="Company Name"
        value={form.companyName}
        onChange={handleChange}
        onKeyDown={handleKey}
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

      <button
        onClick={register}
        style={loading ? styles.btnDisabled : styles.btn}
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Company"}
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