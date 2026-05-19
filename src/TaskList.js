import React from "react";

function TaskList({ tasks, deleteTask, changeStatus }) {

  return (
    <div>

      {tasks.map(task => (

        <div key={task._id} style={{
          border: "1px solid #ccc",
          padding: "10px",
          margin: "10px",
          borderRadius: "8px",
          background: "#fff"
        }}>

          <b>{task.title}</b>
          <p>{task.description}</p>

          <p>Priority: {task.priority}</p>

          {/* ✅ FIXED STATUS */}
          <select
            value={task.status}
            onChange={(e) => changeStatus(task._id, e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>

          <br /><br />

          <button onClick={() => deleteTask(task._id)}>
            🗑 Delete
          </button>

        </div>

      ))}

    </div>
  );
}

export default TaskList;