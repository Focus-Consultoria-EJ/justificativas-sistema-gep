import TipoAssuntoRepository from "../../../database/repositories/gestaoNotificacao/TipoAssuntoRepository";
import { errMsg } from "../../../helpers/ErrorMessages";
import { checkId,  valueExists } from "../../../helpers/validation";
import { InternalServerError } from "../../../middlewares/Error.middleware";
import { TipoAssunto } from "../../../models/gestaoNotificacao/TipoAssunto";

class DeleteTipoAssuntoService 
{
    /**
     * Serviço responsável pela remoção de um tipo de assunto através do identificador.
     * @param id - o identificador do índice a ser removido.
     */
    async execute(id: any): Promise<void>
    {
        id = checkId(id);

        const tipoAssunto: TipoAssunto = { id: id, nome: ""};

        const result = await TipoAssuntoRepository.getById(tipoAssunto.id!);
        valueExists(result, errMsg.TIPO_ASSUNTO.NOT_FOUND);
            
        await TipoAssuntoRepository.delete(tipoAssunto.id!).catch(err => {
            if(err.code === "23503")
                throw new InternalServerError("Erro: não foi possível remover o item, pois ele está associado a algum(ns) outro(s) item(ns) na tabela ocorrência."); 
            else
                throw new InternalServerError("Erro: " + err);
        });
    }
}

export default new DeleteTipoAssuntoService;