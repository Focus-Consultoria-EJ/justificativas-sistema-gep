import dotenv from 'dotenv';
dotenv.config();

import { Request, Response } from "express";
import { valueExists } from "../helpers/validation";
import Ocorrencia from '../model/Ocorrencia';
import OcorrenciaDAO from '../database/queries/OcorrenciaDAO';
import TipoOcorrencia from '../model/TipoOcorrencia';
import TipoAssunto from '../model/TipoAssunto';
import Shark from '../model/Shark';

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
            dataOcorrido: data.data_ocorrido,
            tipoOcorrencia: new TipoOcorrencia({ id: data.tipo_ocorrencia }),
            tipoAssunto: new TipoAssunto({ id: data.tipo_assunto }),
            mensagem: data.mensagem,
            valorMetragem: Number(data.valor_metragem),
            shark: new Shark({
                id: req.shark.id,
                nome: req.shark.nome,
                email: req.shark.email,
                telefone: req.shark.telefone,
                matricula: req.shark.matricula,
                admin: req.shark.admin,
                area: req.shark.area,
                metragem: req.shark.metragem,
                senha: ""
            })
        });

        try
        {
            // Se o id estiver setado verifica se a ocorrência existe
            if(ocorrencia.getId())
            {
                const result = await OcorrenciaDAO.getById(Number(ocorrencia.getId()))
                    .catch(err => { return res.status(500).send({ message: err }) });
                valueExists(result, "A ocorrência não foi encontrada!");
            }

            valueExists(ocorrencia.getTipoOcorrencia(), "Tipo de ocorrência não informada.");
            valueExists(ocorrencia.getTipoAssunto(), "Tipo do assunto não informado.");
            valueExists(ocorrencia.getMensagem(), "Mensagem não informada.");

            if((req.shark.admin != 1) && (ocorrencia.getTipoOcorrencia().getId() != 1))
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
            
            await OcorrenciaDAO.delete(ocorrenciaId)
                .catch(err => res.status(500).send({ message: err }));
            
            await OcorrenciaDAO.insertOcorrenciaLog(3, ocorrenciaId, req.shark.id)
                .catch(err => res.status(500).send({ message: err }));    

            return res.status(204).send();
        }
        catch(err) { return res.status(400).send({message: err}) }
    }
}

export default new OcorrenciaController;