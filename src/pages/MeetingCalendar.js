import React, { useState } from "react";

import {
  Calendar,
  momentLocalizer
} from "react-big-calendar";

import moment from "moment";

import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer =
  momentLocalizer(moment);

function MeetingCalendar() {

  // ================= STATES =================

  const [events, setEvents] =
    useState([]);

  const [showForm, setShowForm] =
    useState(false);

  const [selectedSlot, setSelectedSlot] =
    useState(null);

  const [form, setForm] =
    useState({
      title: "",
      client: "",
      notes: "",
      startTime: "",
      endTime: ""
    });

  // ================= OPEN FORM =================

  const handleSelectSlot = ({
    start,
    end
  }) => {

    setSelectedSlot({
      start,
      end
    });

    setShowForm(true);

  };

  // ================= ADD MEETING =================

  const addMeeting = () => {

    if (
      !form.title ||
      !form.startTime ||
      !form.endTime
    ) {

      alert(
        "Please Fill Required Fields"
      );

      return;

    }

    // DATE

    const date =
      moment(selectedSlot.start)
      .format("YYYY-MM-DD");

    // START DATE TIME

    const start =
      new Date(
        `${date}T${form.startTime}`
      );

    // END DATE TIME

    const end =
      new Date(
        `${date}T${form.endTime}`
      );

    const newMeeting = {

      id: Date.now(),

      title: form.title,

      client: form.client,

      notes: form.notes,

      start,

      end
    };

    setEvents([
      ...events,
      newMeeting
    ]);

    // RESET

    setForm({
      title: "",
      client: "",
      notes: "",
      startTime: "",
      endTime: ""
    });

    setShowForm(false);

    alert("✅ Meeting Added");

    // SOUND EVENT

    window.dispatchEvent(
  new Event("crm-notification")
);

  };

  // ================= DELETE =================

  const deleteMeeting =
    (id) => {

      const confirmDelete =
        window.confirm(
          "Delete this meeting?"
        );

      if (!confirmDelete) return;

      const updated =
        events.filter(
          (e) => e.id !== id
        );

      setEvents(updated);

    };

  // ================= EDIT =================

  const editMeeting =
    (id) => {

      const meeting =
        events.find(
          (e) => e.id === id
        );

      const newTitle =
        prompt(
          "Edit Meeting Title",
          meeting.title
        );

      if (!newTitle) return;

      const updated =
        events.map((e) => {

          if (e.id === id) {

            return {
              ...e,
              title: newTitle
            };

          }

          return e;

        });

      setEvents(updated);

      alert("✅ Meeting Updated");

    };

  return (

    <div
      style={{
        height: "100%",
        background: "#fff",
        padding: "20px",
        borderRadius: "12px"
      }}
    >

      <h2
        style={{
          marginBottom: "20px"
        }}
      >
        📅 Meeting Calendar
      </h2>

      {/* ================= CALENDAR ================= */}

      <Calendar
        selectable
        popup
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"

        views={[
          "month",
          "week",
          "day",
          "agenda"
        ]}

        defaultView="month"

        style={{
          height: "70vh"
        }}

        onSelectSlot={
          handleSelectSlot
        }
      />

      {/* ================= POPUP FORM ================= */}

      {showForm && (

        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999
          }}
        >

          <div
            style={{
              background: "#fff",
              padding: "25px",
              borderRadius: "12px",
              width: "400px",
              display: "grid",
              gap: "12px"
            }}
          >

            <h2>
              ➕ Add Meeting
            </h2>

            {/* TITLE */}

            <input
              type="text"
              placeholder="Meeting Title"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value
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
                  client: e.target.value
                })
              }
              style={styles.input}
            />

            {/* START TIME */}

            <div>

              <label>
                Start Time
              </label>

              <input
                type="time"
                value={form.startTime}
                onChange={(e) =>
                  setForm({
                    ...form,
                    startTime:
                      e.target.value
                  })
                }
                style={styles.input}
              />

            </div>

            {/* END TIME */}

            <div>

              <label>
                End Time
              </label>

              <input
                type="time"
                value={form.endTime}
                onChange={(e) =>
                  setForm({
                    ...form,
                    endTime:
                      e.target.value
                  })
                }
                style={styles.input}
              />

            </div>

            {/* NOTES */}

            <textarea
              placeholder="Meeting Notes"
              value={form.notes}
              onChange={(e) =>
                setForm({
                  ...form,
                  notes: e.target.value
                })
              }
              style={{
                ...styles.input,
                minHeight: "90px"
              }}
            />

            {/* BUTTONS */}

            <div
              style={{
                display: "flex",
                gap: "10px"
              }}
            >

              <button
                onClick={addMeeting}
                style={styles.addBtn}
              >
                ✅ Save
              </button>

              <button
                onClick={() =>
                  setShowForm(false)
                }
                style={styles.cancelBtn}
              >
                ❌ Cancel
              </button>

            </div>

          </div>

        </div>

      )}

      {/* ================= MEETING LIST ================= */}

      <div
        style={{
          marginTop: "30px"
        }}
      >

        <h2>
          📋 Meetings List
        </h2>

        {events.length === 0 ? (

          <h3>
            No Meetings Found
          </h3>

        ) : (

          events.map((m) => (

            <div
              key={m.id}

              style={styles.card}
            >

              <h3>
                {m.title}
              </h3>

              <p>
                📅 {
                  moment(m.start)
                  .format(
                    "DD MMM YYYY"
                  )
                }
              </p>

              <p>
                ⏰ {
                  moment(m.start)
                  .format(
                    "hh:mm A"
                  )
                }
                {" "}to{" "}
                {
                  moment(m.end)
                  .format(
                    "hh:mm A"
                  )
                }
              </p>

              <p>
                👤 {m.client}
              </p>

              <p>
                📝 {m.notes}
              </p>

              {/* EDIT */}

              <button
                onClick={() =>
                  editMeeting(m.id)
                }
                style={styles.editBtn}
              >
                ✏ Edit
              </button>

              {/* DELETE */}

              <button
                onClick={() =>
                  deleteMeeting(m.id)
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

    width: "100%",

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

    fontWeight: "bold",

    flex: 1

  },

  cancelBtn: {

    background: "#dc2626",

    color: "#fff",

    border: "none",

    padding: "12px",

    borderRadius: "8px",

    cursor: "pointer",

    fontWeight: "bold",

    flex: 1

  },

  editBtn: {

    background: "#2563eb",

    color: "#fff",

    border: "none",

    padding: "10px 15px",

    borderRadius: "8px",

    cursor: "pointer",

    marginRight: "10px"

  },

  deleteBtn: {

    background: "#dc2626",

    color: "#fff",

    border: "none",

    padding: "10px 15px",

    borderRadius: "8px",

    cursor: "pointer"

  },

  card: {

    background: "#f9fafb",

    padding: "15px",

    borderRadius: "10px",

    marginBottom: "15px",

    border:
      "1px solid #ddd"

  }

};

export default MeetingCalendar;