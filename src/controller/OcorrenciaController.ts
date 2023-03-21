import dotenv from 'dotenv';
dotenv.config();

import { Request, Response } from "express";
import { valueExists } from "../helpers/validation";
import Ocorrencia from '../model/Ocorrencia';
import OcorrenciaDAO from '../database/queries/OcorrenciaDAO';

class OcorrenciaController
{
    /* Pega todos os usuários ou apenas um usuário */
    async select(req: Request, res: Response)
    { 
        try
        {
            if(req.params.id)
            { 
                const result = await OcorrenciaDAO.getById(Number(req.params.id))
                    .catch(err => { return res.status(500).send({ message: err }) });
                valueExists(result, "A ocorrencia não existe!");

                return res.status(200).json(result);
            }
            else
            {
                await OcorrenciaDAO.select()
                    .then(ocorrencia => {
                        return res.status(200).json(ocorrencia);
                    })
                    .catch(err => { return res.status(500).send({ message: err }) });
            }
        } 
        catch (err) { return res.status(400).send({ message: err }); }
    }

    /* Salva ou atualiza usuário */
    async save(req: Request, res: Response)
    {
        const data = { ...req.body };
        if(req.params.id) data.id = req.params.id;
        if(!data.data_ocorrido) data.data_ocorrido = new Date();
        
        const ocorrencia = new Ocorrencia({
            id: data.id,
            data_ocorrido: data.data_ocorrido,
            id_tipo_ocorrencia: data.tipo_ocorrencia,
            id_tipo_assunto: data.tipo_assunto,
            mensagem: data.mensagem,
            valor_metragem: Number(data.valor_metragem),
            id_shark: req.shark.id
        });

        try
        {
            // Se o id estiver setado verifica se o usuário existe
            if(ocorrencia.getId())
            {
                const result = await OcorrenciaDAO.getById(Number(ocorrencia.getId()))
                    .catch(err => { return res.status(500).send({ message: err }) });
                valueExists(result, "A ocorrência não foi encontrada!");
            }

            valueExists(ocorrencia.getIdTipoOcorrencia(), "Tipo de ocorrência não informada.");
            valueExists(ocorrencia.getIdTipoAssunto(), "Tipo do assunto não informado.");
            valueExists(ocorrencia.getMensagem(), "Mensagem não informada.");

            if((req.shark.admin != 1) && (ocorrencia.getIdTipoOcorrencia() != 1))
                throw "Usuário não administrador só pode enviar ocorrências do tipo justificativa.";
        } 
        catch (err) { return res.status(400).send({ message: err }); }
 

        if(ocorrencia.getId())
        {   // update
            const idInserted = await OcorrenciaDAO.update(ocorrencia)
                .catch(err => res.status(500).send({ message: err }));
            
            await OcorrenciaDAO.insertOcorrenciaLog(2, idInserted, req.shark.id)
                .catch(err => res.status(500).send({ message: err }));
            
            return res.status(204).send();
        }
        else
        {   // create
            const idInserted = await OcorrenciaDAO.insert(ocorrencia)
                .catch(err => res.status(500).send({ message: err }));
            
            await OcorrenciaDAO.insertOcorrenciaLog(1, idInserted, req.shark.id)
                .catch(err => res.status(500).send({ message: err }));
            
            return res.status(204).send();
        }   
    }

    async delete(req: Request, res: Response)
    {
        const ocorrenciaId = Number(req.params.id);
        
        try
        {   // Verifica se o usuário existe e então o apaga
            const result = await OcorrenciaDAO.getById(ocorrenciaId)
                .catch(err => { return res.status(500).send({ message: err }) });
            valueExists(result, "A ocorrência não foi encontrada!");
            
            const idDeleted = await OcorrenciaDAO.delete(ocorrenciaId)
                .catch(err => res.status(500).send({ message: err }));
            
            await OcorrenciaDAO.insertOcorrenciaLog(3, idDeleted, req.shark.id)
                .catch(err => res.status(500).send({ message: err }));    

            return res.status(204).send();
        }
        catch(err) { return res.status(400).send({message: err}) }
    }
}

export default new OcorrenciaController;