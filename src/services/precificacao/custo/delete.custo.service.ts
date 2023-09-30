import CustoRepository from "../../../database/repositories/precificacao/CustoRepository";
import { errMsg } from "../../../helpers/ErrorMessages";
import { checkId, valueExists } from "../../../helpers/validation";

class DeletePorteClienteService 
{
    /**
     * Serviço responsável pela remoção de todos os custos de acordo com o id total_custo.
     * @param id - o identificador do índice a ser removido.
     */
    async execute(id: any): Promise<void>
    {
        id = checkId(id);

        const data = await CustoRepository.getById(id);
        valueExists(data, errMsg.CUSTO.NOT_FOUND);
            
        await CustoRepository.delete(id);
    }
}

export default new DeletePorteClienteService;