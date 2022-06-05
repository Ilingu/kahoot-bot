export interface APIResPayload<T = object> {
  succeed: boolean;
  status: number;
  data?: T | undefined;
  FailureReason?: string | undefined;
}
