import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import db from "../config/connection";
import SharkImageDAO from "../database/queries/SharkImageDAO";
import Shark from "../model/Shark";
import SharkImage from "../model/SharkImage";

/**
 * Middleware responsável por verificar se o usuário está autenticadado e se possui
 * um token válido
 */
const authMiddleware = async (req: Request, res: Response, next: NextFunction) =>
{   
    const { authorization } = req.headers;
	
	// Verifica se o usuário está autenticado
	if (!authorization)
		return res.status(401).send("Não autorizado!");
	
	// pega a posição do token referente a SECRET_TOKEN
	const token = authorization.replace("Bearer", "").trim();

	try
	{
		const data = jwt.verify(token, process.env.SECRET_TOKEN ?? '') as JwtPayload;

		const dataShark = await db("shark")
			.where({ id: data.id })
			.first()
			.then(shark => {
				if(!shark)
					throw "Não foi possível encontrar o usuário, por favor realize o login novamente!";
				else
					return shark;
			});

		const shark = new Shark({
			...dataShark, 
			numProjeto: dataShark.num_projeto,
			membroAtivo: dataShark.membro_ativo
		});

		const dataSharkImage = await SharkImageDAO.getImageBySharkId(shark.getId()!)
			.catch(err => { return res.status(500).send({ message: err }) });

        const sharkImage = new SharkImage({shark: shark, ...dataSharkImage})
		
		// Salva o shark na requisição
		req.shark = {
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
        };
	}
	catch(err) { return res.status(500).send(err); }

	next();
}

export { authMiddleware }

	
