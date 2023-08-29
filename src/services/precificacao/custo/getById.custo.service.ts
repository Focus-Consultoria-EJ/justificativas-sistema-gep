import CustoRepository from "../../../database/repositories/precificacao/CustoRepository";
import { checkId } from "../../../helpers/validation";
import { BadRequestError } from "../../../middlewares/Error.middleware";

class GetByIdCustoService 
{
    /**
     * Serviço responsável por trazer todos os custo de através do id total_custo.
     * @param id - identificador relacionado ao item a ser retornado do banco de dados.
     * @returns uma promise contendo um objeto.
     */
    async execute(id:any)
    {
        id = checkId(id);
        
        const result = await CustoRepository.getById(id);
        
        if(!result)
            throw new BadRequestError("Custo não encontrado."); 

        return result;
    }
}

export default new GetByIdCustoService;