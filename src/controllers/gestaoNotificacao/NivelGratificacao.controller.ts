import { NextFunction, Request, Response } from "express";
import getByIdNivelGratificacaoService from "../../services/gestaoNotificacao/nivelGratificacao/getById.nivelGratificacao.service";
import getNivelGratificacaoService from "../../services/gestaoNotificacao/nivelGratificacao/get.nivelGratificacao.service";
import saveNivelGratificacaoService from "../../services/gestaoNotificacao/nivelGratificacao/save.nivelGratificacao.service";
import deleteNivelGratificacaoService from "../../services/gestaoNotificacao/nivelGratificacao/delete.nivelGratificacao.service";

class NivelGratificacaoController
{
    async select(req: Request, res: Response, next: NextFunction)
    { 
        try
        {
            let result;
            
            if(req.params.id)
                result = await getByIdNivelGratificacaoService.execute(req.params.id);
            else
                result = await getNivelGratificacaoService.execute();

            res.status(200).json(result);
        }
        catch(err) { next(err); }
    }

    async save(req: Request, res: Response, next: NextFunction)
    {
        const data = { ...req.body };
        if(req.params.id) data.id = req.params.id;

        try
        {
            await saveNivelGratificacaoService.execute(data);

            return res.status(204).send();
        }
        catch(err) { next(err); }
    }

    async delete(req: Request, res: Response, next: NextFunction)
    {
        try
        {
            await deleteNivelGratificacaoService.execute(req.params.id);

            return res.status(204).send();
        }
        catch(err) { next(err); }
    }
}

export default new NivelGratificacaoController;