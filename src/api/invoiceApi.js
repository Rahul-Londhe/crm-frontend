import axios from "axios";


// ================= BASE API =================
const API = axios.create({
  baseURL:
    process.env.REACT_APP_API ||
    "http://localhost:5000/api",

  timeout: 15000,
});

// ================= TOKEN =================
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");

    if (token && token !== "undefined" && token !== "null") {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => Promise.reject(error)
);

// ================= RESPONSE HANDLE =================
API.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API ERROR:", err?.response?.data || err.message);

    if (err?.response?.status === 401) {
      localStorage.clear();
      alert("Session expired, login again");
      window.location.href = "/";
    }

    return Promise.reject(err);
  }
);

// ================= GET INVOICES =================
export const getInvoices = async () => {
  try {
    const res = await API.get("/invoices");

    return {
      success: res.data?.success ?? false,
      invoices: Array.isArray(res.data?.invoices)
        ? res.data.invoices
        : [],
    };

  } catch (err) {
    return {
      success: false,
      invoices: [],
    };
  }
};

// ================= CREATE INVOICE =================
export const createInvoice = async (data) => {
  try {
    if (!data.invoiceNumber || !data.lead) {
      return {
        success: false,
        message: "Invoice Number and Lead required"
      };
    }

    const payload = {
      invoiceNumber: data.invoiceNumber,
      lead: data.lead,
      amount: Number(data.amount),
      dueDate: data.dueDate || null
    };

    console.log("CREATE INVOICE:", payload);

    const res = await API.post("/invoices", payload);

    return res.data;

  } catch (err) {
    console.error("Create Error:", err?.response?.data || err.message);

    return {
      success: false,
      message: err?.response?.data?.message || "Create failed",
    };
  }
};

// ================= ADD PAYMENT (🔥 FIXED) =================
export const addPayment = async (invoiceId, data) => {
  try {
    if (!invoiceId) {
      return { success: false, message: "Invoice ID missing" };
    }

    const payload = {
      amount: Number(data.amount),
      method: data.method || "Cash"
    };

    console.log("ADD PAYMENT:", { invoiceId, payload });

    // ✅ FIXED ROUTE
    const res = await API.post(`/invoices/${invoiceId}/payment`, payload);

    return res.data;

  } catch (err) {
    console.error("Payment Error:", err?.response?.data || err.message);

    return {
      success: false,
      message: err?.response?.data?.message || "Payment failed",
    };
  }
};

// ================= DELETE =================
export const deleteInvoice = async (id) => {
  try {
    if (!id) {
      return { success: false, message: "Invalid ID" };
    }

    const res = await API.delete(`/invoices/${id}`);
    return res.data;

  } catch (err) {
    console.error("Delete Error:", err?.response?.data || err.message);

    return {
      success: false,
      message: err?.response?.data?.message || "Delete failed",
    };
  }
};

// ================= PDF DOWNLOAD =================
export const downloadInvoicePDF = async (id) => {
  try {
    if (!id) {
      alert("Invalid invoice ID");
      return;
    }

    const res = await API.get(`/invoices/${id}/pdf`, {
      responseType: "blob",
    });

    const blob = new Blob([res.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice_${id}.pdf`;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

  } catch (err) {
    console.error("PDF Error:", err?.response?.data || err.message);
    alert("Failed to download PDF");
  }
};

// ================= REMINDER =================
export const sendReminder = async (id) => {
  try {
    if (!id) {
      return { success: false, message: "Invalid ID" };
    }

    const res = await API.post(`/invoices/${id}/reminder`);
    return res.data;

  } catch (err) {
    console.error("Reminder Error:", err?.response?.data || err.message);

    return {
      success: false,
      message: "Reminder feature not available",
    };
  }
};

export default API;