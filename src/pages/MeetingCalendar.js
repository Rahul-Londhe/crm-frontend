import React, {
  useState,
  useEffect
} from "react";
import API from "../api/api";


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
useEffect(() => {
  console.log("MeetingCalendar Mounted");
  fetchMeetings();

  return () => {
    console.log("MeetingCalendar Unmounted");
  };
}, []);

const fetchMeetings = async () => {

  try {

    

    const res = await API.get("/meetings");

    const formatted =
      res.data.meetings.map(m => ({
        ...m,
        id: m._id,
        start: new Date(m.start),
        end: new Date(m.end)
      }));

    setEvents(formatted);

  } catch(err){

    console.log(err);

  }

};
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

const addMeeting = async () => {

  try {

    const date =
      moment(selectedSlot.start)
      .format("YYYY-MM-DD");

    const start =
      new Date(
        `${date}T${form.startTime}`
      );

    const end =
      new Date(
        `${date}T${form.endTime}`
      );

    await API.post("/meetings", {
  title: form.title,
  client: form.client,
  notes: form.notes,
  start,
  end
});

    fetchMeetings();

    setShowForm(false);

    setForm({
      title:"",
      client:"",
      notes:"",
      startTime:"",
      endTime:""
    });

  } catch(err){

    console.log(err);

  }

};

  // ================= DELETE =================

  const deleteMeeting = async (id) => {

  try {

    await API.delete(`/meetings/${id}`);

    fetchMeetings();

  } catch(err){

    console.log(err);

  }

};

  // ================= EDIT =================

  const editMeeting = async (id) => {

  try {

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

    await API.put(`/meetings/${id}`, {
  title: newTitle
});
    fetchMeetings();

  } catch(err){

    console.log(err);

  }

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
      onSelectEvent={(event)=>{

  const action =
    window.prompt(
      "Type edit or delete"
    );

  if(action==="edit"){
    editMeeting(event.id);
  }

  if(action==="delete"){
    deleteMeeting(event.id);
  }

}}
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