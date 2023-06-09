import SharkRepository from "../../database/repositories/SharkRepository";
import { errMsg } from "../../helpers/ErrorMessages";
import { arrayIsEmpty, checkId } from "../../helpers/validation";
import { BadRequestError } from "../../middlewares/Error.middleware";

class getByIdSharkService 
{
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