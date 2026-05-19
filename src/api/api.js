import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API || "http://localhost:5000/api",
  timeout: 10000
});

// ✅ AUTO TOKEN ATTACH
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token && token !== "undefined" && token !== "null") {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// ✅ AUTO HANDLE ERROR (IMPORTANT)
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      console.log("❌ Token Expired → Logout");

      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default API;