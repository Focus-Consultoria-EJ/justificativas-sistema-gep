import ClienteRepository from "../../../database/repositories/precificacao/ClienteRepository";
import PorteClienteRepository from "../../../database/repositories/precificacao/PorteClienteRepository";
import { errMsg } from "../../../helpers/ErrorMessages";
import { clienteFormValidation } from "../../../helpers/precificacao/clienteValidation";
import { checkId, valueExists } from "../../../helpers/validation";
import { BadRequestError } from "../../../middlewares/Error.middleware";
import { Cliente } from "../../../models/precificacao/Cliente";

class SaveServicoService 
{
    /**
     * Serviço responsável pela inserção ou atualização de um cliente se o id for passado no parâmetro data.
     * @param data - os dados vindos do header.
     */
    async execute(data: Cliente): Promise<void>
    {
        data.id = checkId(data.id);

        const cliente = await clienteFormValidation(data);

        if(typeof cliente === "string")
            throw new BadRequestError(cliente);

        if(cliente.id)
            if(!await ClienteRepository.getById(cliente.id))
                throw new BadRequestError(errMsg.CLIENTE.NOT_FOUND);   

        const porteCliente = await PorteClienteRepository.getById(cliente.porteCliente!.id!);
        valueExists(porteCliente, errMsg.PORTE_CLIENTE.NOT_FOUND);

        const result = await ClienteRepository.alreadyExists(cliente.nome!, cliente.nomeEmpresa!);
        
        if(result)
            throw new BadRequestError(errMsg.CLIENTE.ALREADY_EXISTS);

        if(cliente.id)
            await ClienteRepository.update(cliente);
        else
            await ClienteRepository.insert(cliente);
    }
}

export default new SaveServicoService;