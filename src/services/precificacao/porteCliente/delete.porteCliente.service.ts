import PorteClienteRepository from "../../../database/repositories/precificacao/PorteClienteRepository";
import { errMsg } from "../../../helpers/ErrorMessages";
import { checkId, valueExists } from "../../../helpers/validation";

class DeletePorteClienteService 
{
    /**
     * Serviço responsável pela remoção de um porte de cliente através do identificador.
     * @param id - o identificador do índice a ser removido.
     */
    async execute(id: any): Promise<void>
    {
        id = checkId(id);

        const data = await PorteClienteRepository.getById(id);
        valueExists(data, errMsg.PORTE_CLIENTE.NOT_FOUND);
            
        await PorteClienteRepository.delete(id);
    }
}

export default new DeletePorteClienteService;