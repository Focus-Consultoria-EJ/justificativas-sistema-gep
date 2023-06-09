/* eslint-disable @typescript-eslint/no-non-null-assertion */
import CelulaRepository from "../../database/repositories/CelulaRepository";
import { errMsg } from "../../helpers/ErrorMessages";
import { checkId, valueExists } from "../../helpers/validation";
import { Celula } from "../../models/Celula";

class DeleteCelulaService 
{
    async execute(id: any): Promise<void>
    {
        id = checkId(id);

        const celula: Celula = { id: id, nome: ""};
        
        const dataCelula = await CelulaRepository.getById(celula.id!);
        valueExists(dataCelula, errMsg.CELULA.NOT_FOUND);
            
        await CelulaRepository.delete(celula.id!);
    }
}

export default new DeleteCelulaService;