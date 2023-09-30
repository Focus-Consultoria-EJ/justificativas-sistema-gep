import SharkRepository from "../../database/repositories/SharkRepository";
import { errMsg } from "../../helpers/ErrorMessages";
import { arrayIsEmpty, checkId } from "../../helpers/validation";
import { BadRequestError } from "../../middlewares/Error.middleware";

class getByIdSharkService 
{
    /**
     * Serviço responsável por trazer um shark através do id.
     * @param id - identificador relacionado ao item a ser retornado do banco de dados.
     * @returns uma promise contendo um objeto.
     */
    async execute(id:any)
    {
        id = checkId(id);
        
        const result = await SharkRepository.getById(id);
        
        if(!result || arrayIsEmpty(result))
            throw new BadRequestError(errMsg.SHARK.NOT_FOUND); 
            
        return result;
    }
}

export default new getByIdSharkService;