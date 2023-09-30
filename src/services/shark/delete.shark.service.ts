import SharkRepository from "../../database/repositories/SharkRepository";
import { errMsg } from "../../helpers/ErrorMessages";
import { checkId, valueExists } from "../../helpers/validation";
import { BadRequestError, InternalServerError } from "../../middlewares/Error.middleware";
import { Shark } from "../../models/Shark";

class DeleteSharkService 
{
    /**
     * Serviço responsável por atualizar o membro ativo do shark para true caso não seja super admin
     * ou remover um shark caso seja.
     * @param id - o identificador do índice a ser removido.
     * @param reqShark - os dados do shark salvo na requisição do Express. 
     */
    async execute(id: any, reqShark: Partial<Shark>): Promise<void>
    {
        id = checkId(id);

        const result = await SharkRepository.getById(id);
        valueExists(result, errMsg.SHARK.NOT_FOUND);
        
        if(reqShark)
        {
            if(reqShark.id === Number(id))
                throw new BadRequestError("Não é possível apagar o próprio usuário.");

            if(reqShark.role?.id === 3)
            {
                await SharkRepository.delete(id).then(async () => {
                    await SharkRepository.insertSharkLog(3, id, reqShark.id!);
                });
            }
            else
            {
                await SharkRepository.softDelete(id).then(async () => {
                    await SharkRepository.insertSharkLog(3, id, reqShark.id!);
                });
            }
        }
        else
            throw new InternalServerError("O shark da requisição não está setado");
    }
}

export default new DeleteSharkService;