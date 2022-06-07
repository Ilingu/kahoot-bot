import fastify from "fastify";
import cors from "@fastify/cors";
import fs from "fs";
import path from "path";
import { Server } from "socket.io";
import { createServer } from "https";
import { WEB_PORT, WS_PORT } from "./lib/globals";
// Routes
import RoutesHandler from "./routes/NewGame";
import { NewWSConn } from "./lib/WebSockets";
// Log
import { log, logError } from "./lib/Utils/utils";

const HTTPS_OPTIONS = {
  key: fs.readFileSync(
    path.join(__dirname, "..", "certificates", "privkey.pem")
  ),
  cert: fs.readFileSync(
    path.join(__dirname, "..", "certificates", "fullchain.pem")
  ),
};

const server = fastify({
  http2: true,
  https: {
    allowHTTP1: true, // fallback support for HTTP1
    ...HTTPS_OPTIONS,
  },
});
// { requestTimeout: 1800000 } --> 30min/req, don't need it anymore since it run into bg with WS
// CERT: /etc/letsencrypt/live/kahootbot.xyz/fullchain.pem
// KEY: /etc/letsencrypt/live/kahootbot.xyz/privkey.pem

server.register(cors, {
  origin: [
    "https://client.kahootbot.xyz",
    "https://kahootbot-client.vercel.app",
  ],
  methods: ["GET", "POST"],
}); // cors
server.register(RoutesHandler); // Routes

// Web Server
server.listen(WEB_PORT, "0.0.0.0", (err, address) => {
  if (err) {
    logError(err);
    process.exit(1);
  }
  log(`Web Server listening at ${address}`);
});

// Websocket server
const HttpsServer = createServer(HTTPS_OPTIONS).listen(WS_PORT, () => {
  log(`WebSocket Server listening at port ${WS_PORT}`);
});
const io = new Server(HttpsServer, {
  cors: {
    origin: [
      "https://client.kahootbot.xyz",
      "https://kahootbot-client.vercel.app",
    ],
  },
});

io.on("connection", NewWSConn);
