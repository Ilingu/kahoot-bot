import fastify from "fastify";
import cors from "@fastify/cors";
import fs from "fs";
import path from "path";
import { Server } from "socket.io";
import { WEB_PORT, WS_PORT } from "./lib/globals";
// Routes
import RoutesHandler from "./routes/NewGame";
import { NewWSConn } from "./lib/WebSockets";
// Log
import { log, logError } from "./lib/Utils/utils";

const server = fastify();
// http2: true,
// https: {
//   allowHTTP1: true, // fallback support for HTTP1
//   key: fs.readFileSync(
//     path.join(__dirname, "..", "certificates", "fastify.key")
//   ),
//   cert: fs.readFileSync(
//     path.join(__dirname, "..", "certificates", "fastify.csr")
//   ),
// }, // { requestTimeout: 1800000 } --> 30min/req, don't need it anymore since it run into bg with WS

server.register(cors, {
  origin: "*",
  methods: ["GET", "POST"],
}); // cors
server.register(RoutesHandler); // Routes

// Web Server
server.listen(WEB_PORT, "0.0.0.0", (err, address) => {
  if (err) {
    logError(err);
    process.exit(1);
  }
  log(`Server listening at ${address}`);
});

// Websocket server
const io = new Server(WS_PORT, {
  cors: { origin: "*" },
});

io.on("connection", NewWSConn);
