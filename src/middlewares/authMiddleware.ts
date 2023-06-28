import { Request, Response, NextFunction } from "express";
import { CustomError, UnauthorizedError } from "./Error.middleware";
import JWTService from "../services/jwt/JWT.service";
import { errMsg } from "../helpers/ErrorMessages";

/**
 * Middleware responsável por verificar se o usuário está autenticadado e se possui
 * um token válido
 */
const authMiddleware = async (req: Request, res: Response, next: NextFunction) =>
{   
    const { authorization } = req.headers;
	
    // Verifica se o usuário está autenticado
    if (!authorization)
        throw new UnauthorizedError("Acesso não autorizado.");
	
    // pega a posição do token referente a SECRET_TOKEN
    const token = authorization.replace("Bearer", "").trim();

    try
    {
        const jwtData = JWTService.verify(token);

        if(jwtData === errMsg.JWT.INVALID_TOKEN)
        {
            delete req.shark;
            throw new CustomError(errMsg.JWT.INVALID_TOKEN, 400);
        }
        else if (jwtData === errMsg.JWT.SECRET_NOT_FOUND)
        {
            delete req.shark;
            throw new CustomError(errMsg.JWT.SECRET_NOT_FOUND, 400);
        }
        
        if( !(typeof jwtData === "string") )
            req.shark = { ...jwtData };
    }
    catch(err) { next(err); }

    next();
};

export { authMiddleware };

	
