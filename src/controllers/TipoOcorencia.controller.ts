import { NextFunction, Request, Response } from "express";
import getTipoOcorrenciaService from "../services/tipoOcorrencia/get.tipoOcorrencia.service";
import saveTipoOcorrenciaService from "../services/tipoOcorrencia/save.tipoOcorrencia.service";
import deleteTipoOcorrenciaService from "../services/tipoOcorrencia/delete.tipoOcorrencia.service";

class TipoOcorrenciaController
{
    async select(req: Request, res: Response, next: NextFunction)
    { 
        try
        {
            const result = await getTipoOcorrenciaService.execute();

            res.status(200).json({data: result });
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