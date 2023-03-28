import dotenv from 'dotenv';
dotenv.config();

import { Request, Response } from "express";
import { valueExists } from "../helpers/validation";
import Shark from "../model/Shark";
import { passwordEncrypt } from '../middlewares/passwordMiddleware';
import SharkDAO from '../database/queries/SharkDAO';
import SharkImageDAO from '../database/queries/SharkImageDAO';
import SharkImage from '../model/SharkImage';
import S3Storage from '../utils/s3Storage';

class SharkController
{
    /* Pega todos os usuários ou apenas um usuário */
    async select(req: Request, res: Response)
    { 
        /* O 'limit' limite de cláusulas e o 'offset' ignora as cláusulas indicadas
         * ?limit=[valor_numérico] ou ?offset=[valor_numérico]&limit=[valor_numérico]
        */
        const { limit, offset } = req.query;
        
        try
        {
            /* SELECT ONE */
            if(req.params.id)
            { 
                const result = await SharkDAO.getByIdWithImage(Number(req.params.id))
                    .catch(err => { return res.status(500).send({ message: err }) });
                valueExists(result, "O Usuário não existe.");

                return res.status(200).json(result);
            }

            /* SELECT */
            else
            {
                await SharkDAO.selectWithImage(Number(limit), Number(offset))
                    .then(shark => {
                        res.status(200).json(shark);
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
        const file = req.file as Express.MulterS3.File;

        const shark = new Shark({
            ...data,
            numProjeto: data.num_projeto,
            membroAtivo: data.membro_ativo,
            dataCriacao: data.data_criacao
        });

        try
        {
            // Se o id estiver setado verifica se o usuário existe
            if(shark.getId())
            {
                const dataShark = await SharkDAO.getById(Number(shark.getId()))
                    .catch(err => { return res.status(500).send({ message: err }) });
                valueExists(dataShark, "O usuário não foi encontrado.");
            }

            // Valida campos
            valueExists(shark.getNome(), "Nome não informado.");
            valueExists(shark.getTelefone(), "Telefone não informado.");
            valueExists(shark.getEmail(), "E-mail não informado.");
            valueExists(shark.getMatricula(), "Matrícula não informada.");
            valueExists(shark.getSenha(), "Senha não informada.");
            valueExists(shark.getArea(), "Área não informada.");

            if(typeof shark.getAdmin() != "undefined" && !(Number(shark.getAdmin()) >= 0 && Number(shark.getAdmin()) <= 1))
                throw "Valor de administrador inválido.";
            
            // Criptografa a Senha
            shark.setSenha(await passwordEncrypt(shark.getSenha()));

            // Verifica se o E-mail já está cadastrado e verifica se o email é do próprio usuário
            if(await SharkDAO.userExists({email: shark.getEmail()}))
            {
                if(shark.getId())
                {
                    if( !(await SharkDAO.verifyIfDataIsFromOwnUser(shark.getId()!, {email: shark.getEmail()})) )
                        throw ("E-mail já cadastrado.");
                }
                else
                    throw ("E-mail já cadastrado.");
            }
                
            // Verifica se a Matrícula já está cadastrada e verifica se a matrícula é do próprio usuário
            if(await SharkDAO.userExists({matricula: shark.getMatricula()}))
            {
                if(shark.getId())
                {
                    if( !(await SharkDAO.verifyIfDataIsFromOwnUser(shark.getId()!, {matricula: shark.getMatricula()})) )
                        throw ("Matrícula já cadastrada.");
                }
                else
                    throw ("Matrícula já cadastrada.");
            }
        } 
        catch (err) 
        { 
            // Se for acusado erro, remove o arquivo do S3 ou local
            if(req.file && process.env.STORAGE_TYPE == "s3")
                await new S3Storage().deleteFile(file.key);
            else if(req.file && process.env.STORAGE_TYPE == "local")
                SharkImageDAO.deleteImageFromPath(file.path);
                
            return res.status(400).send({ message: err }); 
        }
        

        try
        {
            /* UPDATE */
            if(shark.getId())
            {   
                const idShark = await SharkDAO.update(shark)
                    .catch(err => { return res.status(500).send({ message: err }) });
                
                // Salva o log de usuário
                SharkDAO.insertSharkLog(2, idShark, req.shark.id)
                    .catch(err => { return res.status(500).send({ message: err }) });
                
                if(req.file)
                {
                    const dataImageShark = await SharkImageDAO.getImageBySharkId(Number(shark.getId()))
                    
                    if(dataImageShark)
                    {
                        const sharkImage = new SharkImage({ shark: shark, ...dataImageShark });
                        const result = await SharkImageDAO.delete(Number(sharkImage.getId()))
                            .catch(err => { return res.status(500).send({ message: err }) });

                        if(result)
                        {
                            if(req.file && process.env.STORAGE_TYPE == "s3")
                                await new S3Storage().deleteFile(sharkImage.getHashname());
                            else if(req.file && process.env.STORAGE_TYPE == "local")
                                SharkImageDAO.deleteImageFromPath(sharkImage.getUrl());
                        }
                    }
                    
                    // salva a imagem
                    await SharkImageDAO.insert({
                        filename: file.originalname,
                        size: file.size,
                        hashname: (process.env.STORAGE_TYPE == "s3") ? file.key : file.filename,
                        url: (process.env.STORAGE_TYPE == "s3") ? file.location : file.path,
                        id_shark: Number(shark.getId())
                    })
                    .catch(err => { return res.status(500).send({ message: err }) });
                }
            }

            /* INSERT */
            else
            {   
                const idShark = await SharkDAO.insert(shark)
                    .catch(err => { return res.status(500).send({ message: err }) });
                
                // Salva o log de usuário
                SharkDAO.insertSharkLog(1, idShark, req.shark.id)
                    .catch(err => { return res.status(500).send({ message: err }) });

                if(req.file)
                {
                    // salva a imagem
                    await SharkImageDAO.insert({
                        filename: file.originalname,
                        size: file.size,
                        hashname: (process.env.STORAGE_TYPE == "s3") ? file.key : file.filename,
                        url: (process.env.STORAGE_TYPE == "s3") ? file.location : file.path,
                        id_shark: idShark
                    })
                    .catch(err => { return res.status(500).send({ message: err }) });
                }
            } 

            return res.status(204).send();
        } 
        catch (err) { return res.status(500).send({ message: err }); }
    }

    async delete(req: Request, res: Response)
    {
        const sharkID = Number(req.params.id);

        try
        {   
            const result = await SharkDAO.getById(sharkID)
                .catch(err => { return res.status(500).send({ message: err }) });
            valueExists(result, "O usuário não foi encontrado.");
        }
        catch(err) { return res.status(400).send({message: err}) }

        try
        {
            // Caso exista a imagem, salva os dados dela na variável antes de ser removida pelo código abaixo
            const dataImageShark = await SharkImageDAO.getImageBySharkId(sharkID)
                .catch(err => { return res.status(500).send({ message: err }) });

            // Remove o usuário e todos os índices vínculados a ele
            await SharkDAO.delete(sharkID)
                .catch(err => { return res.status(500).send({ message: err }) });

            await SharkDAO.insertSharkLog(3, sharkID, req.shark.id)
                .catch(err => { return res.status(500).send({ message: err }) });

            // Verifica se o usuário tinha um arquivo de upload
            if(dataImageShark)
            {
                const sharkImage = new SharkImage(dataImageShark);
                
                if(process.env.STORAGE_TYPE == "s3")
                    await new S3Storage().deleteFile(sharkImage.getHashname());
                else if(process.env.STORAGE_TYPE == "local")
                    SharkImageDAO.deleteImageFromPath(sharkImage.getUrl());
            }
            
            return res.status(204).send();
        }
        catch(err) { return res.status(500).send({message: err}) }
    }
    
    async getShark(req: Request, res: Response) 
    {
        return res.status(200).json(req.shark);        
    }
}

export default new SharkController;