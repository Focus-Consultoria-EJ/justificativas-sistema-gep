import CelulaRepository from "../../database/repositories/CelulaRepository";
import { errMsg } from "../../helpers/ErrorMessages";
import { checkId } from "../../helpers/validation";
import { BadRequestError } from "../../middlewares/Error.middleware";

class getByIdCelulaService 
{
    async execute(id:any)
    {
        id = checkId(id);
        
        const result = await CelulaRepository.getById(id);
        
        if(!result)
            throw new BadRequestError(errMsg.CELULA.NOT_FOUND); 

        return result;
    }
}

export default new getByIdCelulaService;