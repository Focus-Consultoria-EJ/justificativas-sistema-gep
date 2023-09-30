import ServicoRepository from "../../../database/repositories/precificacao/ServicoRepository";
import { errMsg } from "../../../helpers/ErrorMessages";
import { checkId, valueExists } from "../../../helpers/validation";


class DeleteServicoService 
{
    /**
     * Serviço responsável pela remoção de um serviço através do identificador.
     * @param id - o identificador do índice a ser removido.
     */
    async execute(id: any): Promise<void>
    {
        id = checkId(id);

        const data = await ServicoRepository.getById(id);
        valueExists(data, errMsg.SERVICO.NOT_FOUND);
            
        await ServicoRepository.delete(id);
    }
}

export default new DeleteServicoService;