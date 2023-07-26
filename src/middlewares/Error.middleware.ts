import { Request, Response, NextFunction } from "express";

/**
 * Middleware responsável pelo tratamento dos erros.
 */
export class CustomError extends Error 
{
    public readonly statusCode?: number;

    /**
     * @param message - a mensagem do erro.
     * @param statusCode - o código HTTP do erro.
     */
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
    /**
     * Configura o tratamento de erro de acordo com status da aplicação.
     * @param error - o tipo de erro. 
     * @param req - a requisição do Express.
     * @param res - a resposta do Express.
     * @param next - a função next do Express.
     */
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
        next();
    }
}

export default ErrorMiddleware;