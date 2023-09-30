import ClienteRepository from "../../../database/repositories/precificacao/ClienteRepository";
import { errMsg } from "../../../helpers/ErrorMessages";
import { checkId, valueExists } from "../../../helpers/validation";


class DeleteClienteService 
{
    /**
     * Serviço responsável pela remoção de um cliente através do identificador.
     * @param id - o identificador do índice a ser removido.
     */
    async execute(id: any): Promise<void>
    {
        id = checkId(id);

        const data = await ClienteRepository.getById(id);
        valueExists(data, errMsg.CLIENTE.NOT_FOUND);
            
        await ClienteRepository.delete(id);
    }
}

export default new DeleteClienteService;