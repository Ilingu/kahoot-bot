import type { FastifyInstance, FastifyReply } from "fastify";
import type { BasicObject } from "../utils/interfaces/types";

import HTTP from "../utils/interfaces/HttpStatusCode";
import { Reply } from "../utils/ServerUtils";
import { LauchBotGame } from "../utils/KahootUtils";
import { EmptyContent } from "../utils/utils";

export default async function routes(fastify: FastifyInstance) {
  const BadArgs = (res: FastifyReply, msg?: string) =>
    Reply(res, false, { msg: `Bad ${msg || "Args"}` }, HTTP.BAD_REQUEST); // ❌
  const GameError = (res: FastifyReply) =>
    Reply(res, false, { msg: `Cannot Connect To Game` }, HTTP.BAD_GATEWAY); // ❌

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

    const { success } = await LauchBotGame(GameID, Username);
    if (!success) return GameError(res);

    return Reply(res, true);
  });
}
