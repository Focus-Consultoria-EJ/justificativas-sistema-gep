import { NextFunction, Request, Response } from "express";
import getDistanciaPercorridaService from "../services/distanciaPercorrida/get.distanciaPercorrida.service";
import saveDistanciaPercorridaService from "../services/distanciaPercorrida/save.distanciaPercorrida.service";
import deleteDistanciaPercorridaService from "../services/distanciaPercorrida/delete.distanciaPercorrida.service";

class DistanciaResidenciaController
{
    async select(req: Request, res: Response, next: NextFunction)
    { 
        try
        {
            const result = await getDistanciaPercorridaService.execute();

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
            await saveDistanciaPercorridaService.execute(data);

            return res.status(204).send();
        }
        catch(err) { next(err); }
    }

    async delete(req: Request, res: Response, next: NextFunction)
    {
        try
        {
            await deleteDistanciaPercorridaService.execute(req.params.id);

            return res.status(204).send();
        }
        catch(err) { next(err); }
    }
}

export default new DistanciaResidenciaController;