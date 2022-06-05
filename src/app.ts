import fastify from "fastify";
import { PORT } from "./utils/globals";
// Routes
import RoutesHandler from "./routes/NewGame";

const server = fastify({ requestTimeout: 1800000 }); // 30min/req

server.register(RoutesHandler);
server.get("/ping", async () => {
  return "pong\n";
});

server.listen(PORT, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
