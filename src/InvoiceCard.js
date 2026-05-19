import axios from "axios";

const handlePayment = async (amount, invoiceId) => {
  const { data } = await axios.post("/api/payment/create-order", { amount });

  const options = {
    key: "YOUR_KEY",
    amount: data.amount,
    order_id: data.id,
    handler: async function (response) {
      await axios.post("/api/payment/verify", response);

      await axios.put(`/api/invoices/${invoiceId}`, {
        status: "Paid",
      });

      alert("Payment Successful");
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};