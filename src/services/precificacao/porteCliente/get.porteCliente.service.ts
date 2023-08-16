import PorteClienteRepository from "../../../database/repositories/precificacao/PorteClienteRepository";

class GetPorteClienteService 
{
    /**
     * Serviço responsável por trazer todos os dados da tabela porte_cliente.
     * @returns uma promise contendo uma coleção de objetos.
     */
    async execute()
    {
        return await PorteClienteRepository.select();
    }
}

export default new GetPorteClienteService;