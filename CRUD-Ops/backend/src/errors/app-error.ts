export class AppError extends Error{
    public statusCode: number;
    public code: string;

    constructor(code: string, message:string, statusCode: number){
        super(message);
        this.code = code;
        this.statusCode = statusCode;
    };
}