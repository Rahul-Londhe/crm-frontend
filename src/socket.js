import { io } from "socket.io-client";

const socket = io(
  "https://crm-backend-production-579c.up.railway.app",
  {
    transports: ["websocket", "polling"],
    withCredentials: true,
  }
);

export default socket;