export class AppError extends Error {
  public readonly code: string
  public readonly status: number
  constructor(message: string, options?: { code?: string; status?: number }) {
    super(message)
    this.name = "AppError"
    this.code = options?.code || "APP_ERROR"
    this.status = options?.status || 500
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed") {
    super(message, { code: "VALIDATION_ERROR", status: 400 })
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, { code: "UNAUTHORIZED", status: 401 })
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, { code: "FORBIDDEN", status: 403 })
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not Found") {
    super(message, { code: "NOT_FOUND", status: 404 })
  }
}


