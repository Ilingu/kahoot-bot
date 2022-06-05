import type { Socket } from "socket.io";
import { LauchKahootBot } from "./KahootBot";
import { log } from "./Utils/utils";

type MapConn = { [ConnID: string]: Socket };
let ClientsConn: MapConn = {};

export const InitBotWS = async (GameID: string, Username: string) => {
  const KahootRes = await LauchKahootBot(GameID, Username);
  log("[LOG]: Disconnected from game, sending result to client...");
  const ResSocket = ClientsConn[GameID];
  if (!ResSocket) return;

  ResSocket.emit("KahootEnd", KahootRes);
  ResSocket.disconnect();
  log("[LOG]: Result Sent to client. Connection Closed. Session Done.");
  delete ClientsConn[GameID];
};

export const SendLogs = (GameID: string, msg: string) => {
  const ResSocket = ClientsConn[GameID];
  if (!ResSocket) return;
  ResSocket.emit("KahootLogs", msg);
};

export const NewWSConn = (socket: Socket) => {
  let GameId = "";

  socket.on("GameID", (GameID: string) => {
    GameId = GameID;
    ClientsConn[GameID] = socket;
    log(`[LOG]: New WS client: GAMEID: ${GameID}`);
  });

  socket.on("disconnect", () => {
    delete ClientsConn[GameId];
  });
};
