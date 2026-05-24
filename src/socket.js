import { io } from "socket.io-client";

const socket = io("https://crm-backend-production-eec9.up.railway.app/api", {
  transports: ["websocket"]
});

export default socket;