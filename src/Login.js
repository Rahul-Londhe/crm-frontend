import React, { useState } from "react";

const API = process.env.REACT_APP_API || "http://localhost:5000/api";

function Login({ setUser, setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ================= VALIDATION =================
  const validate = () => {
    if (!email.trim() || !password.trim()) {
      setError("Email and Password are required");
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Invalid email format");
      return false;
    }

    setError("");
    return true;
  };

  // ================= LOGIN =================
  const handleLogin = async (e) => {
    if (e) e.preventDefault();

    if (!validate() || loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      console.log("LOGIN RESPONSE:", data);
console.log("TOKEN:", data.token); // ✅ ADD
      if (data.success && data.token) {
        // ✅ STORE DATA
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // ✅ UPDATE STATE
        setUser(data.user);
        setToken(data.token);

        console.log("TOKEN SAVED:", data.token);

        // ✅ FORCE UI UPDATE (IMPORTANT)
        window.location.reload();

      } else {
        setError(data.message || "Login Failed");
      }

    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setError("Server Error");
    } finally {
      setLoading(false);
    }
  };

  // ================= ENTER KEY =================
  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>CRM Login</h2>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={handleKeyPress}
        style={styles.input}
        autoFocus
      />

      <div style={{ position: "relative" }}>
        <input
          type={showPass ? "text" : "password"}
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyPress}
          style={styles.input}
        />

        <span onClick={() => setShowPass(!showPass)} style={styles.eye}>
          {showPass ? "🙈" : "👁"}
        </span>
      </div>

      <button
        onClick={handleLogin}
        style={loading ? styles.btnDisabled : styles.btn}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

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
    background: "#2563eb",
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

export default Login;