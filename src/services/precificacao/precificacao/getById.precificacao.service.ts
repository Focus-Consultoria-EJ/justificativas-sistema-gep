import PrecificacaoRepository from "../../../database/repositories/precificacao/PrecificacaoRepository";
import { errMsg } from "../../../helpers/ErrorMessages";
import { checkId } from "../../../helpers/validation";
import { BadRequestError } from "../../../middlewares/Error.middleware";

class GetByIdPrecificacaoService 
{
    /**
     * Serviço responsável por trazer um precificacao através do id.
     * @param id - identificador relacionado ao item a ser retornado do banco de dados.
     * @returns uma promise contendo um objeto.
     */
    async execute(id:any)
    {
        id = checkId(id);
        
        const result = await PrecificacaoRepository.getById(id);
        
        if(!result)
            throw new BadRequestError(errMsg.PRECIFICACAO.NOT_FOUND); 

        return result;
    }
}

export default new GetByIdPrecificacaoService;