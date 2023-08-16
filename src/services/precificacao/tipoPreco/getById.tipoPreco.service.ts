import TipoPrecoRepository from "../../../database/repositories/precificacao/TipoPrecoRepository";
import { errMsg } from "../../../helpers/ErrorMessages";
import { checkId } from "../../../helpers/validation";
import { BadRequestError } from "../../../middlewares/Error.middleware";

class GetByIdTipoPrecoService 
{
    /**
     * Serviço responsável por trazer um tipo de preço através do id.
     * @param id - identificador relacionado ao item a ser retornado do banco de dados.
     * @returns uma promise contendo um objeto.
     */
    async execute(id:any)
    {
        id = checkId(id);
        
        const result = await TipoPrecoRepository.getById(id);
        
        if(!result)
            throw new BadRequestError(errMsg.TIPO_PRECO.NOT_FOUND); 

        return result;
    }
}

export default new GetByIdTipoPrecoService;