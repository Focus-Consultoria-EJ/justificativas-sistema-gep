import TipoOcorrenciaRepository from "../../../database/repositories/gestaoNotificacao/TipoOcorrenciaRepository";
import { errMsg } from "../../../helpers/ErrorMessages";
import { checkId } from "../../../helpers/validation";
import { BadRequestError } from "../../../middlewares/Error.middleware";

class getByIdTipoOcorrenciaService 
{
    /**
     * Serviço responsável por Trazer um tipo de ocorrência através do id.
     * @param id - identificador relacionado ao item a ser retornado do banco de dados.
     * @returns uma promise contendo um objeto.
     */
    async execute(id:any)
    {
        id = checkId(id);
        
        const result = await TipoOcorrenciaRepository.getById(id);
        
        if(!result)
            throw new BadRequestError(errMsg.TIPO_OCORRENCIA.NOT_FOUND); 

        return result;
    }
}

export default new getByIdTipoOcorrenciaService;