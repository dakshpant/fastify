import { AppError } from "./app-error.js";

export class ForbiddenError extends AppError{
    constructor(
        code= "FORBIDDEN",
        message="Access Denied"
    ){
        super(code, message, 403)
    }
}