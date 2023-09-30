import NivelAdvertenciaRepository from "../../../database/repositories/gestaoNotificacao/NivelAdvertenciaRepository";
import { errMsg } from "../../../helpers/ErrorMessages";
import { checkId,  valueExists } from "../../../helpers/validation";
import { NivelAdvertencia } from "../../../models/gestaoNotificacao/NivelAdvertencia";

class DeleteNivelAdvertenciaService
{
    /**
     * Serviço responsável pela remoção de um nível de advertência através do identificador.
     * @param id - o identificador do índice a ser removido.
     */
    async execute(id: any): Promise<void>
    {
        id = checkId(id);

        const nivelAdvertencia: NivelAdvertencia = { id: id, nome: ""};

        const result = await NivelAdvertenciaRepository.getById(nivelAdvertencia.id!);
        valueExists(result, errMsg.NIVEL_ADVERTENCIA.NOT_FOUND);
            
        await NivelAdvertenciaRepository.delete(nivelAdvertencia.id!);
    }
}

export default new DeleteNivelAdvertenciaService;