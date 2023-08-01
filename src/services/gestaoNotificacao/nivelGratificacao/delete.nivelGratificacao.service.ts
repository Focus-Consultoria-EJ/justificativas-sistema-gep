import NivelGratificacaoRepository from "../../../database/repositories/gestaoNotificacao/NivelGratificacaoRepository";
import { errMsg } from "../../../helpers/ErrorMessages";
import { checkId,  valueExists } from "../../../helpers/validation";
import { NivelGratificacao } from "../../../models/gestaoNotificacao/NivelGratificacao";

class DeleteNivelAdvertenciaService
{
    /**
     * Serviço responsável pela remoção de um nível de gratificação através do identificador.
     * @param id - o identificador do índice a ser removido.
     */
    async execute(id: any): Promise<void>
    {
        id = checkId(id);

        const nivelGratificacao: NivelGratificacao = { id: id, nome: ""};

        const result = await NivelGratificacaoRepository.getById(nivelGratificacao.id!);
        valueExists(result, errMsg.NIVEL_GRATIFICACAO.NOT_FOUND);
            
        await NivelGratificacaoRepository.delete(nivelGratificacao.id!);
    }
}

export default new DeleteNivelAdvertenciaService;