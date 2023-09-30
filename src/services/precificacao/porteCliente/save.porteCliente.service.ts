import PorteClienteRepository from "../../../database/repositories/precificacao/PorteClienteRepository";
import { errMsg } from "../../../helpers/ErrorMessages";
import { checkId } from "../../../helpers/validation";
import { BadRequestError } from "../../../middlewares/Error.middleware";
import { PorteCliente } from "../../../models/precificacao/PorteCliente";

class SavePorteClienteService 
{
    /**
     * Serviço responsável pela inserção ou atualização de um serviço se o id for passado no parâmetro data.
     * @param data - os dados vindos do header.
     */
    async execute(data: PorteCliente): Promise<void>
    {
        data.id = checkId(data.id);

        if(!data.tipo || data.tipo.length <= 3 || data.tipo.length >= 200) 
            throw new BadRequestError("Digite um tipo com 3 ou mais caracteres. (max: 200)");

        if(!data.desconto || isNaN(data.desconto) || Number(data.desconto) < 0) 
            throw new BadRequestError("Digite um desconto com valor maior que 0.");

        const porte: PorteCliente = { id: data.id, tipo: data.tipo, desconto: data.desconto };  

        if(data.id)
            if(!await PorteClienteRepository.getById(data.id))
                throw new BadRequestError(errMsg.PORTE_CLIENTE.NOT_FOUND);   

        const result = await PorteClienteRepository.existsByTipoEDesconto(porte.tipo!, porte.desconto!);
        
        if(result)
            throw new BadRequestError(errMsg.PORTE_CLIENTE.ALREADY_EXISTS);

        if(porte.id)
            await PorteClienteRepository.update(porte);
        else
            await PorteClienteRepository.insert(porte);
    }
}

export default new SavePorteClienteService;