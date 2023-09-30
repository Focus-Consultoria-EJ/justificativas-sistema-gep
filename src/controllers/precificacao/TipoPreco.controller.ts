import { NextFunction, Request, Response } from "express";
import getByIdTipoPrecoService from "../../services/precificacao/tipoPreco/getById.tipoPreco.service";
import getTipoPrecoService from "../../services/precificacao/tipoPreco/get.tipoPreco.service";
import saveTipoPrecoService from "../../services/precificacao/tipoPreco/save.tipoPreco.service";
import deleteTipoPrecoService from "../../services/precificacao/tipoPreco/delete.tipoPreco.service";

class TipoPrecosController
{
    async select(req: Request, res: Response, next: NextFunction)
    { 
        try
        {
            let result;
            
            if(req.params.id)
                result = await getByIdTipoPrecoService.execute(req.params.id);
            else
                result = await getTipoPrecoService.execute();

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
            await saveTipoPrecoService.execute(data);

            return res.status(204).send();
        }
        catch(err) { next(err); }
    }

    async delete(req: Request, res: Response, next: NextFunction)
    {
        try
        {
            await deleteTipoPrecoService.execute(req.params.id);

            return res.status(204).send();
        }
        catch(err) { next(err); }
    }
}

export default new TipoPrecosController;