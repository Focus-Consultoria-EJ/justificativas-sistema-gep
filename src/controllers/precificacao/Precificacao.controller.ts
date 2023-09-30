import { NextFunction, Request, Response } from "express";
import getByIdPrecificacaoService from "../../services/precificacao/precificacao/getById.precificacao.service";
import getPrecificacaoService from "../../services/precificacao/precificacao/get.precificacao.service";
import savePrecificacaoService from "../../services/precificacao/precificacao/save.precificacao.service";
import deletePrecificacaoService from "../../services/precificacao/precificacao/delete.precificacao.service";

class PrecificacaoController
{
    async select(req: Request, res: Response, next: NextFunction)
    { 
        try
        {
            let result;
            
            if(req.params.id)
                result = await getByIdPrecificacaoService.execute(req.params.id);
            else
                result = await getPrecificacaoService.execute();

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
            await savePrecificacaoService.execute(data);

            return res.status(204).send();
        }
        catch(err) { next(err); }
    }

    async delete(req: Request, res: Response, next: NextFunction)
    {
        try
        {
            await deletePrecificacaoService.execute(req.params.id);

            return res.status(204).send();
        }
        catch(err) { next(err); }
    }
}

export default new PrecificacaoController;