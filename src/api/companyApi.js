import axios from "axios";
const BASE_URL =
  process.env.REACT_APP_API ||
  "http://localhost:5000/api";

// ================= AXIOS INSTANCE =================
const API = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ================= REQUEST INTERCEPTOR =================
// 👉 Automatically attach token
API.interceptors.request.use(
  (req) => {
    try {
      const token = localStorage.getItem("token");

      if (token && token !== "undefined" && token !== "null") {
        req.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.error("Token Error:", err);
    }

    return req;
  },
  (error) => Promise.reject(error)
);

// ================= RESPONSE INTERCEPTOR =================
// 👉 Global error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🔴 Unauthorized → auto logout
    if (error.response && error.response.status === 401) {
      console.warn("Session expired. Logging out...");
      localStorage.clear();
      window.location.reload();
    }

    // 🔴 Server error
    if (error.response && error.response.status >= 500) {
      console.error("Server Error:", error.response.data);
    }

    return Promise.reject(error);
  }
);

// ================= COMPANY APIs =================
export const createCompany = async (data) => {
  try {
    const res = await API.post("/company", data);
    return res.data;
  } catch (err) {
    console.error("Create Company Error:", err);
    throw err;
  }
};

export const getCompanies = async () => {
  try {
    const res = await API.get("/company");
    return res.data;
  } catch (err) {
    console.error("Get Companies Error:", err);
    throw err;
  }
};

// ================= EXPORT =================
export default API;