import type { FastifyInstance, FastifyReply } from "fastify";
import type { BasicObject } from "../utils/interfaces/types";

import HTTP from "../utils/interfaces/HttpStatusCode";
import { Reply } from "../utils/ServerUtils";
import { ConnectToGame } from "../utils/KahootUtils";

export default async function routes(fastify: FastifyInstance) {
  const BadArgs = (res: FastifyReply, msg?: string) =>
    Reply(res, false, { msg: `Bad ${msg || "Args"}` }, HTTP.BAD_REQUEST); // ❌

  fastify.post("/newgame/:gameid", async (req, res) => {
    const Params = req.params;
    if (!Params || typeof Params !== "object") return BadArgs(res); // ❌

    const GameID = (Params as BasicObject<string>)["gameid"];
    if (!GameID || isNaN(parseInt(GameID))) return BadArgs(res); // ❌
    await ConnectToGame(parseInt(GameID));

    return Reply(res, true);
  });
}
