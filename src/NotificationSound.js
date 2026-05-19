import { useEffect } from "react";

function NotificationSound() {

  useEffect(() => {

    const playSound = () => {

      const audio =
        new Audio(
          "/notification.mp3"
        );

      audio.play().catch((err) => {
  console.log(err);
});

    };

    window.addEventListener(
      "crm-notification",
      playSound
    );

    return () => {

      window.removeEventListener(
        "crm-notification",
        playSound
      );

    };

  }, []);

  return null;

}

export default
NotificationSound;