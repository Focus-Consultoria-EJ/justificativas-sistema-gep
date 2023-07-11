import OcorrenciaRepository from "../../database/repositories/OcorrenciaRepository";
import { errMsg } from "../../helpers/ErrorMessages";
import { arrayIsEmpty, checkId } from "../../helpers/validation";
import { BadRequestError } from "../../middlewares/Error.middleware";

class getByIdOcorrenciaService 
{
    /**
     * Serviço responsável por trazer uma ocorrência através do id.
     * @param id - identificador relacionado ao item a ser retornado do banco de dados.
     * @returns uma promise contendo um objeto.
     */
    async execute(id:any)
    {
        id = checkId(id);
        
        const result = await OcorrenciaRepository.getById(id);

        if(!result || arrayIsEmpty(result))
            throw new BadRequestError(errMsg.OCORRENCIA.NOT_FOUND); 

        return result;
    }
}

export default new getByIdOcorrenciaService;