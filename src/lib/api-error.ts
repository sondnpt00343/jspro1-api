export type ErrorDetails = Record<string, unknown> | unknown[] | string | null;

export class ApiError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details?: ErrorDetails;

  constructor(statusCode: number, code: string, message: string, details?: ErrorDetails) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export function badRequest(message = "Dữ liệu gửi lên chưa hợp lệ.", details?: ErrorDetails) {
  return new ApiError(400, "BAD_REQUEST", message, details);
}

export function unauthorized(message = "Bạn cần đăng nhập để thực hiện thao tác này.") {
  return new ApiError(401, "UNAUTHORIZED", message);
}

export function forbidden(message = "Bạn không có quyền thực hiện thao tác này.") {
  return new ApiError(403, "FORBIDDEN", message);
}

export function notFound(message = "Không tìm thấy dữ liệu phù hợp.") {
  return new ApiError(404, "NOT_FOUND", message);
}

export function conflict(message = "Dữ liệu đã tồn tại.", details?: ErrorDetails) {
  return new ApiError(409, "CONFLICT", message, details);
}
