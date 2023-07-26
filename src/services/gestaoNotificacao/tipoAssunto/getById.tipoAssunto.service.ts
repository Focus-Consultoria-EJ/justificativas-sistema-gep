import TipoAssuntoRepository from "../../../database/repositories/gestaoNotificacao/TipoAssuntoRepository";
import { errMsg } from "../../../helpers/ErrorMessages";
import { checkId } from "../../../helpers/validation";
import { BadRequestError } from "../../../middlewares/Error.middleware";

class getByIdTipoAssuntoService 
{
    /**
     * Serviço responsável por Trazer um tipo de assunto através do id.
     * @param id - identificador relacionado ao item a ser retornado do banco de dados.
     * @returns uma promise contendo um objeto.
     */
    async execute(id:any)
    {
        id = checkId(id);
        
        const result = await TipoAssuntoRepository.getById(id);
        
        if(!result)
            throw new BadRequestError(errMsg.TIPO_ASSUNTO.NOT_FOUND); 

        return result;
    }
}

export default new getByIdTipoAssuntoService;