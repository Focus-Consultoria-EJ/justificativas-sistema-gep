/* eslint-disable @typescript-eslint/no-non-null-assertion */
import TipoOcorrenciaRepository from "../../database/repositories/TipoOcorrenciaRepository";
import { errMsg } from "../../helpers/ErrorMessages";
import { checkId, valueExists } from "../../helpers/validation";
import { TipoOcorrencia } from "../../models/TipoOcorrencia";

class DeleteTipoOcorrenciaService 
{
    async execute(id: any): Promise<void>
    {
        id = checkId(id);

        const tipoOcorrencia: TipoOcorrencia = { id: id, nome: ""};
        
        const result = await TipoOcorrenciaRepository.getById(tipoOcorrencia.id!);
        valueExists(result, errMsg.TIPO_OCORRENCIA.NOT_FOUND);
            
        await TipoOcorrenciaRepository.delete(tipoOcorrencia.id!);
    }
}

export default new DeleteTipoOcorrenciaService;