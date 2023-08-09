import { NextFunction, Request, Response } from "express";
import getSharkService from "../services/shark/get.shark.service";
import saveSharkService from "../services/shark/save.shark.service";
import deleteSharkService from "../services/shark/delete.shark.service";
import { CustomError } from "../middlewares/Error.middleware";
import getByUsernameService from "../services/shark/getByUsername.service";
import { passwordCompare } from "../middlewares/password.middleware";
import JWTService from "../services/jwt/JWT.service";
import getByIdSharkService from "../services/shark/getById.shark.service";
import getByIdLogSharkService from "../services/shark/getByIdLog.shark.service";
import getLogSharkService from "../services/shark/getLog.shark.service";

class SharkController
{
    // Responsável por gerar o Token JWT com os dados do usuário
    async signIn(req: Request, res: Response, next: NextFunction)
    { 
        const data = { ...req.body };

        try
        {
            // Verifica se os campos existem
            if (!data.login || !data.senha)
                throw new CustomError("Informe um usuário e senha!", 400);

            const shark = await getByUsernameService.execute(data.login);
            
            if(!shark)
                throw new CustomError("O shark não foi encontrado.", 400);

            // Proíbe o usuário inativo de realizar o login
            if(!shark.membroAtivo)
                throw new CustomError("O shark não está ativo.", 400);
        
            // Verifica se a senha digitada é igual ao do banco de dados
            if(!await passwordCompare(data.senha, shark.senha))
                throw new CustomError("Senha inválida!", 401);

            const token = JWTService.sign({ id: shark.id });

            res.status(200).json({ token });
        }
        catch(err) { next(err); }
    }

    async select(req: Request, res: Response, next: NextFunction)
    { 
        try
        {
            const { size, page, membroAtivo, nome } = req.query;
            let result;

            if(req.params.id)
                result = await getByIdSharkService.execute(req.params.id);
            else
                result = await getSharkService.execute({ size, page, membroAtivo, nome});

            res.status(200).json(result);
        }
        catch(err) { next(err); }
    }

    async getSharkFromRequest(req: Request, res: Response, next: NextFunction)
    { 
        try
        {
            res.status(200).json(req.shark);
        }
        catch(err) { next(err); }
    }

    async save(req: Request, res: Response, next: NextFunction)
    {
        const data = { ...req.body };
        if(req.params.id) data.id = req.params.id;

        try
        {
            await saveSharkService.execute(data, req.shark);

            return res.status(204).send();
        }
        catch(err) { next(err); }
    }

    async delete(req: Request, res: Response, next: NextFunction)
    {
        try
        {
            await deleteSharkService.execute(req.params.id, req.shark);

            return res.status(204).send();
        }
        catch(err) { next(err); }
    }

    async selectLog(req: Request, res: Response, next: NextFunction)
    { 
        try
        {
            const { size, page } = req.query;
            
            let result;

            if(req.params.id)
                result = await getByIdLogSharkService.execute(req.params.id);
            else
                result = await getLogSharkService.execute({ size, page });

            res.status(200).json(result);
        }
        catch(err) { next(err); }
    }
}

export default new SharkController;