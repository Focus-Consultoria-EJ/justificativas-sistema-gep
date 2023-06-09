import OcorrenciaRepository from "../../database/repositories/OcorrenciaRepository";
import { errMsg } from "../../helpers/ErrorMessages";
import { checkId, valueExists } from "../../helpers/validation";
import { Shark } from "../../models/Shark";

class DeleteOcorrenciaService 
{
    async execute(id: any, reqShark: Shark): Promise<void>
    {
        id = checkId(id);

        const result = await OcorrenciaRepository.getById(id);
        valueExists(result, errMsg.OCORRENCIA.NOT_FOUND);
            
        await OcorrenciaRepository.delete(id);
        await OcorrenciaRepository.insertOcorrenciaLog(3, id, reqShark.id!);
    }
}

export default new DeleteOcorrenciaService;