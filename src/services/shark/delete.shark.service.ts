import SharkRepository from "../../database/repositories/SharkRepository";
import { errMsg } from "../../helpers/ErrorMessages";
import { checkId, valueExists } from "../../helpers/validation";
import { InternalServerError } from "../../middlewares/Error.middleware";

class DeleteSharkService 
{
    /**
     * Serviço responsável pela remoção de um shark através do identificador.
     * @param id - o identificador do índice a ser removido.
     * @param reqShark - os dados do shark salvo na requisição do Express. 
     */
    async execute(id: any, reqShark:any): Promise<void>
    {
        id = checkId(id);

        const result = await SharkRepository.getById(id);
        valueExists(result, errMsg.SHARK.NOT_FOUND);

        if(reqShark)
        {
            await SharkRepository.delete(id);
            await SharkRepository.insertSharkLog(3, id, reqShark.id!);
        }
        else
            throw new InternalServerError("O shark da requisição não está setado");
    }
}

export default new DeleteSharkService;