import dotenv from 'dotenv';
dotenv.config();

import { Request, Response } from "express";
import TipoAssuntoDAO from '../database/queries/TipoAssuntoDAO';
import TipoAssunto from '../model/TipoAssunto';
import { valueExists } from '../helpers/validation';

class TipoAssuntoController
{
    async select(req: Request, res: Response)
    { 
        try
        {
            await TipoAssuntoDAO.select()
                .then(assuntos => {
                    res.status(200).json(assuntos);
                })
                .catch(err => { return res.status(500).send({ message: err }) });
        } 
        catch (err) { return res.status(400).send({ message: err }); }
    }

    async save(req: Request, res: Response)
    {
        const data = { ...req.body };
        if(req.params.id) data.id = req.params.id;

        const tipoAssunto = new TipoAssunto({ id: data.id, nome: data.nome });

        try
        {
            const datatipoAssunto = await TipoAssuntoDAO.getByName(tipoAssunto.getNome()!);
            
            // Verifica se o tipo de ocorrência já existe
            if(datatipoAssunto)
                throw "Tipo de assunto já cadastrado.";
        } 
        catch (err) 
        { 
            return res.status(400).send({ message: err }); 
        }


        try
        {
            if(tipoAssunto.getId())
                await TipoAssuntoDAO.update(tipoAssunto);
            else
                await TipoAssuntoDAO.insert(tipoAssunto);
        } 
        catch (err) 
        { 
            return res.status(500).send({ message: err }); 
        }

        return res.status(204).send();
    }

    async delete(req: Request, res: Response)
    {
        const idtipoAssunto = Number(req.params.id);

        try
        {   
            const datatipoAssunto = await TipoAssuntoDAO.getById(idtipoAssunto);
            valueExists(datatipoAssunto, "Tipo de Assunto não encontrado.");
        }
        catch(err) { return res.status(400).send({message: err}) }

        try
        {
            TipoAssuntoDAO.delete(idtipoAssunto);
        }
        catch(err) { return res.status(500).send({message: err}) }

        return res.status(204).send();
    }
}

export default new TipoAssuntoController;