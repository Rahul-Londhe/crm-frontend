import React, { useEffect, useState } from "react";

const API = "http://localhost:5000/api";

function LeadNotes({ leadId }) {

  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");

  const token = localStorage.getItem("token");

  // ================= LOAD NOTES =================
  const loadNotes = async () => {

    try {

      const res = await fetch(
        `${API}/leads/${leadId}/notes`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      if (data.success) {
        setNotes(data.notes || []);
      }

    } catch (err) {
      console.log(err);
    }

  };

  useEffect(() => {

    if (leadId) {
      loadNotes();
    }

  }, [leadId]);

  // ================= ADD NOTE =================
  const addNote = async () => {

    if (!text.trim()) return;

    try {

      const res = await fetch(
        `${API}/leads/${leadId}/notes`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            note: text
          })
        }
      );

      const data = await res.json();

      if (data.success) {

        setNotes(prev => [
          data.note,
          ...prev
        ]);

        setText("");

      }

    } catch (err) {
      console.log(err);
    }

  };

  return (

    <div style={{
      marginTop: 20,
      background: "#fff",
      padding: 15,
      borderRadius: 10
    }}>

      <h3>Lead Notes</h3>

      <textarea
        value={text}
        onChange={(e) =>
          setText(e.target.value)
        }
        placeholder="Write note..."
        style={{
          width: "100%",
          minHeight: 80
        }}
      />

      <button
        onClick={addNote}
        style={{
          marginTop: 10
        }}
      >
        Add Note
      </button>

      <div style={{
        marginTop: 20
      }}>

        {notes.map((n) => (

          <div
            key={n._id}
            style={{
              border: "1px solid #ddd",
              padding: 10,
              marginBottom: 10,
              borderRadius: 8
            }}
          >

            <strong>
              {n.user?.name}
            </strong>

            <p>
              {n.note}
            </p>

            <small>
              {new Date(
                n.createdAt
              ).toLocaleString()}
            </small>

          </div>

        ))}

      </div>

    </div>

  );

}

export default LeadNotes;