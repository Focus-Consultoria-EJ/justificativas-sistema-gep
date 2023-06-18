import { NextFunction, Request, Response } from "express";
import getSharkService from "../services/shark/get.shark.service";
import saveSharkService from "../services/shark/save.shark.service";
import deleteSharkService from "../services/shark/delete.shark.service";
import { CustomError } from "../middlewares/Error.middleware";
import getByUsernameService from "../services/shark/getByUsername.service";
import { passwordCompare } from "../middlewares/passwordMiddleware";
import JWTService from "../services/jwt/JWT.service";
import getByIdSharkService from "../services/shark/getById.shark.service";
import getByIdCelulaService from "../services/celula/getById.celula.service";

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
                throw new CustomError("Usuário não encontrado.", 400);
        
            // Verifica se a senha digitada é igual ao do banco de dados
            if(!await passwordCompare(data.senha, shark.senha))
                throw new CustomError("E-mail ou senha inválidos!", 401);

            const celula = await getByIdCelulaService.execute(shark.id_celula);

            const token = JWTService.sign({ 
                id: shark.id, 
                nome: shark.nome, 
                celula: celula.nome, 
                numProjetos: shark.num_projeto,
                metragem: shark.metragem, 
                admin: shark.admin });

            res.status(200).json({ token });
        }
        catch(err) { next(err); }
    }

    async select(req: Request, res: Response, next: NextFunction)
    { 
        try
        {
            /* O 'limit' limite de cláusulas e o 'offset' ignora as cláusulas indicadas
            * ?limit=[valor_numérico] ou ?offset=[valor_numérico]&limit=[valor_numérico] */
            const { limit, offset } = req.query;
            let result;

            if(req.params.id)
                result = await getByIdSharkService.execute(req.params.id);
            else
                result = await getSharkService.execute({ limit, offset });

            res.status(200).json({data: result });
        }
        catch(err) { next(err); }
    }

    async getSharkFromRequest(req: Request, res: Response, next: NextFunction)
    { 
        try
        {
            res.status(200).json({data: req.shark });
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
}

export default new SharkController;