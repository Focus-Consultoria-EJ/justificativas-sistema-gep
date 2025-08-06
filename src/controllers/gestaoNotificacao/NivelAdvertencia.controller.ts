import { NextFunction, Request, Response } from "express";
import getByIdNivelAdvertenciaService from "../../services/gestaoNotificacao/nivelAdvertencia/getById.nivelAdvertencia.service";
import getNivelAdvertenciaService from "../../services/gestaoNotificacao/nivelAdvertencia/get.nivelAdvertencia.service";
import saveNivelAdvertenciaService from "../../services/gestaoNotificacao/nivelAdvertencia/save.nivelAdvertencia.service";
import deleteNivelAdvertenciaService from "../../services/gestaoNotificacao/nivelAdvertencia/delete.nivelAdvertencia.service";

class NivelAdvertenciaController
{
    async select(req: Request, res: Response, next: NextFunction)
    { 
        try
        {
            let result;
            
            if(req.params.id)
                result = await getByIdNivelAdvertenciaService.execute(req.params.id);
            else
                result = await getNivelAdvertenciaService.execute();

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
            await saveNivelAdvertenciaService.execute(data);

            return res.status(204).send();
        }
        catch(err) { next(err); }
    }

    async delete(req: Request, res: Response, next: NextFunction)
    {
        try
        {
            await deleteNivelAdvertenciaService.execute(req.params.id);

            return res.status(204).send();
        }
        catch(err) { next(err); }
    }
}

export default new NivelAdvertenciaController;