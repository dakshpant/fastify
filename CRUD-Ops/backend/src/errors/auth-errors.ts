import { AppError } from "./app-error.js";

export class AuthError extends AppError {
    constructor(
        code = "UNAUTHORIZED",
        message = "Authentication failed"
    ){
        super(code, message, 401)
    }
}