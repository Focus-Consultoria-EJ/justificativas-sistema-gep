/* eslint-disable @typescript-eslint/no-non-null-assertion */
import CelulaRepository from "../../database/repositories/CelulaRepository";
import { errMsg } from "../../helpers/ErrorMessages";
import { checkId, valueExists } from "../../helpers/validation";
import { BadRequestError } from "../../middlewares/Error.middleware";
import { Celula } from "../../models/Celula";

class DeleteCelulaService 
{
    /**
     * Serviço responsável pela remoção de uma célula através do identificador.
     * @param id - o identificador do índice a ser removido.
     */
    async execute(id: any): Promise<void>
    {
        id = checkId(id);

        if(id >= 1 && id <= 6)
            throw new BadRequestError("Não é possível deletar o índice, pois ele faz parte da lógica do sistema.");

        const celula: Celula = { id: id, nome: ""};
        
        const dataCelula = await CelulaRepository.getById(celula.id!);
        valueExists(dataCelula, errMsg.CELULA.NOT_FOUND);
            
        await CelulaRepository.delete(celula.id!);
    }
}

export default new DeleteCelulaService;