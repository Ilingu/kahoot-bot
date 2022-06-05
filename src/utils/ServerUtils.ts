import type { FastifyReply } from "fastify";
import type { APIResPayload } from "./interfaces/interfaces";

export const HandleSuccess = <T = any>(
  data?: T,
  status = 200
): APIResPayload<T> => ({ succeed: true, status, data });

export const HandleError = (msg?: string, status = 500): APIResPayload => {
  console.error(`[${status}][Server Error]:\n`, msg);
  return { succeed: false, status, FailureReason: msg };
};

interface OptnShape<T = any> {
  msg?: string;
  data?: T;
}
export const Reply = <T = any>(
  res: FastifyReply,
  success: boolean,
  options?: OptnShape<T>,
  status?: number
) => {
  if (!success) {
    const payload = HandleError(options?.msg, status);
    res.statusCode = status || 500;
    return payload;
  }

  const payload = HandleSuccess<T>(options?.data, status);
  res.statusCode = status || 200;
  return payload;
};
