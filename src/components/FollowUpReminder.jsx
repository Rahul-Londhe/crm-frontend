import React, { useEffect, useState } from "react";
import API from "./api/api";

function FollowUpReminder() {

  const [pending, setPending] = useState([]);
  const [show, setShow] = useState(true);

  const fetchPending = async () => {

    try {

      const res = await API.get("/leads");

      if (res.data.success) {

        const overdue =
          res.data.leads.filter((l) => {

            if (!l.nextFollowUp)
              return false;

            return (
              new Date(l.nextFollowUp)
              < new Date()
            );

          });

        setPending(overdue);

      }

    } catch (err) {

      console.log(err);

    }

  };

  useEffect(() => {

    fetchPending();

    const interval =
      setInterval(fetchPending, 60000);

    return () =>
      clearInterval(interval);

  }, []);

  if (!show || pending.length === 0)
    return null;

  return (

    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "320px",
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: "12px",
        boxShadow:
          "0 0 10px rgba(0,0,0,0.2)",
        zIndex: 9999
      }}
    >

      <div
        style={{
          padding: "12px",
          background: "#f59e0b",
          color: "#fff",
          display: "flex",
          justifyContent:
            "space-between",
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px"
        }}
      >

        <b>
          ⚠ Pending Follow Ups
        </b>

        <button
          onClick={() => setShow(false)}
          style={{
            border: "none",
            background: "transparent",
            color: "#fff",
            cursor: "pointer"
          }}
        >
          ✕
        </button>

      </div>

      <div
        style={{
          maxHeight: "300px",
          overflowY: "auto"
        }}
      >

        {pending.map((lead, i) => (

          <div
            key={i}
            style={{
              padding: "10px",
              borderBottom:
                "1px solid #eee"
            }}
          >

            <b>{lead.name}</b>

            <p>
              📞 {lead.phone}
            </p>

            <small>
              Follow Up:
              {" "}
              {
                new Date(
                  lead.nextFollowUp
                ).toLocaleString()
              }
            </small>

          </div>

        ))}

      </div>

    </div>

  );

}

export default FollowUpReminder;