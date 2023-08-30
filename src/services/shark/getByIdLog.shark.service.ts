import SharkRepository from "../../database/repositories/SharkRepository";
import { arrayIsEmpty, checkId } from "../../helpers/validation";
import { BadRequestError } from "../../middlewares/Error.middleware";

class getByIdLogOcorrenciaService 
{
    /**
     * Serviço responsável por trazer um log de um shark através do id.
     * @param id - identificador relacionado ao item a ser retornado do banco de dados.
     * @returns uma promise contendo um objeto.
     */
    async execute(id:any)
    {
        id = checkId(id);
        
        const result = await SharkRepository.getByIdSharkLog(id);

        if(!result || arrayIsEmpty(result))
            throw new BadRequestError("O item do log de shark não foi encontrado."); 

        return result;
    }
}

export default new getByIdLogOcorrenciaService;