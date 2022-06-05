import type { FastifyReply } from "fastify";
import type { APIResPayload } from "../interfaces/interfaces";

/**
 * Return a valid success response payload
 * @param {any} data `optional` potential data to return
 * @param status `optional` statuscode to send back (default=200)
 * @returns {APIResPayload} The payload object to send
 */
const HandleSuccess = <T = any>(data?: T, status = 200): APIResPayload<T> => ({
  succeed: true,
  status,
  data,
});

/**
 * Return a valid error response payload
 * @param {string} msg `optional` potential FailureReason to return
 * @param status `optional` statuscode to send back (default=500)
 * @returns {APIResPayload} The payload object to send
 */
const HandleError = (msg?: string, status = 500): APIResPayload => {
  console.error(`[${status}][Server Error]:\n`, msg);
  return { succeed: false, status, FailureReason: msg };
};

/**
 * @interface OptionsShape to reply
 */
interface OptnShape<T = any> {
  msg?: string;
  data?: T;
}

/**
 * Generate a reponse payload and set the response headers according to the args
 * @param {FastifyReply} res response object
 * @param {boolean} success if the req succeed or not
 * @param {OptnShape} options `optional` options of the res (data to sendback or failurereason)
 * @param {number} status `optional` custom statuscode
 * @returns {APIResPayload} The payload object to send
 */
export const Reply = <T = any>(
  res: FastifyReply,
  success: boolean,
  options?: OptnShape<T>,
  status?: number
): APIResPayload<object> | APIResPayload<T> => {
  if (!success) {
    const payload = HandleError(options?.msg, status);
    res.statusCode = status || 500;
    return payload;
  }

  const payload = HandleSuccess<T>(options?.data, status);
  res.statusCode = status || 200;
  return payload;
};
