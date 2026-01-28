import { AppError } from "./app-error.js";

export class ValidationError extends AppError {
  constructor(
    code = "VALIDATION_ERROR",
    message = "Invalid input"
  ) {
    super(code, message, 400);
  }
}
