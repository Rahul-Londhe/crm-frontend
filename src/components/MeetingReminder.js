import React, {
  useEffect,
  useState
} from "react";

import API from "../api/api";

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

  }, [meetings]);

  // ================= FETCH =================

  const fetchMeetings =
    async () => {

    try {

      const res =
        await API.get("/meetings");

      setMeetings(
        res.data.meetings || []
      );

    } catch (err) {

      console.log(err);

    }

  };

  // ================= REMINDER =================

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

export default MeetingReminder;