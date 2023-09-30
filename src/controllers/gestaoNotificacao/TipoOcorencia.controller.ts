import { NextFunction, Request, Response } from "express";
import getTipoOcorrenciaService from "../../services/gestaoNotificacao/tipoOcorrencia/get.tipoOcorrencia.service";
import saveTipoOcorrenciaService from "../../services/gestaoNotificacao/tipoOcorrencia/save.tipoOcorrencia.service";
import deleteTipoOcorrenciaService from "../../services/gestaoNotificacao/tipoOcorrencia/delete.tipoOcorrencia.service";
import getByIdTipoOcorrenciaService from "../../services/gestaoNotificacao/tipoOcorrencia/getById.tipoOcorrencia.service";

class TipoOcorrenciaController
{
    async select(req: Request, res: Response, next: NextFunction)
    { 
        try
        {
            let result;

            if(req.params.id)
                result = await getByIdTipoOcorrenciaService.execute(req.params.id);
            else
                result = await getTipoOcorrenciaService.execute();

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
            await saveTipoOcorrenciaService.execute(data);

            return res.status(204).send();
        }
        catch(err) { next(err); }
    }

    async delete(req: Request, res: Response, next: NextFunction)
    {
        try
        {
            await deleteTipoOcorrenciaService.execute(req.params.id);

            return res.status(204).send();
        }
        catch(err) { next(err); }
    }
}

export default new TipoOcorrenciaController;