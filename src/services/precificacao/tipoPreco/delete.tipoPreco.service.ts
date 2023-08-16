import TipoPrecoRepository from "../../../database/repositories/precificacao/TipoPrecoRepository";
import { errMsg } from "../../../helpers/ErrorMessages";
import { checkId, valueExists } from "../../../helpers/validation";


class DeleteTipoPrecoService 
{
    /**
     * Serviço responsável pela remoção de um tipo de preço através do identificador.
     * @param id - o identificador do índice a ser removido.
     */
    async execute(id: any): Promise<void>
    {
        id = checkId(id);

        const data = await TipoPrecoRepository.getById(id);
        valueExists(data, errMsg.TIPO_PRECO.NOT_FOUND);
            
        await TipoPrecoRepository.delete(id);
    }
}

export default new DeleteTipoPrecoService;