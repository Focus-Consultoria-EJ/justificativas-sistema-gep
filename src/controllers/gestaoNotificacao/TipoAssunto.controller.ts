import { NextFunction, Request, Response } from "express";
import getTipoAssuntoService from "../../services/gestaoNotificacao/tipoAssunto/get.tipoAssunto.service";
import saveTipoAssuntoService from "../../services/gestaoNotificacao/tipoAssunto/save.tipoAssunto.service";
import deleteTipoAssuntoService from "../../services/gestaoNotificacao/tipoAssunto/delete.tipoAssunto.service";
import getByIdTipoAssuntoService from "../../services/gestaoNotificacao/tipoAssunto/getById.tipoAssunto.service";

class TipoAssuntoController
{
    async select(req: Request, res: Response, next: NextFunction)
    { 
        try
        {
            let result;
            
            if(req.params.id)
                result = await getByIdTipoAssuntoService.execute(req.params.id);
            else
                result = await getTipoAssuntoService.execute();

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
            await saveTipoAssuntoService.execute(data);

            return res.status(204).send();
        }
        catch(err) { next(err); }
    }

    async delete(req: Request, res: Response, next: NextFunction)
    {
        try
        {
            await deleteTipoAssuntoService.execute(req.params.id);

            return res.status(204).send();
        }
        catch(err) { next(err); }
    }
}

export default new TipoAssuntoController;