import OcorrenciaRepository from "../../../database/repositories/gestaoNotificacao/OcorrenciaRepository";
import { arrayIsEmpty, checkId } from "../../../helpers/validation";
import { BadRequestError } from "../../../middlewares/Error.middleware";

class getByIdLogOcorrenciaService 
{
    /**
     * Serviço responsável por trazer o log de uma ocorrência através do id.
     * @param id - identificador relacionado ao item a ser retornado do banco de dados.
     * @returns uma promise contendo um objeto.
     */
    async execute(id:any)
    {
        id = checkId(id);
        
        const result = await OcorrenciaRepository.getByIdOcorrenciaLog(id);

        if(!result || arrayIsEmpty(result))
            throw new BadRequestError("O item do log de ocorrência não foi encontrado."); 

        return result;
    }
}

export default new getByIdLogOcorrenciaService;