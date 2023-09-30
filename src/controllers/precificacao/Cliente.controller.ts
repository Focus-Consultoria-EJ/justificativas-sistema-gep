import { NextFunction, Request, Response } from "express";
import getByIdClienteService from "../../services/precificacao/cliente/getById.cliente.service";
import getClienteService from "../../services/precificacao/cliente/get.cliente.service";
import saveClienteService from "../../services/precificacao/cliente/save.cliente.service";
import deleteClienteService from "../../services/precificacao/cliente/delete.cliente.service";

class ClienteController
{
    async select(req: Request, res: Response, next: NextFunction)
    { 
        try
        {
            let result;
            
            if(req.params.id)
                result = await getByIdClienteService.execute(req.params.id);
            else
                result = await getClienteService.execute();

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
            await saveClienteService.execute(data);

            return res.status(204).send();
        }
        catch(err) { next(err); }
    }

    async delete(req: Request, res: Response, next: NextFunction)
    {
        try
        {
            await deleteClienteService.execute(req.params.id);

            return res.status(204).send();
        }
        catch(err) { next(err); }
    }
}

export default new ClienteController;