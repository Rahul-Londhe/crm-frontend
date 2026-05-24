import React, {
  useEffect,
  useState
} from "react";
import API from "../api/api";


function PerformanceDashboard() {

  const [data, setData] =
    useState([]);

  

  useEffect(() => {

    fetchPerformance();

  }, []);

  const fetchPerformance =
    async () => {

      try {

        const res =
  await API.get(
    "/performance"
  );

const result =
  res.data;

        if (result.success) {

          setData(result.data);

        }

      } catch (err) {

        console.log(err);

      }

    };

  return (

    <div>

      <h2>
        📊 Team Performance
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",
          gap: 20
        }}
      >

        {data.map(user => (

          <div
            key={user._id}

            style={{
              background: "#fff",
              padding: 20,
              borderRadius: 12,
              boxShadow:
                "0 2px 10px rgba(0,0,0,0.1)"
            }}
          >

            <h3>
              {user.name}
            </h3>

            <p>
              Role:
              {user.role}
            </p>

            <p>
              Leads:
              {user.leads}
            </p>

            <p>
              Tasks:
              {user.tasks}
            </p>

            <p>
              Revenue:
              ₹{user.revenue}
            </p>

          </div>

        ))}

      </div>

    </div>

  );

}

export default
PerformanceDashboard;