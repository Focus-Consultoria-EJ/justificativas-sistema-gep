import { Request, Response, NextFunction } from "express";
import { CustomError } from "./Error.middleware";

/**
 * Middleware responsável por verificar se o usuário é membro de Adm fin ou comercial.
 */
const precAuthMiddleware = async (req: Request, res: Response, next: NextFunction) =>
{   
    try
    {
        if (![2, 5].includes(req.shark.celula.id) && req.shark.role.id !== 3)
            throw new CustomError("Acesso negado. O usuário não é de Adm. Financeiro ou Comercial.", 403);
    }       
    catch(err) { next(err); }

    next();
};

export { precAuthMiddleware };