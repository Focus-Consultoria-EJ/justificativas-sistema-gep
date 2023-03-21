import { Request, Response, NextFunction } from "express";


/**
 * Middleware responsável por verificar se o usuário é um administrador e se possui
 * um token válido
 */
const adminMiddleware = async (req: Request, res: Response, next: NextFunction) =>
{   
    if(req.shark.admin)
        next();
    else
        return res.status(403).send("Acesso restrito para adminstradores!")    
}

export { adminMiddleware }

	
