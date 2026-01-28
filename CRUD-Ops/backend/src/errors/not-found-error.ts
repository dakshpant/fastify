import { AppError } from "./app-error.js";

export class NotFoundError extends AppError {
  constructor(
    code = "NOT_FOUND",
    message = "Resource not found"
  ) {
    super(code, message, 404);
  }
}
