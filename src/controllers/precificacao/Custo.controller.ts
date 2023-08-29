import { NextFunction, Request, Response } from "express";
import getByIdCustoService from "../../services/precificacao/custo/getById.custo.service";
import getCustoService from "../../services/precificacao/custo/get.custo.service";
import saveCustoService from "../../services/precificacao/custo/save.custo.service";
import deleteCustoService from "../../services/precificacao/custo/delete.custo.service";

class CustoController
{
    async select(req: Request, res: Response, next: NextFunction)
    { 
        try
        {
            let result;
            
            if(req.params.id)
                result = await getByIdCustoService.execute(req.params.id);
            else
                result = await getCustoService.execute();

            res.status(200).json(result);
        }
        catch(err) { next(err); }
    }

    async save(req: Request, res: Response, next: NextFunction)
    {
        const data = { ...req.body };
        if(req.params.id) data.id = req.params.id;
        const contentType = req.get("Content-Type");

        try
        {
            await saveCustoService.execute(data, contentType);

            return res.status(204).send();
        }
        catch(err) { next(err); }
    }

    async delete(req: Request, res: Response, next: NextFunction)
    {
        try
        {
            await deleteCustoService.execute(req.params.id);

            return res.status(204).send();
        }
        catch(err) { next(err); }
    }
}

export default new CustoController;