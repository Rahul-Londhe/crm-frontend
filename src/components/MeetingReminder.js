import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";

const API =
"http://localhost:5000/api";

function MeetingReminder() {

  const [meetings, setMeetings] =
    useState([]);

  useEffect(() => {

    fetchMeetings();

const interval =
  setInterval(() => {

    fetchMeetings();
    checkReminder();

  }, 60000);

    return () =>
      clearInterval(interval);

  }, []);

  const fetchMeetings =
    async () => {

    try {

      const res =
        await axios.get(
          `${API}/meetings`
        );

      setMeetings(
        res.data.meetings || []
      );

    } catch (err) {

      console.log(err);

    }

  };

  const checkReminder =
    () => {

    const now =
      new Date();

    meetings.forEach((m) => {

      const meetingTime =
        new Date(
          `${m.date} ${m.time}`
        );

      const diff =
        meetingTime - now;

      const minutes =
        Math.floor(
          diff / 1000 / 60
        );

      if (
        minutes <= 30 &&
        minutes > 0
      ) {

        alert(
  `⏰ Upcoming Meeting: ${m.title}`
);

window.dispatchEvent(
  new Event("crm-notification")
);
      }

    });

  };

  return null;

}

export default
MeetingReminder;