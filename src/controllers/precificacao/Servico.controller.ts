import { NextFunction, Request, Response } from "express";
import getByIdServicoService from "../../services/precificacao/servico/getById.servico.service";
import getServicoService from "../../services/precificacao/servico/get.servico.service";
import saveServicoService from "../../services/precificacao/servico/save.servico.service";
import deleteServicoService from "../../services/precificacao/servico/delete.servico.service";

class ServicoController
{
    async select(req: Request, res: Response, next: NextFunction)
    { 
        try
        {
            let result;
            
            if(req.params.id)
                result = await getByIdServicoService.execute(req.params.id);
            else
                result = await getServicoService.execute();

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
            await saveServicoService.execute(data);

            return res.status(204).send();
        }
        catch(err) { next(err); }
    }

    async delete(req: Request, res: Response, next: NextFunction)
    {
        try
        {
            await deleteServicoService.execute(req.params.id);

            return res.status(204).send();
        }
        catch(err) { next(err); }
    }
}

export default new ServicoController;