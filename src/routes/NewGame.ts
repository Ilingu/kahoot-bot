import type { FastifyInstance, FastifyReply } from "fastify";
import type { BasicObject } from "../lib/interfaces/types";

import HTTP from "../lib/interfaces/HttpStatusCode";
import { Reply } from "../lib/Utils/ServerUtils";
import { EmptyContent } from "../lib/Utils/utils";
import { InitBotWS } from "../lib/WebSockets";

export default async function routes(fastify: FastifyInstance) {
  const BadArgs = (res: FastifyReply, msg?: string) =>
    Reply(res, false, { msg: `Bad ${msg || "Args"}` }, HTTP.BAD_REQUEST); //

  fastify.get("/ping", async () => {
    return "pong\n";
  });

  fastify.post("/newgame/:gameid", async (req, res) => {
    const { params, body } = req;
    // Check ID
    const GameID = (params as BasicObject<string>)["gameid"];
    if (!GameID || isNaN(parseInt(GameID))) return BadArgs(res); // ❌
    // Check Body
    if (!params || typeof params !== "object") return BadArgs(res); // ❌
    if (!body || typeof body !== "string") return BadArgs(res, "body"); // ❌
    const Body: BasicObject = JSON.parse(body);
    const Username = Body["username"];
    if (EmptyContent(Username)) return BadArgs(res, "username"); // ❌

    InitBotWS(GameID, Username); // Run in Background with WebSocket
    return Reply(res, true);
  });
}
