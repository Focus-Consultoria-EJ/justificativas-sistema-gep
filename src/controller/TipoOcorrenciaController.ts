import dotenv from 'dotenv';
dotenv.config();

import { Request, Response } from "express";
import TipoOcorrenciaDAO from '../database/queries/TipoOcorrenciaDAO';
import TipoOcorrencia from '../model/TipoOcorrencia';
import { valueExists } from '../helpers/validation';

class TipoOcorrenciaController
{
    async select(req: Request, res: Response)
    { 
        try
        {
            await TipoOcorrenciaDAO.select()
                .then(ocorrencias => {
                    res.status(200).json(ocorrencias);
                })
                .catch(err => { return res.status(500).send({ message: err }) });
        } 
        catch (err) { return res.status(400).send({ message: err }); }
    }

    async save(req: Request, res: Response)
    {
        const data = { ...req.body };
        if(req.params.id) data.id = req.params.id;

        const tipoOcorrencia = new TipoOcorrencia({ id: data.id, nome: data.nome });

        try
        {
            const dataTipoOcorrencia = await TipoOcorrenciaDAO.getByName(tipoOcorrencia.getNome()!);
            
            // Verifica se o tipo de ocorrência já existe
            if(dataTipoOcorrencia)
                throw "Tipo de Ocorrência já cadastrada.";
        } 
        catch (err) 
        { 
            return res.status(400).send({ message: err }); 
        }


        try
        {
            if(tipoOcorrencia.getId())
                await TipoOcorrenciaDAO.update(tipoOcorrencia);
            else
                await TipoOcorrenciaDAO.insert(tipoOcorrencia);
        } 
        catch (err) 
        { 
            return res.status(500).send({ message: err }); 
        }

        return res.status(204).send();
    }

    async delete(req: Request, res: Response)
    {
        const idTipoOcorrencia = Number(req.params.id);

        try
        {   
            const dataTipoOcorrencia = await TipoOcorrenciaDAO.getById(idTipoOcorrencia);
            valueExists(dataTipoOcorrencia, "Tipo de Ocorrência não encontrada.");
        }
        catch(err) { return res.status(400).send({message: err}) }

        try
        {
            TipoOcorrenciaDAO.delete(idTipoOcorrencia);
        }
        catch(err) { return res.status(500).send({message: err}) }

        return res.status(204).send();
    }
}

export default new TipoOcorrenciaController;