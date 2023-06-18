import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { errMsg } from "../../helpers/ErrorMessages";
dotenv.config();

interface IJWTData { id: number, nome: string, celula: string, numProjetos: number, metragem: number, admin: boolean }

class JWTService
{
    sign(payload: IJWTData)
    {
        return jwt.sign(payload, process.env.JWT_SECRET_TOKEN!, 
            {expiresIn: process.env.JWT_EXPIRES_IN ?? "1d"});
    }

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
