import { Request, Response, NextFunction } from "express";

export class CustomError extends Error 
{
    public readonly statusCode?: number;

    constructor(message: string, statusCode?: number) 
    {
        super(message);
        this.statusCode = statusCode;
    }
}

export class BadRequestError extends CustomError
{
    constructor(message: string) { super(message, 400); }
}

export class UnauthorizedError extends CustomError
{
    constructor(message: string) { super(message, 401); }
}

export class InternalServerError extends CustomError
{
    constructor(message: string) { super(message, 500); }
}

class ErrorMiddleware 
{
    static handle(error: CustomError, req: Request, res: Response, next: NextFunction): void {
        let message; 

        switch(process.env.STATUS)
        {
            case "production": 
                message = error.statusCode ? error.message : "Erro do Servidor Interno.";
                break;
            case "development":
                message = error.message;
                break;
            default:
                message = error.message;
                break;
        }

        res.status(error.statusCode ?? 500).json({ message });
    }
}

export default ErrorMiddleware;