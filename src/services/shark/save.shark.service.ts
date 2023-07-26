import SharkRepository from "../../database/repositories/SharkRepository";
import { errMsg } from "../../helpers/ErrorMessages";
import { sharkFormValidation } from "../../helpers/sharkValidation";
import { checkId } from "../../helpers/validation";
import { BadRequestError, InternalServerError } from "../../middlewares/Error.middleware";
import getByIdCelulaService from "../celula/getById.celula.service";
import getByIdDistanciaPercorridaService from "../gestaoNotificacao/distanciaPercorrida/getById.distanciaPercorrida.service";

class SaveSharkService 
{
    /**
     * Serviço responsável pela inserção ou atualização de um shark se o id for passado no parâmetro data.
     * @param data - os dados vindos do header.
     * @param reqShark - os dados do shark salvo na requisição do Express.
     */
    async execute(data: any, reqShark: any): Promise<void>
    {
        data.id = checkId(data.id);
        let shark;

        if(data.id)
            shark = await sharkFormValidation(data, true);
        else
            shark = await sharkFormValidation(data);

        if(typeof shark === "string")
            throw new BadRequestError(shark);

        if(shark.id)
            if(!await SharkRepository.getById(shark.id!))
                throw new BadRequestError(errMsg.SHARK.NOT_FOUND);   

        // Verifica se o E-mail já está cadastrado e se ele é do próprio usuário
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

        // Verifica se o cpf já está cadastrado e se ele é do próprio usuário
        if(await SharkRepository.userExists("cpf", shark.cpf!))
        {
            if(shark.id)
            {
                if( !(await SharkRepository.verifyIfDataIsFromOwnUser(shark.id!, "cpf", shark.cpf!)) )
                    throw new BadRequestError(errMsg.SHARK.CPF_EXISTS);
            }
            else
                throw new BadRequestError(errMsg.SHARK.CPF_EXISTS);
        }

        // Verifica se a Matrícula já está cadastrada e se ela é do próprio usuário
        if(await SharkRepository.userExists("matricula", shark.matricula!))
        {
            if(shark.id)
            {
                if( !(await SharkRepository.verifyIfDataIsFromOwnUser(shark.id!, "matricula", shark.matricula!)) )
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
                await SharkRepository.update(shark).then( async(idShark) => {
                    await SharkRepository.insertSharkLog(2, idShark, reqShark.id!);
                });
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
                await SharkRepository.insert(shark).then(async (idShark) => {
                    await SharkRepository.insertSharkLog(1, idShark, reqShark.id!);
                });
                
            }
            else
                throw new InternalServerError("O shark da requisição não está setado");
        } 
    }
}

export default new SaveSharkService;