import React, {
  useEffect,
  useState
} from "react";

export default function PWAInstallButton() {

  const [
    deferredPrompt,
    setDeferredPrompt
  ] = useState(null);

  const [
    show,
    setShow
  ] = useState(false);

  useEffect(() => {

    const handler = (e) => {

      e.preventDefault();

      setDeferredPrompt(e);

      setShow(true);

    };

    window.addEventListener(
      "beforeinstallprompt",
      handler
    );

    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handler
      );

  }, []);

  const installApp = async () => {

    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const {
      outcome
    } = await deferredPrompt.userChoice;

    console.log(
      "Install Result:",
      outcome
    );

    setDeferredPrompt(null);

    setShow(false);

  };

  if (!show) return null;

  return (

    <button
      onClick={installApp}
      className="
      fixed
      bottom-24
      right-5
      bg-blue-600
      hover:bg-blue-700
      text-white
      px-5
      py-3
      rounded-2xl
      shadow-2xl
      z-50
      font-bold
      animate-bounce
      "
    >

      📲 Install App

    </button>

  );

}