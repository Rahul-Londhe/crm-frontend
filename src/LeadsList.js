import React, { useState, useEffect } from "react";
import {
  FiTrash2,
  FiMail,
  FiPhoneCall,
  FiEdit,
  FiSave,
  FiX
} from "react-icons/fi";
import { BsWhatsapp } from "react-icons/bs";

const API = "http://localhost:5000/api";

function LeadsList({ leads = [], setLeads, onSelect, refreshLeads }) {

  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [loadingId, setLoadingId] = useState(null);
  const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("All");
const [tempFilter, setTempFilter] = useState("All");

  const safeSetLeads = (cb) => {
    if (typeof setLeads === "function") {
      setLeads(prev => cb(Array.isArray(prev) ? prev : []));
    }
  };

  const getToken = () => {
    const t = localStorage.getItem("token");
    return t && t !== "undefined" && t !== "null" ? t : null;
  };

  // ================= USERS =================
  useEffect(() => {
    fetch(`${API}/users`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data?.success) setUsers(data.users || []);
      })
      .catch(err => console.error("Users Error:", err));
  }, []);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!id) return;
    if (!window.confirm("Delete lead?")) return;

    setLoadingId(id);

    try {
      const res = await fetch(`${API}/leads/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` }
      });

      const data = await res.json();

      if (data.success) {
        safeSetLeads(prev =>
  prev.filter(l => (l._id || l.id) !== id)
);
        refreshLeads?.();
        // 🔔 SOUND
window.dispatchEvent(
  new Event("crm-notification")
);

// 🔥 POPUP
window.dispatchEvent(
  new CustomEvent(
    "crm-popup",
    {
      detail: "Lead Deleted Successfully"
    }
  )
);
      } else {
        alert(data.message || "Delete failed");
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  // ================= STATUS =================
  const handleStatusChange = async (id, status) => {
    safeSetLeads(prev =>
      prev.map(l =>
  (l._id || l.id) === id
    ? { ...l, status }
    : l
)
    );

    try {
      const res = await fetch(`${API}/leads/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ status })
      });

      const data = await res.json();

      if (data.success) {
        safeSetLeads(prev =>
          prev.map(l =>
  (l._id || l.id) === id
    ? data.lead
    : l
)
        );
      }

    } catch (err) {
      console.error(err);
    }
  };

  // ================= ASSIGN =================
  const assignLead = async (id, userId) => {
    const selectedUser = users.find(u => u._id === userId) || null;

    safeSetLeads(prev =>
  prev.map(l =>
    (l._id || l.id) === id
      ? { ...l, assignedTo: selectedUser }
      : l
  )
);

    try {
      const res = await fetch(`${API}/leads/${id}/assign`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ userId })
      });

      const data = await res.json();

      if (data.success) {
        safeSetLeads(prev =>
          prev.map(l =>
  (l._id || l.id) === id
    ? data.lead
    : l
)
        );
      }

    } catch (err) {
      console.error(err);
    }
  };

  // ================= EDIT =================
  const startEdit = (lead) => {
    setEditId(lead._id || lead.id);
    setEditData({
      name: lead.name || "",
      phone: lead.phone || "",
      email: lead.email || ""
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditData({});
  };

  const saveEdit = async () => {
    try {
      const res = await fetch(`${API}/leads/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(editData)
      });

      const data = await res.json();

      if (data.success) {
        window.dispatchEvent(
  new Event("crm-notification")
);

window.dispatchEvent(
  new CustomEvent(
    "crm-popup",
    {
      detail: "Lead Updated Successfully"
    }
  )
);
        safeSetLeads(prev =>
          prev.map(l =>
  (l._id || l.id) === editId
    ? data.lead
    : l
)
        );
        setEditId(null);
        refreshLeads?.();
      }

    } catch (err) {
      console.error(err);
    }
  };

  // ================= ACTIONS =================
  const sendWhatsApp = async (lead) => {

  if (!lead?.phone) {

    alert("No phone number");

    return;

  }

  try {

    const res = await fetch(
      `${API}/whatsapp/send-message`,
      {

        method: "POST",

        headers: {

          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${getToken()}`

        },

        body: JSON.stringify({

          phone: lead.phone,

          message:
            "Hello from CRM"

        })

      }
    );

    const data =
      await res.json();

    // ✅ SUCCESS

    if (data.success) {

      alert(
        "✅ WhatsApp Sent"
      );

      // 🔔 SOUND
      window.dispatchEvent(
        new Event(
          "crm-notification"
        )
      );

      // 🔥 POPUP
      window.dispatchEvent(
        new CustomEvent(
          "crm-popup",
          {
            detail:
              "WhatsApp Sent Successfully"
          }
        )
      );

    } else {

      alert(
        "❌ Failed to send WhatsApp"
      );

    }

  } catch (err) {

    console.error(err);

    alert(
      "❌ Error sending WhatsApp"
    );

  }

};
  const sendEmail = async (lead) => {

  if (!lead?.email) {

    alert("No email found");

    return;

  }

  try {

    const res = await fetch(
      `${API}/email/send`,
      {

        method: "POST",

        headers: {

          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${getToken()}`

        },

        body: JSON.stringify({

          email: lead.email,

          subject:
            "Hello from CRM",

          message:
            "This is a test message from your CRM system"

        })

      }
    );

    const data =
      await res.json();

    // ✅ SUCCESS

    if (data.success) {

      alert(
        "✅ Email Sent"
      );

      // 🔔 SOUND
      window.dispatchEvent(
        new Event(
          "crm-notification"
        )
      );

      // 🔥 POPUP
      window.dispatchEvent(
        new CustomEvent(
          "crm-popup",
          {
            detail:
              "Email Sent Successfully"
          }
        )
      );

    } else {

      alert(
        "❌ Failed to send Email"
      );

    }

  } catch (err) {

    console.error(err);

    alert(
      "❌ Error sending email"
    );

  }

};

  const previewFile = (file) => {
  const token = localStorage.getItem("token");
  window.open(`${API}/leads/file/${file}?token=${token}`, "_blank");
};

  const downloadFile = (file) => {
  const token = localStorage.getItem("token");

  const link = document.createElement("a");
  link.href = `${API}/leads/file/${file}/download?token=${token}`;
  link.setAttribute("download", file);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
const filteredLeads = (Array.isArray(leads) ? leads : []).filter((l) => {

  const matchesSearch =
  (l.name || "")
    .toLowerCase()
    .includes(search.toLowerCase()) ||

  (l.phone || "")
    .includes(search) ||

  (l.email || "")
    .toLowerCase()
    .includes(search.toLowerCase());
  const matchesStatus =
    statusFilter === "All"
      ? true
      : l.status === statusFilter;

  const matchesTemp =
    tempFilter === "All"
      ? true
      : l.temperature === tempFilter;

  return matchesSearch && matchesStatus && matchesTemp;
});

  // ================= UI =================
  return (
<>
  
{/* MOBILE VIEW */}
{/* FILTERS */}
<div className="
md:hidden
bg-slate-100
pb-3
space-y-3
relative
z-50
p-3
">

  <input
  type="text"
  placeholder="Search lead..."
  value={search}
  onChange={(e) => {
    setSearch(e.target.value);
  }}
  className="
  w-full
  px-4
  py-3
  rounded-2xl
  border
  border-slate-300
  bg-white
  text-black
  outline-none
  "
/>

  <div className="grid grid-cols-2 gap-3">

    <select
      value={statusFilter}
      onChange={(e) =>
        setStatusFilter(e.target.value)
      }
      className="
      px-3
      py-3
      rounded-2xl
      border
      border-slate-300
      bg-white
      "
    >
      <option>All</option>
      <option>New</option>
      <option>Contacted</option>
      <option>Interested</option>
      <option>Closed</option>
    </select>

    <select
      value={tempFilter}
      onChange={(e) =>
        setTempFilter(e.target.value)
      }
      className="
      px-3
      py-3
      rounded-2xl
      border
      border-slate-300
      bg-white
      "
    >
      <option>All</option>
      <option>Hot</option>
      <option>Warm</option>
      <option>Cold</option>
    </select>

  </div>

</div>
<div className="md:hidden space-y-4 p-3 bg-slate-100 min-h-screen">
{filteredLeads.length === 0 && (
  <div className="
  bg-white
  rounded-3xl
  p-10
  text-center
  shadow-lg
  ">
    
    <h2 className="text-xl font-bold text-slate-700">
      No Leads Found
    </h2>

    <p className="text-slate-500 mt-2">
      Add new leads to see data here.
    </p>

  </div>
)}
  {filteredLeads.map((l, index) => (

    <div
      key={l?._id || index}
      onClick={() => onSelect?.(l)}
      className="
bg-gradient-to-br
from-white
to-slate-50
rounded-3xl
shadow-xl
border
border-slate-200
p-4
active:scale-[0.98]
hover:shadow-2xl
transition-all
duration-300
backdrop-blur-sm
"
    >

      {/* TOP */}
      <div className="flex justify-between items-start">

        <div>
          <h2 className="
font-extrabold
text-blue-800
text-xl
tracking-wide
">
            {l.name}
          </h2>

          <p className="
text-sm
text-slate-600
mt-1
font-medium
">
            📞 {l.phone}
          </p>

          <p className="
text-sm
text-slate-600
font-medium
">
            ✉ {l.email}
          </p>
        </div>

        <span
          className={`
px-4
py-1.5
rounded-full
text-white
text-xs
font-extrabold
shadow-md
tracking-wide
${
  l.temperature === "Hot"
    ? "bg-red-500"
    : l.temperature === "Warm"
    ? "bg-orange-500"
    : "bg-slate-500"
}
`}
        >
          {l.temperature || "Cold"}
        </span>

      </div>

      {/* STATUS + ASSIGN */}
      <div className="grid grid-cols-2 gap-3 mt-4">

        <select
          value={l.status}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) =>
            handleStatusChange(
              l._id || l.id,
              e.target.value
            )
          }
          className="
         border
border-slate-300
rounded-2xl
px-3
py-2
text-sm
bg-white
outline-none
focus:ring-2
focus:ring-blue-500
          "
        >
          {["New", "Contacted", "Interested", "Closed"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <select
          value={l.assignedTo?._id || ""}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) =>
            assignLead(
              l._id || l.id,
              e.target.value
            )
          }
          className="
          border
          rounded-xl
          px-3
          py-2
          text-sm
          "
        >
          <option value="">Assign</option>

          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
        </select>

      </div>

      {/* FILE */}
      <div className="mt-4">

        {l.file ? (

          <div className="flex gap-2">

            <button
              onClick={(e) => {
                e.stopPropagation();
                previewFile(l.file);
              }}
              className="
flex-1
bg-slate-200
hover:bg-slate-300
py-2.5
rounded-2xl
font-semibold
transition-all
duration-200
"
            >
              Preview
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                downloadFile(l.file);
              }}
              className="
flex-1
bg-blue-600
hover:bg-blue-700
text-white
py-2.5
rounded-2xl
font-semibold
transition-all
duration-200
shadow-md
"
            >
              Download
            </button>

          </div>

        ) : (

          <p className="text-sm text-slate-400">
            No File
          </p>

        )}

      </div>

     {/* ACTIONS */}
<div className="grid grid-cols-5 gap-2 mt-5">

  <button
    onClick={(e) => {
      e.stopPropagation();
      sendWhatsApp(l);
    }}
    className="
    bg-green-600
    text-white
    py-3
    rounded-2xl
    flex
    justify-center
    items-center
    hover:scale-105
    active:scale-95
    transition-all
    duration-200
    shadow-md
    "
  >
    <BsWhatsapp size={20} />
  </button>

  <button
    onClick={(e) => {
      e.stopPropagation();
      sendEmail(l);
    }}
    className="
    bg-gray-900
    text-white
    py-3
    rounded-2xl
    flex
    justify-center
    items-center
    hover:scale-105
    active:scale-95
    transition-all
    duration-200
    shadow-md
    "
  >
    <FiMail size={20} />
  </button>

  <button
    onClick={(e) => {
      e.stopPropagation();
      window.open(`tel:${l.phone}`);
    }}
    className="
    bg-blue-600
    text-white
    py-3
    rounded-2xl
    flex
    justify-center
    items-center
    hover:scale-105
    active:scale-95
    transition-all
    duration-200
    shadow-md
    "
  >
    <FiPhoneCall size={20} />
  </button>

  <button
    onClick={(e) => {
      e.stopPropagation();
      startEdit(l);
    }}
    className="
    bg-yellow-500
    text-white
    py-3
    rounded-2xl
    flex
    justify-center
    items-center
    hover:scale-105
    active:scale-95
    transition-all
    duration-200
    shadow-md
    "
  >
    <FiEdit size={20} />
  </button>

  <button
    onClick={(e) => {
      e.stopPropagation();
      handleDelete(l._id || l.id);
    }}
    className="
    bg-red-600
    text-white
    py-3
    rounded-2xl
    flex
    justify-center
    items-center
    hover:scale-105
    active:scale-95
    transition-all
    duration-200
    shadow-md
    "
  >
    <FiTrash2 size={20} />
  </button>

</div>

    </div>

  ))}

</div>


{/* DESKTOP VIEW */}
<div className="hidden md:block overflow-x-auto rounded-2xl shadow-lg">

  <table
    className="
    min-w-full
    bg-white
    rounded-2xl
    overflow-hidden
    "
  >

    <thead className="bg-blue-900 text-white  z-10">
      <tr>
        <th className="px-4 py-4">Name</th>
        <th className="px-4 py-4">Contact</th>
        <th className="px-4 py-4">Status</th>
        <th className="px-4 py-4">Temperature</th>
        <th className="px-4 py-4">Assign</th>
        <th className="px-4 py-4">File</th>
        <th className="px-4 py-4">Actions</th>
      </tr>
    </thead>

    <tbody>

      {filteredLeads.map((l, index) => (
  <tr
    key={l?._id || index}
    className="
    border-b
    hover:bg-blue-50
    transition
    text-center
    "
  >

    <td>
      {editId === (l._id || l.id) ? (
        <input
          className="border px-2 py-1 rounded"
          value={editData.name}
          onChange={(e) =>
            setEditData({ ...editData, name: e.target.value })
          }
        />
      ) : (
        <span
          onClick={() => onSelect?.(l)}
          className="
          cursor-pointer
          text-blue-600
          font-bold
          hover:underline
          "
        >
          {l.name}
        </span>
      )}
    </td>

    <td className="px-4 py-4 min-w-[220px]">

      <div>
        📞 {l.phone}
      </div>

      <div>
        ✉ {l.email}
      </div>

      {l.nextFollowUp &&
        new Date(l.nextFollowUp) < new Date() && (
          <div className="text-red-600 font-bold text-sm mt-2">
            ⚠ Follow Up Pending
          </div>
      )}

    </td>

    <td className="px-4 py-4">
      <select
        value={l.status}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) =>
          handleStatusChange(l._id || l.id, e.target.value)
        }
        className="
        border
        border-slate-300
        rounded-lg
        px-3
        py-2
        bg-white
        outline-none
        focus:ring-2
        focus:ring-blue-500
        "
      >

        {["New", "Contacted", "Interested", "Closed"].map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>
    </td>

    <td>
      <span
        className={`
        px-3
        py-1
        rounded-full
        text-white
        text-sm
        font-bold
        ${
          l.temperature === "Hot"
            ? "bg-red-500"
            : l.temperature === "Warm"
            ? "bg-orange-500"
            : "bg-gray-500"
        }
        `}
      >
        {l.temperature || "Cold"}
      </span>
    </td>

    <td>
      <select
        value={l.assignedTo?._id || ""}
        className="
        border
        border-slate-300
        rounded-lg
        px-3
        py-2
        bg-white
        outline-none
        focus:ring-2
        focus:ring-violet-500
        "
        onClick={(e) => e.stopPropagation()}
        onChange={(e) =>
          assignLead(l._id || l.id, e.target.value)
        }
      >
        <option value="">Assign</option>

        {users.map(u => (
          <option key={u._id} value={u._id}>
            {u.name}
          </option>
        ))}
      </select>
    </td>

    <td>
      {l.file && l.file !== "" ? (
        <>
          <button
            className="
            bg-slate-200
            hover:bg-slate-300
            px-3
            py-2
            rounded-lg
            mr-2
            transition
            "
            onClick={(e) => {
              e.stopPropagation();
              previewFile(l.file);
            }}
          >
            👁
          </button>

          <button
            className="
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-3
            py-2
            rounded-lg
            transition
            "
            onClick={(e) => {
              e.stopPropagation();
              downloadFile(l.file);
            }}
          >
            ⬇
          </button>
        </>
      ) : "No File"}
    </td>

    <td
      className="
      px-4
      py-4
      flex
      flex-wrap
      gap-2
      justify-center
      items-center
      "
    >

      <button
        className="
        bg-green-600
        hover:bg-green-700
        text-white
        p-2
        rounded-lg
        transition
        "
        onClick={(e) => {
          e.stopPropagation();
          sendWhatsApp(l);
        }}
      >
        <BsWhatsapp />
      </button>

      <button
        className="
        bg-gray-900
        hover:bg-black
        text-white
        p-2
        rounded-lg
        transition
        "
        onClick={(e) => {
          e.stopPropagation();
          sendEmail(l);
        }}
      >
        <FiMail />
      </button>

      <button
        className="
        bg-blue-600
        hover:bg-blue-700
        text-white
        p-2
        rounded-lg
        transition
        "
        onClick={(e) => {
          e.stopPropagation();
          window.open(`tel:${l.phone}`);
        }}
      >
        <FiPhoneCall />
      </button>

      {editId === (l._id || l.id) ? (
        <>
          <button
            className="
            bg-yellow-500
            hover:bg-yellow-600
            text-white
            p-2
            rounded-lg
            transition
            "
            onClick={(e) => {
              e.stopPropagation();
              saveEdit();
            }}
          >
            <FiSave />
          </button>

          <button
            className="
            bg-gray-500
            hover:bg-gray-600
            text-white
            p-2
            rounded-lg
            transition
            "
            onClick={(e) => {
              e.stopPropagation();
              cancelEdit();
            }}
          >
            <FiX />
          </button>
        </>
      ) : (
        <button
          className="
          bg-yellow-500
          hover:bg-yellow-600
          text-white
          p-2
          rounded-lg
          transition
          "
          onClick={(e) => {
            e.stopPropagation();
            startEdit(l);
          }}
        >
          <FiEdit />
        </button>
      )}

      <button
        className="
        bg-red-600
        hover:bg-red-700
        text-white
        p-2
        rounded-lg
        transition
        "
        onClick={(e) => {
          e.stopPropagation();
          handleDelete(l._id || l.id);
        }}
      >
        {loadingId === (l._id || l.id)
          ? "..."
          : <FiTrash2 />}
      </button>

    </td>

  </tr>
))}

    </tbody>

  </table>

</div>

</>
);
}

export default LeadsList;  