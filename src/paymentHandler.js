import API from "./api/invoiceApi";

let isProcessing = false;

// ================= LOAD RAZORPAY =================
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);

    const existing = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existing) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

// ================= MAIN PAYMENT =================
const handlePayment = async ({ amount, invoiceId, customer, onSuccess }) => {
  try {
    if (isProcessing) return;

    isProcessing = true;

    console.log("PAYMENT INIT:", { amount, invoiceId, customer });

    // ================= VALIDATION =================
    if (!amount || Number(amount) <= 0) {
      alert("Invalid payment amount ❌");
      isProcessing = false;
      return;
    }

    if (!invoiceId || typeof invoiceId !== "string") {
      alert("Invalid invoice ❌");
      isProcessing = false;
      return;
    }

    // ================= LOAD SDK =================
    const isLoaded = await loadRazorpayScript();

    if (!isLoaded) {
      alert("Razorpay failed to load ❌");
      isProcessing = false;
      return;
    }

    // ================= CREATE ORDER =================
    const orderRes = await API.post("/payment/create-order", {
      amount: Number(amount)
    });

    console.log("ORDER RESPONSE:", orderRes.data);

    const order = orderRes.data;

    if (!order?.id) {
      alert("Order creation failed ❌");
      isProcessing = false;
      return;
    }

    // ================= OPTIONS =================
    const options = {
      key: "rzp_test_SZfoGdFw1Pa3mL",
      amount: order.amount,
      currency: "INR",
      name: "Shambhu Digital",
      description: "Invoice Payment",
      order_id: order.id,

      // ================= SUCCESS =================
      handler: async function (response) {
        try {
          console.log("PAYMENT SUCCESS:", response);

          // VERIFY PAYMENT
          await API.post("/payment/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            invoiceId
          });

          // SAVE PAYMENT
          await API.post(`/invoices/${invoiceId}/payment`, {
            amount: Number(amount),
            method: "Online"
          });

          alert("✅ Payment Successful");

          if (onSuccess) onSuccess();

        } catch (err) {
          console.error("VERIFY ERROR:", err.response?.data || err.message);
          alert("Payment verification failed ❌");
        } finally {
          isProcessing = false;
        }
      },

      // ================= FAILURE =================
      modal: {
        ondismiss: function () {
          isProcessing = false;
          alert("Payment cancelled");
        }
      },

      // ================= PREFILL =================
      prefill: {
        name: customer?.name || "Customer",
        email: customer?.email || "test@gmail.com",
        contact: customer?.phone || "9999999999"
      },

      theme: {
        color: "#2563eb"
      }
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function (response) {
      console.error("PAYMENT FAILED:", response.error);
      alert("Payment Failed: " + response.error.description);
      isProcessing = false;
    });

    rzp.open();

  } catch (err) {
    console.error("PAYMENT ERROR:", err.response?.data || err.message);
    alert("Something went wrong ❌");
    isProcessing = false;
  }
};

export default handlePayment;