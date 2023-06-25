import SharkRepository from "../../database/repositories/SharkRepository";
import { errMsg } from "../../helpers/ErrorMessages";
import { isNumber } from "../../helpers/validation";
import { BadRequestError } from "../../middlewares/Error.middleware";

interface IRequestParams { limit: any, offset: any, membroAtivo: any }

class getSharkService 
{
    async execute(reqParam?: IRequestParams)
    {
        if(reqParam?.limit && !isNumber(reqParam.limit))
            throw new BadRequestError(errMsg.INVALID_DATA + " (limit)");

        if(reqParam?.offset && !isNumber(reqParam.offset))
            throw new BadRequestError(errMsg.INVALID_DATA + " (offset)");
            
        return await SharkRepository.select(reqParam?.limit, reqParam?.offset, reqParam?.membroAtivo);
    }
}

export default new getSharkService;