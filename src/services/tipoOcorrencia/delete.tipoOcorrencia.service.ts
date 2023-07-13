/* eslint-disable @typescript-eslint/no-non-null-assertion */
import TipoOcorrenciaRepository from "../../database/repositories/TipoOcorrenciaRepository";
import { errMsg } from "../../helpers/ErrorMessages";
import { checkId, valueExists } from "../../helpers/validation";
import { BadRequestError } from "../../middlewares/Error.middleware";
import { TipoOcorrencia } from "../../models/TipoOcorrencia";

class DeleteTipoOcorrenciaService 
{
    /**
     * Serviço responsável pela remoção de um tipo de ocorrência através do identificador.
     * @param id - o identificador do índice a ser removido.
     */
    async execute(id: any): Promise<void>
    {
        id = checkId(id);
        
        if(id >= 1 && id <= 7)
            throw new BadRequestError("Não é possível deletar o índice, pois ele faz parte da lógica do sistema.");
            
        const tipoOcorrencia: TipoOcorrencia = { id: id, nome: ""};
        
        const result = await TipoOcorrenciaRepository.getById(tipoOcorrencia.id!);
        valueExists(result, errMsg.TIPO_OCORRENCIA.NOT_FOUND);
            
        await TipoOcorrenciaRepository.delete(tipoOcorrencia.id!);
    }
}

export default new DeleteTipoOcorrenciaService;