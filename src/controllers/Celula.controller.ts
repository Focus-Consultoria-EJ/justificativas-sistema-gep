import { NextFunction, Request, Response } from "express";
import getCelulaService from "../services/celula/get.celula.service";
import saveCelulaService from "../services/celula/save.celula.service";
import deleteCelulaService from "../services/celula/delete.celula.service";

class CelulaController
{
    async select(req: Request, res: Response, next: NextFunction)
    { 
        try
        {
            const result = await getCelulaService.execute();

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
            await saveCelulaService.execute(data);

            return res.status(204).send();
        }
        catch(err) { next(err); }
    }

    async delete(req: Request, res: Response, next: NextFunction)
    {
        try
        {
            await deleteCelulaService.execute(req.params.id);

            return res.status(204).send();
        }
        catch(err) { next(err); }
    }
}

export default new CelulaController;