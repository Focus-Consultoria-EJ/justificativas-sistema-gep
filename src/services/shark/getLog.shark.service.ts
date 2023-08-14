import SharkRepository from "../../database/repositories/SharkRepository";
import { errMsg } from "../../helpers/ErrorMessages";
import { isNumber } from "../../helpers/validation";
import { BadRequestError } from "../../middlewares/Error.middleware";

interface IRequestParams 
{ 
    size: any;
    page: any;
    order: any;
}

class getLogOcorrenciaService 
{
    /**
     * Serviço responsável por trazer todos os logs dos sharks.
     * @param reqParam - (opcional) os dados vindos dos parâmetros de url.
     * @returns uma promise contendo uma coleção de objetos.
     */
    async execute(reqParam?: IRequestParams)
    {
        if(reqParam?.size && !isNumber(reqParam.size))
            throw new BadRequestError(errMsg.INVALID_DATA + " (size)");

        if(reqParam?.page && !isNumber(reqParam.page))
            throw new BadRequestError(errMsg.INVALID_DATA + " (page)");

        return await SharkRepository.selectSharkLog(
            reqParam?.size, 
            reqParam?.page, 
            reqParam?.order
        );
    }
}

export default new getLogOcorrenciaService;