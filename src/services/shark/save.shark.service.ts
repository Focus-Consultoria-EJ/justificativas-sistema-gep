import SharkRepository from "../../database/repositories/SharkRepository";
import { errMsg } from "../../helpers/ErrorMessages";
import { sharkFormValidation } from "../../helpers/sharkValidation";
import { checkId } from "../../helpers/validation";
import { BadRequestError, InternalServerError } from "../../middlewares/Error.middleware";
import { passwordEncrypt } from "../../middlewares/passwordMiddleware";
import { Shark } from "../../models/Shark";
import getByIdCelulaService from "../celula/getById.celula.service";
import getByIdDistanciaPercorridaService from "../distanciaPercorrida/getById.distanciaPercorrida.service";

class SaveSharkService 
{
    async execute(data: any, reqShark: any): Promise<void>
    {
        data.id = checkId(data.id);
        
        data = await sharkFormValidation(data);
        
        if(typeof data === "string")
            throw new BadRequestError(data);
        
        const shark: Shark = { 
            id: data.id, 
            nome: data.nome,
            email: data.email,
            telefone: data.telefone,
            distancia: { id: data.distancia },
            matricula: data.matricula,
            senha: data.senha,
            celula: { id: data.celula },
            numProjeto: data.num_projeto,
            metragem: data.metragem ?? 24,
            admin: data.admin ?? false,
            membroAtivo: data.membro_ativo ?? true
        };  

        if(data.id)
            if(!await SharkRepository.getById(shark.id!))
                throw new BadRequestError(errMsg.SHARK.NOT_FOUND);   
        
        // Criptografa a Senha
        shark.senha = await passwordEncrypt(shark.senha);

        // Verifica se o E-mail já está cadastrado e verifica se o email é do próprio usuário
        if(await SharkRepository.userExists("email", shark.email))
        {
            if(shark.id)
            {
                if( !(await SharkRepository.verifyIfDataIsFromOwnUser(shark.id!, "email", shark.email)) )
                    throw new BadRequestError(errMsg.SHARK.EMAIL_EXISTS);
            }
            else
                throw new BadRequestError(errMsg.SHARK.EMAIL_EXISTS);     
        }

        // Verifica se a Matrícula já está cadastrada e verifica se a matrícula é do próprio usuário
        if(await SharkRepository.userExists("matricula", shark.matricula))
        {
            if(shark.id)
            {
                if( !(await SharkRepository.verifyIfDataIsFromOwnUser(shark.id!, "matricula", shark.matricula)) )
                    throw new BadRequestError(errMsg.SHARK.MATRICULA_EXISTS);
            }
            else
                throw new BadRequestError(errMsg.SHARK.MATRICULA_EXISTS);
        }

        // Verifica se o id da célula é válida
        await getByIdCelulaService.execute(shark.celula.id);

        // Verifica se o id da distâcia é válida
        await getByIdDistanciaPercorridaService.execute(shark.distancia?.id);
        
        /* UPDATE */
        if(shark.id)
        {   
            // Salva o log de usuário
            if(reqShark)
            {
                const idShark = await SharkRepository.update(shark);
                SharkRepository.insertSharkLog(2, idShark, reqShark.id!);
            }
            else
                throw new InternalServerError("O shark da requisição não está setado");
        }

        /* INSERT */
        else
        {   
            // Salva o log de usuário
            if(reqShark)
            {
                const idShark = await SharkRepository.insert(shark);
                await SharkRepository.insertSharkLog(1, idShark, reqShark.id!);
            }
            else
                throw new InternalServerError("O shark da requisição não está setado");
        } 
    }
}

export default new SaveSharkService;