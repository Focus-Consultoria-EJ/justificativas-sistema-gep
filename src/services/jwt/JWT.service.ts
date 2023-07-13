import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { errMsg } from "../../helpers/ErrorMessages";
dotenv.config();

// Os dados a serem inseridos no token.
interface IJWTData { id: number, nome: string, celula: string, numProjetos: number, metragem: number, admin: boolean }

class JWTService
{
    /**
     * Gera o token JWT com um determinado tempo de expiração.
     * @param payload - os dados a seregem criptografados.
     * @returns o hash JWT com os dados criptografados.
     */
    sign(payload: IJWTData)
    {
        return jwt.sign(payload, process.env.JWT_SECRET_TOKEN!, 
            {expiresIn: process.env.JWT_EXPIRES_IN ?? "1d"});
    }

    /**
     * Retira os dados de um token válido.
     * @param token - o token a ser testado.
     * @returns retorna os dados do token.
     */
    verify(token: string) : IJWTData | string
    {
        if(!process.env.JWT_SECRET_TOKEN)
            return errMsg.JWT.SECRET_NOT_FOUND;

        try
        {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN!);

            if (typeof decoded === "string")
                return errMsg.JWT.INVALID_TOKEN;
                
            return decoded as IJWTData;

        } catch (err:any) { return errMsg.JWT.INVALID_TOKEN; }
    }
}

export default new JWTService;
