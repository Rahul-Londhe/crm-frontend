import React, { useEffect, useState } from "react";

import API from "./api/api";

function LeadNotes({ leadId }) {

  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");

  const [loading, setLoading] = useState(false);

  // ================= LOAD NOTES =================
  const loadNotes = async () => {

    try {
setLoading(true);
      const res =
  await API.get(
    `/leads/${leadId}/notes`
  );

const data = res.data;
      if (data.success) {
        setNotes(data.notes || []);
      }
} catch (err) {
  console.log(err);
} finally {
  setLoading(false);
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

      const res =
  await API.post(
    `/leads/${leadId}/notes`,
    {
      note: text
    }
  );

const data = res.data;
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
      {loading && <p>Loading...</p>}

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
  disabled={!text.trim()}
        style={{
          marginTop: 10
        }}
      >
        Add Note
      </button>

      <div style={{
        marginTop: 20
      }}>
{notes.length === 0 && (
  <p>No Notes Found</p>
)}
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