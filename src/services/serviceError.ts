export type ServiceErrorCode =
  | 'invalid_response'
  | 'not_found'
  | 'validation'
  | 'booking_failed'
  | 'in_progress';

export class ServiceError extends Error {
  readonly code: ServiceErrorCode;

  constructor(code: ServiceErrorCode, message: string) {
    super(message);
    this.name = 'ServiceError';
    this.code = code;
  }
}

export function toUserMessage(error: unknown, fallback: string) {
  if (error instanceof ServiceError) {
    return error.message;
  }

  if (__DEV__) {
    console.warn(fallback, error);
  }

  return fallback;
}
