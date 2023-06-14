import OcorrenciaRepository from "../../database/repositories/OcorrenciaRepository";
import { errMsg } from "../../helpers/ErrorMessages";
import { isNumber } from "../../helpers/validation";
import { BadRequestError } from "../../middlewares/Error.middleware";

interface IRequestParams { limit: any, offset: any }
class getOcorrenciaService 
{
    async execute(reqParam?: IRequestParams)
    {
        if(reqParam?.limit && !isNumber(reqParam.limit))
            throw new BadRequestError(errMsg.INVALID_DATA + " (limit)");

        if(reqParam?.offset && !isNumber(reqParam.limit))
            throw new BadRequestError(errMsg.INVALID_DATA + " (offset)");

        return await OcorrenciaRepository.select(reqParam?.limit, reqParam?.offset);
    }
}

export default new getOcorrenciaService;