import OcorrenciaRepository from "../../../database/repositories/gestaoNotificacao/OcorrenciaRepository";
import { errMsg } from "../../../helpers/ErrorMessages";
import { isNumber } from "../../../helpers/validation";
import { BadRequestError } from "../../../middlewares/Error.middleware";

interface IRequestParams 
{ 
    size: any;
    page: any;
    membroAtivo: any;
    nomeSharkCriador: any;
    nomeSharkReferente: any;
    emailSharkCriador: any;
    emailSharkReferente: any;
    tipoAssunto: any;
    tipoOcorrencia:any;
}

class getOcorrenciaService 
{
    /**
     * Serviço responsável por trazer todos os dados de ocorrência.
     * @param reqParam - (opcional) os dados vindos dos parâmetros de url.
     * @returns uma promise contendo uma coleção de objetos.
     */
    async execute(reqParam?: IRequestParams)
    {
        if(reqParam?.size && !isNumber(reqParam.size))
            throw new BadRequestError(errMsg.INVALID_DATA + " (size)");

        if(reqParam?.page && !isNumber(reqParam.page))
            throw new BadRequestError(errMsg.INVALID_DATA + " (page)");

        return await OcorrenciaRepository.select(
            reqParam?.size, 
            reqParam?.page, 
            reqParam?.membroAtivo,
            reqParam?.nomeSharkCriador,
            reqParam?.nomeSharkReferente,
            reqParam?.emailSharkCriador,
            reqParam?.emailSharkReferente,
            reqParam?.tipoOcorrencia,
            reqParam?.tipoAssunto
        );
    }
}

export default new getOcorrenciaService;