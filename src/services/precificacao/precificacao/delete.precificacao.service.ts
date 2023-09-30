import PrecificacaoRepository from "../../../database/repositories/precificacao/PrecificacaoRepository";
import { errMsg } from "../../../helpers/ErrorMessages";
import { checkId, valueExists } from "../../../helpers/validation";


class DeletePrecificacaoService 
{
    /**
     * Serviço responsável pela remoção de um precificacao através do identificador.
     * @param id - o identificador do índice a ser removido.
     */
    async execute(id: any): Promise<void>
    {
        id = checkId(id);

        const data = await PrecificacaoRepository.getById(id);
        valueExists(data, errMsg.PRECIFICACAO.NOT_FOUND);
            
        await PrecificacaoRepository.delete(id);
    }
}

export default new DeletePrecificacaoService;