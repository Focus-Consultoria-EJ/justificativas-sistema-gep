import dotenv from 'dotenv';
dotenv.config();

import { Request, Response } from "express"
import db from "../config/connection";
import Shark from "../model/Shark";
import { passwordCompare } from '../middlewares/passwordMiddleware';
import jwt from "jsonwebtoken";
import SharkImage from '../model/SharkImage';
import SharkImageDAO from '../database/queries/SharkImageDAO';

class AuthController
{   // Controller responsável pelo login
    async login(req: Request, res: Response)
    {
        const data = { ...req.body };

        // Verifica se os campos existem
        if (!data.login || !data.senha)
            return res.status(400).send({ message: "Informe um usuário e senha!" });

        const dataShark = await db("shark")
            .where({ email: data.login })
            .orWhere({ matricula: data.login })
            .first();
        
        if(!dataShark) 
            return res.status(400).send("Não foi possível realizar o login pois o usuário não foi encontrado, por favor informe outro usuário");

        const shark = new Shark({
            ...dataShark, 
            numProjeto: dataShark.num_projeto,
            membroAtivo: dataShark.membro_ativo
        });

        const dataSharkImage = await SharkImageDAO.getImageBySharkId(shark.getId()!)
            .catch(err => { return res.status(500).send({ message: err }) });
            
        const sharkImage = new SharkImage({shark: shark, ...dataSharkImage})

        // Verifica se a senha digitada é igual ao do banco de dados
        if( !(await passwordCompare(data.senha, shark.getSenha())) )
            return res.status(401).send({ message: "E-mail ou senha inválidos!" });
        
        if(!process.env.SECRET_TOKEN)
            throw new Error('O Token secreto deve estar definido!');

        const payload = {
            id: sharkImage.getShark().getId(),
            nome: sharkImage.getShark().getNome(),
            email: sharkImage.getShark().getEmail(),
            telefone: sharkImage.getShark().getTelefone(),
            matricula: sharkImage.getShark().getMatricula(),
            area: sharkImage.getShark().getArea(),
            num_projeto: sharkImage.getShark().getNumProjeto(),
            metragem: sharkImage.getShark().getMetragem(),
            admin: sharkImage.getShark().getAdmin(),
            membro_ativo: sharkImage.getShark().getMembroAtivo(),
            image_url: sharkImage.getUrl() ?? null
        }

        // Envia os dados e gera o token    
        const token = jwt.sign(payload, process.env.SECRET_TOKEN as string, { expiresIn: "1d" });
                
        res.json({ payload, token });
    }
}

export default new AuthController;