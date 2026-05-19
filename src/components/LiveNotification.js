import React, {
  useEffect,
  useState
} from "react";

function LiveNotification() {

  const [message, setMessage] =
    useState("");

  const [show, setShow] =
    useState(false);

  useEffect(() => {

    const handleNotification =
      (event) => {

      setMessage(
        event.detail ||
        "New Notification"
      );

      setShow(true);

      setTimeout(() => {

        setShow(false);

      }, 4000);

    };

    window.addEventListener(
      "crm-popup",
      handleNotification
    );

    return () => {

      window.removeEventListener(
        "crm-popup",
        handleNotification
      );

    };

  }, []);

  if (!show) return null;

  return (

    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        background: "#2563eb",
        color: "#fff",
        padding: "15px 20px",
        borderRadius: "10px",
        zIndex: 9999,
        boxShadow:
          "0 5px 15px rgba(0,0,0,0.2)",
        minWidth: "280px",
        fontWeight: "bold",
        animation:
          "slideIn 0.3s ease"
      }}
    >

      🔔 {message}
<button
  onClick={() => setShow(false)}
  style={{
    marginLeft: "15px",
    background: "transparent",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px"
  }}
>
  ✖
</button>
    </div>

  );

}

export default LiveNotification;