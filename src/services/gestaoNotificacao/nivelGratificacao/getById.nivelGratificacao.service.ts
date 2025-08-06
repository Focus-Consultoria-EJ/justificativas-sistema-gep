import NivelGratificacaoRepository from "../../../database/repositories/gestaoNotificacao/NivelGratificacaoRepository";
import { errMsg } from "../../../helpers/ErrorMessages";
import { checkId } from "../../../helpers/validation";
import { BadRequestError } from "../../../middlewares/Error.middleware";

class GetByIdNivelGratificacaoService 
{
    /**
     * Serviço responsável por Trazer um nível de gratificação através do id.
     * @param id - identificador relacionado ao item a ser retornado do banco de dados.
     * @returns uma promise contendo um objeto.
     */
    async execute(id:any)
    {
        id = checkId(id);
        
        const result = await NivelGratificacaoRepository.getById(id);
        
        if(!result)
            throw new BadRequestError(errMsg.NIVEL_GRATIFICACAO.NOT_FOUND); 

        return result;
    }
}

export default new GetByIdNivelGratificacaoService;