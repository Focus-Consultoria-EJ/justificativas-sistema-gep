import { NextFunction, Request, Response } from "express";
import getOcorrenciaService from "../services/ocorrencia/get.ocorrencia.service";
import deleteOcorrenciaService from "../services/ocorrencia/delete.ocorrencia.service";
import saveOcorrenciaService from "../services/ocorrencia/save.ocorrencia.service";
import getByIdOcorrenciaService from "../services/ocorrencia/getById.ocorrencia.service";

class OcorrenciaController
{
    async select(req: Request, res: Response, next: NextFunction)
    { 
        try
        {
            /* O 'limit' limite de cláusulas e o 'offset' ignora as cláusulas indicadas
            * ?limit=[valor_numérico] ou ?offset=[valor_numérico]&limit=[valor_numérico] */
            const { limit, offset } = req.query;
            let result;
            
            if(req.params.id)
                result = await getByIdOcorrenciaService.execute(req.params.id);
            else
                result = await getOcorrenciaService.execute({ limit, offset });

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
            await saveOcorrenciaService.execute(data, req.shark);

            return res.status(204).send();
        }
        catch(err) { next(err); }
    }

    async delete(req: Request, res: Response, next: NextFunction)
    {
        try
        {
            await deleteOcorrenciaService.execute(req.params.id, req.shark);

            return res.status(204).send();
        }
        catch(err) { next(err); }
    }
}

export default new OcorrenciaController;