import { NextFunction, Request, Response } from "express";
import getOcorrenciaService from "../../services/gestaoNotificacao/ocorrencia/get.ocorrencia.service";
import deleteOcorrenciaService from "../../services/gestaoNotificacao/ocorrencia/delete.ocorrencia.service";
import saveOcorrenciaService from "../../services/gestaoNotificacao/ocorrencia/save.ocorrencia.service";
import getByIdOcorrenciaService from "../../services/gestaoNotificacao/ocorrencia/getById.ocorrencia.service";
import getLogOcorrenciaService from "../../services/gestaoNotificacao/ocorrencia/getLog.ocorrencia.service";
import getByIdLogOcorrenciaService from "../../services/gestaoNotificacao/ocorrencia/getByIdLog.ocorrencia.service";
import ocorrenciaTelegramNotificacao from "../../services/gestaoNotificacao/ocorrenciaTelegramNotificacao/ocorrenciaTelegramNotificacao.service"

class OcorrenciaController
{
    async select(req: Request, res: Response, next: NextFunction)
    { 
        try
        {
            const { 
                size, page, membroAtivo, 
                nomeSharkCriador, nomeSharkReferente, 
                emailSharkCriador, emailSharkReferente, 
                tipoOcorrencia, tipoAssunto, order } = req.query;
                
            let result;
            
            if(req.params.id)
                result = await getByIdOcorrenciaService.execute(req.params.id);
            else
                result = await getOcorrenciaService.execute({ 
                    size, 
                    page, 
                    membroAtivo,
                    nomeSharkCriador,
                    nomeSharkReferente,
                    emailSharkCriador,
                    emailSharkReferente,
                    tipoOcorrencia,
                    tipoAssunto,
                    order
                });

            res.status(200).json(result);
        }
        catch(err) { next(err); }
    }

    async save(req: Request, res: Response, next: NextFunction)
    {
        const data = { ...req.body };
        if(req.params.id) data.id = req.params.id;
        const file = req.file;
        
        try
        {
            await saveOcorrenciaService.execute(data, req.shark, file);
            if(data.tipoOcorrencia==1)
            {
                await ocorrenciaTelegramNotificacao.enviarParaTelegram(data,req.shark);
            }
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

    async selectLog(req: Request, res: Response, next: NextFunction)
    { 
        try
        {
            const { size, page, order } = req.query;
            
            let result;
            
            if(req.params.id)
                result = await getByIdLogOcorrenciaService.execute(req.params.id);
            else
                result = await getLogOcorrenciaService.execute({ size, page, order });

            res.status(200).json(result);
        }
        catch(err) { next(err); }
    }
}

export default new OcorrenciaController;