import React, {
  useEffect,
  useState,
  useRef
} from "react";
import API from "../api/api";

function MeetingReminder() {

  const [meetings, setMeetings] =
    useState([]);
const notifiedMeetings =
  useRef(new Set());
  // ================= FETCH =================

  const fetchMeetings =
    async () => {

      try {

        const res =
          await API.get("/meetings");

        setMeetings(
          res.data?.meetings || []
        );

      } catch (err) {

        console.log(
          "Meeting Fetch Error:",
          err
        );

      }

    };

  // ================= INITIAL LOAD =================

  useEffect(() => {

    fetchMeetings();

    const interval =
      setInterval(() => {

        fetchMeetings();

      }, 60000);

    return () =>
      clearInterval(interval);

  }, []);

  // ================= REMINDER =================

  // ================= REMINDER =================

const checkReminder = () => {

  const now = new Date();

  meetings.forEach((m) => {

    const meetingTime =
      new Date(m.start);

    const diff =
      meetingTime - now;

    const minutes =
      Math.floor(
        diff / 1000 / 60
      );

    if (
      minutes > 0 &&
      minutes <= 30 &&
      !notifiedMeetings.current.has(m._id)
    ) {

      notifiedMeetings.current.add(m._id);

      alert(
        `⏰ Upcoming Meeting: ${m.title}`
      );

      window.dispatchEvent(
        new CustomEvent(
          "crm-popup",
          {
            detail:
              `Upcoming Meeting: ${m.title}`
          }
        )
      );

    }

  });

};

// ================= RUN REMINDER =================

useEffect(() => {

  if (meetings.length > 0) {

    checkReminder();

  }

}, [meetings]);
  // ================= RUN REMINDER =================

  useEffect(() => {

    if (
      meetings.length > 0
    ) {

      checkReminder();

    }

  }, [meetings]);

  return null;

}

export default MeetingReminder;