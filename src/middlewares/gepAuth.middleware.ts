import { Request, Response, NextFunction } from "express";
import { CustomError } from "./Error.middleware";

/**
 * Middleware responsável por verificar se o usuário é membro de Gestão Estratégica de Pessoas
 */
const gepAuthMiddleware = async (req: Request, res: Response, next: NextFunction) =>
{   
    try
    {
        if (req.shark.celula.id !== 3 && req.shark.role.id !== 3)
            throw new CustomError("Acesso negado. O usuário não é de Gestão de Estratégica de Pessoas.", 403);
    }       
    catch(err) { next(err); }

    next();
};

export { gepAuthMiddleware };