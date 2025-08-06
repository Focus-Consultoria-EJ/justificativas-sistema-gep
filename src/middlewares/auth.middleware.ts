import { Request, Response, NextFunction } from "express";
import { CustomError, UnauthorizedError } from "./Error.middleware";
import JWTService from "../services/jwt/JWT.service";
import { errMsg } from "../helpers/ErrorMessages";
import getByIdSharkService from "../services/shark/getById.shark.service";

/**
 * Middleware responsável por verificar se o usuário está autenticadado e se possui
 * um token válido
 */
const authMiddleware = async (req: Request, res: Response, next: NextFunction) =>
{   
    const { authorization } = req.headers;
	
    try
    {
        // Verifica se o usuário está autenticado
        if (!authorization)
            throw new UnauthorizedError("Acesso não autorizado.");

        // pega a posição do token referente a SECRET_TOKEN
        const token = authorization.replace("Bearer", "").trim();
        
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
        {
            const dataShark = await getByIdSharkService.execute(jwtData.id);
            
            req.shark = { 
                id: dataShark.id, 
                nome: dataShark.nome, 
                email: dataShark.email,
                celula: { id: dataShark.celula.id, nome: dataShark.celula.nome },
                numProjeto: dataShark.numProjeto,
                metragem: dataShark.metragem,
                role: { id: dataShark.role?.id, nome: dataShark.role?.nome },
                jwt: {
                    iat: jwtData.iat,
                    exp: jwtData.exp
                } 
            };
        }
    }
    catch(err) { next(err); }

    next();
};

export { authMiddleware };

	
