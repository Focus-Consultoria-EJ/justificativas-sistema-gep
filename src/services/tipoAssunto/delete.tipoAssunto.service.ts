import TipoAssuntoRepository from "../../database/repositories/TipoAssuntoRepository";
import { errMsg } from "../../helpers/ErrorMessages";
import { checkId,  valueExists } from "../../helpers/validation";
import { TipoAssunto } from "../../models/TipoAssunto";

class DeleteTipoAssuntoService 
{
    async execute(id: any): Promise<void>
    {
        id = checkId(id);

        const tipoAssunto: TipoAssunto = { id: id, nome: ""};

        const result = await TipoAssuntoRepository.getById(tipoAssunto.id!);
        valueExists(result, errMsg.TIPO_ASSUNTO.NOT_FOUND);
            
        await TipoAssuntoRepository.delete(tipoAssunto.id!);
    }
}

export default new DeleteTipoAssuntoService;