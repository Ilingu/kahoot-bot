import { io } from "socket.io-client";
import { PushToast } from "./utils";

export const LauchWSClient = (GameID: string) => {
  const socket = io(`http://139.162.138.207:8080`, {
    reconnectionDelayMax: 10000,
  });

  socket.on("connect", () => {
    console.log("Connected To Server");
    socket.emit("GameID", GameID);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected From Server");
    socket.close();
  });

  socket.on("KahootLogs", (data) => {
    const NewLog = document.createElement("p");
    NewLog.textContent = data;
    document.querySelector("#game-logs").appendChild(NewLog);
  });

  socket.on("KahootEnd", (data: { success: boolean }) => {
    setTimeout(() => window.location.reload(), 6000);
    if (!data?.success)
      return PushToast("Error Kahoot Connection Closed", "error", 6000);

    return PushToast("Kahoot Successfully end. Disconnected", "success", 5000);
  });
};
