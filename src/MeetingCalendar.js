import React,
{
  useEffect,
  useState
} from "react";

import API from "./api/api";


function MeetingCalendar() {

  // ================= STATES =================

  const [meetings, setMeetings] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({
      title: "",
      date: "",
      time: "",
      client: "",
      notes: ""
    });

  // ================= FETCH MEETINGS =================

  const fetchMeetings =
    async () => {

    try {

      setLoading(true);

      const res =
        await API.get("/meetings");

      setMeetings(
        res.data.meetings || []
      );

    } catch (err) {

      console.log(
        "FETCH ERROR:",
        err
      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchMeetings();

  }, []);

  // ================= ADD MEETING =================

  const addMeeting =
    async () => {

    if (
      !form.title ||
      !form.date ||
      !form.time
    ) {

      window.dispatchEvent(
        new CustomEvent(
          "crm-popup",
          {
            detail:
              "Please Fill Required Fields"
          }
        )
      );

      return;

    }

    try {

      await API.post(
  "/meetings",
        {
          ...form,
          status: "Scheduled"
        }
      );

      // 🔔 SOUND

      window.dispatchEvent(
        new Event(
          "crm-notification"
        )
      );

      // 🔔 POPUP

      window.dispatchEvent(
        new CustomEvent(
          "crm-popup",
          {
            detail:
              "Meeting Added Successfully"
          }
        )
      );

      // RESET FORM

      setForm({
        title: "",
        date: "",
        time: "",
        client: "",
        notes: ""
      });

      // REFRESH LIST

      fetchMeetings();

    } catch (err) {

      console.log(
        "ADD ERROR:",
        err
      );

    }

  };

  // ================= UPDATE =================

  const updateMeeting =
    async (
      id,
      oldTitle
    ) => {

    const newTitle =
      prompt(
        "Edit Meeting Title",
        oldTitle
      );

    if (!newTitle) return;

    try {

      await API.put(
  `/meetings/${id}`,
        {
          title: newTitle
        }
      );

      window.dispatchEvent(
        new Event(
          "crm-notification"
        )
      );

      window.dispatchEvent(
        new CustomEvent(
          "crm-popup",
          {
            detail:
              "Meeting Updated"
          }
        )
      );

      fetchMeetings();

    } catch (err) {

      console.log(
        "UPDATE ERROR:",
        err
      );

    }

  };

  // ================= DELETE =================

  const deleteMeeting =
    async (id) => {

    const confirmDelete =
      window.confirm(
        "Delete this meeting?"
      );

    if (!confirmDelete)
      return;

    try {

      await API.delete(
  `/meetings/${id}`
);
      

      window.dispatchEvent(
        new Event(
          "crm-notification"
        )
      );

      window.dispatchEvent(
        new CustomEvent(
          "crm-popup",
          {
            detail:
              "Meeting Deleted"
          }
        )
      );

      fetchMeetings();

    } catch (err) {

      console.log(
        "DELETE ERROR:",
        err
      );

    }

  };

  return (

    <div
      style={{
        padding: "20px"
      }}
    >

      {/* ================= TITLE ================= */}

      <h1
        style={{
          marginBottom: "20px"
        }}
      >
        📅 Meeting Calendar
      </h1>

      {/* ================= FORM ================= */}

      <div
        style={{
          display: "grid",
          gap: "12px",
          maxWidth: "500px",
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow:
            "0 2px 10px rgba(0,0,0,0.1)"
        }}
      >

        {/* TITLE */}

        <input
          type="text"
          placeholder="Meeting Title"
          value={form.title}
          onChange={(e) =>
            setForm({
              ...form,
              title:
                e.target.value
            })
          }
          style={styles.input}
        />

        {/* DATE */}

        <input
          type="date"
          value={form.date}
          onChange={(e) =>
            setForm({
              ...form,
              date:
                e.target.value
            })
          }
          style={styles.input}
        />

        {/* TIME */}

        <input
          type="time"
          value={form.time}
          onChange={(e) =>
            setForm({
              ...form,
              time:
                e.target.value
            })
          }
          style={styles.input}
        />

        {/* CLIENT */}

        <input
          type="text"
          placeholder="Client Name"
          value={form.client}
          onChange={(e) =>
            setForm({
              ...form,
              client:
                e.target.value
            })
          }
          style={styles.input}
        />

        {/* NOTES */}

        <textarea
          placeholder="Meeting Notes"
          value={form.notes}
          onChange={(e) =>
            setForm({
              ...form,
              notes:
                e.target.value
            })
          }
          style={{
            ...styles.input,
            minHeight: "100px"
          }}
        />

        {/* BUTTON */}

        <button
          onClick={addMeeting}
          style={styles.addBtn}
        >
          ➕ Add Meeting
        </button>

      </div>

      {/* ================= LIST ================= */}

      <div
        style={{
          marginTop: "40px"
        }}
      >

        <h2>
          📋 Meetings List
        </h2>

        {loading ? (

          <h3>
            Loading...
          </h3>

        ) : meetings.length === 0 ? (

          <h3>
            No Meetings Found
          </h3>

        ) : (

          meetings

            .filter((m) => {

              const now =
                new Date();

              const meetingDate =
                new Date(
                  `${m.date}T${m.time}`
                );

              return (
                meetingDate >= now
              );

            })

            .sort(
              (a, b) =>

                new Date(
                  `${a.date}T${a.time}`
                ) -

                new Date(
                  `${b.date}T${b.time}`
                )
            )

            .map((m) => (

              <div
                key={m._id}
                style={styles.card}
              >

                <h3>
                  {m.title}
                </h3>

                {/* DATE */}

                <p>
                  📅 <b>Date:</b>{" "}

                  {
                    new Date(
                      m.date
                    ).toLocaleDateString()
                  }
                </p>

                {/* TIME */}

                <p>
                  ⏰ <b>Time:</b>{" "}

                  {
                    m.time ||
                    "No Time"
                  }
                </p>

                {/* CLIENT */}

                <p>
                  👤 <b>Client:</b>{" "}

                  {m.client}
                </p>

                {/* NOTES */}

                <p>
                  📝 <b>Notes:</b>{" "}

                  {m.notes}
                </p>

                {/* STATUS */}

                <p>

                  📌 <b>Status:</b>{" "}

                  {(() => {

                    const now =
                      new Date();

                    const meetingStart =
                      new Date(
                        `${m.date}T${m.time}`
                      );

                    const meetingEnd =
                      new Date(
                        meetingStart.getTime() +
                        60 * 60 * 1000
                      );

                    if (
                      now <
                      meetingStart
                    ) {

                      return (
                        <span
                          style={{
                            color:
                              "#2563eb",
                            fontWeight:
                              "bold"
                          }}
                        >
                          Upcoming
                        </span>
                      );

                    }

                    if (

                      now >=
                        meetingStart &&

                      now <=
                        meetingEnd

                    ) {

                      return (
                        <span
                          style={{
                            color:
                              "orange",
                            fontWeight:
                              "bold"
                          }}
                        >
                          Ongoing
                        </span>
                      );

                    }

                    return (
                      <span
                        style={{
                          color:
                            "green",
                          fontWeight:
                            "bold"
                        }}
                      >
                        Completed
                      </span>
                    );

                  })()}

                </p>

                {/* EDIT */}

                <button
                  onClick={() =>
                    updateMeeting(
                      m._id,
                      m.title
                    )
                  }
                  style={styles.editBtn}
                >
                  ✏ Edit
                </button>

                {/* DELETE */}

                <button
                  onClick={() =>
                    deleteMeeting(
                      m._id
                    )
                  }
                  style={styles.deleteBtn}
                >
                  ❌ Delete
                </button>

              </div>

            ))

        )}

      </div>

    </div>

  );

}

// ================= STYLES =================

const styles = {

  input: {

    padding: "12px",

    border:
      "1px solid #ccc",

    borderRadius: "8px",

    fontSize: "14px"

  },

  addBtn: {

    background: "#2563eb",

    color: "#fff",

    border: "none",

    padding: "12px",

    borderRadius: "8px",

    cursor: "pointer",

    fontWeight: "bold"

  },

  editBtn: {

    background: "#2563eb",

    color: "#fff",

    border: "none",

    padding: "10px 15px",

    borderRadius: "8px",

    cursor: "pointer",

    marginTop: "10px",

    marginRight: "10px"

  },

  deleteBtn: {

    background: "#dc2626",

    color: "#fff",

    border: "none",

    padding: "10px 15px",

    borderRadius: "8px",

    cursor: "pointer",

    marginTop: "10px"

  },

  card: {

    background: "#fff",

    border:
      "1px solid #ddd",

    padding: "20px",

    marginBottom: "15px",

    borderRadius: "12px",

    boxShadow:
      "0 2px 8px rgba(0,0,0,0.08)"

  }

};

export default
MeetingCalendar;