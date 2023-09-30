import { NextFunction, Request, Response } from "express";
import getByIdPorteClienteService from "../../services/precificacao/porteCliente/getById.porteCliente.service";
import getPorteClienteService from "../../services/precificacao/porteCliente/get.porteCliente.service";
import savePorteClienteService from "../../services/precificacao/porteCliente/save.porteCliente.service";
import deletePorteClienteService from "../../services/precificacao/porteCliente/delete.porteCliente.service";

class PorteClienteController
{
    async select(req: Request, res: Response, next: NextFunction)
    { 
        try
        {
            let result;
            
            if(req.params.id)
                result = await getByIdPorteClienteService.execute(req.params.id);
            else
                result = await getPorteClienteService.execute();

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
            await savePorteClienteService.execute(data);

            return res.status(204).send();
        }
        catch(err) { next(err); }
    }

    async delete(req: Request, res: Response, next: NextFunction)
    {
        try
        {
            await deletePorteClienteService.execute(req.params.id);

            return res.status(204).send();
        }
        catch(err) { next(err); }
    }
}

export default new PorteClienteController;