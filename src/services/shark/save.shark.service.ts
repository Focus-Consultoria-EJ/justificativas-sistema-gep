import EmailPessoalRepository from "../../database/repositories/EmailPessoalRepository";
import SharkRepository from "../../database/repositories/SharkRepository";
import { errMsg } from "../../helpers/ErrorMessages";
import { sharkFormValidation } from "../../helpers/sharkValidation";
import { checkId } from "../../helpers/validation";
import { BadRequestError, InternalServerError } from "../../middlewares/Error.middleware";
import getByIdCelulaService from "../celula/getById.celula.service";
import getByIdDistanciaPercorridaService from "../gestaoNotificacao/distanciaPercorrida/getById.distanciaPercorrida.service";
import getByIdRoleService from "../role/getById.role.service";

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
        let dataForm;

        if(data.id)
            dataForm = await sharkFormValidation(data, true);
        else
            dataForm = await sharkFormValidation(data);

        if(typeof dataForm === "string")
            throw new BadRequestError(dataForm);
            
        if(dataForm.shark.id)
            if(!await SharkRepository.getById(dataForm.shark.id!))
                throw new BadRequestError(errMsg.SHARK.NOT_FOUND);   

        // Verifica se o E-mail já está cadastrado e se ele é do próprio usuário
        if(await SharkRepository.userExists("email", dataForm.shark.email))
        {
            if(dataForm.shark.id)
            {
                if( !(await SharkRepository.verifyIfDataIsFromOwnUser(dataForm.shark.id!, "email", dataForm.shark.email)) )
                    throw new BadRequestError(errMsg.SHARK.EMAIL_EXISTS);
            }
            else
                throw new BadRequestError(errMsg.SHARK.EMAIL_EXISTS);     
        }

        // Verifica se o E-mail Pessoal já está cadastrado e se ele é do próprio usuário
        if(await EmailPessoalRepository.userExists("email", dataForm.emailPessoal.email!))
        {
            if(dataForm.shark.id)
            {
                if( !(await EmailPessoalRepository.verifyIfDataIsFromOwnUser(dataForm.shark.id!, "email", dataForm.emailPessoal.email!)) )
                    throw new BadRequestError(errMsg.SHARK.EMAIL_PESSOAL_EXISTS);
            }
            else
                throw new BadRequestError(errMsg.SHARK.EMAIL_PESSOAL_EXISTS);     
        }

        // Verifica se o cpf já está cadastrado e se ele é do próprio usuário
        if(await SharkRepository.userExists("cpf", dataForm.shark.cpf!))
        {
            if(dataForm.shark.id)
            {
                if( !(await SharkRepository.verifyIfDataIsFromOwnUser(dataForm.shark.id!, "cpf", dataForm.shark.cpf!)) )
                    throw new BadRequestError(errMsg.SHARK.CPF_EXISTS);
            }
            else
                throw new BadRequestError(errMsg.SHARK.CPF_EXISTS);
        }

        // Verifica se a Matrícula já está cadastrada e se ela é do próprio usuário
        if(await SharkRepository.userExists("matricula", dataForm.shark.matricula!))
        {
            if(dataForm.shark.id)
            {
                if( !(await SharkRepository.verifyIfDataIsFromOwnUser(dataForm.shark.id!, "matricula", dataForm.shark.matricula!)) )
                    throw new BadRequestError(errMsg.SHARK.MATRICULA_EXISTS);
            }
            else
                throw new BadRequestError(errMsg.SHARK.MATRICULA_EXISTS);
        }

        // Verifica se o id da célula é válida
        await getByIdCelulaService.execute(dataForm.shark.celula.id);

        // Verifica se o id da distâcia é válida
        await getByIdDistanciaPercorridaService.execute(dataForm.shark.distancia?.id);

        // Verifica se o id da role é válida
        await getByIdRoleService.execute(dataForm.shark.role?.id);

        /* UPDATE */
        if(dataForm.shark.id)
        {   
            if(reqShark)
            {
                await SharkRepository.updateAllData(dataForm.shark, dataForm.emailPessoal).then(async (idShark) => {
                    // Salva o log de usuário
                    await SharkRepository.insertSharkLog(2, idShark, reqShark.id!);
                });
            }
            else
                throw new InternalServerError("O shark da requisição não está setado");
        }

        /* INSERT */
        else
        {   
            if(reqShark)
            {   
                await SharkRepository.insertAllData(dataForm.shark, dataForm.emailPessoal).then(async (idShark) => {
                    // Salva o log de usuário
                    await SharkRepository.insertSharkLog(1, idShark, reqShark.id!);
                }); 
            }
            else
                throw new InternalServerError("O shark da requisição não está setado");
        } 
    }
}

export default new SaveSharkService;