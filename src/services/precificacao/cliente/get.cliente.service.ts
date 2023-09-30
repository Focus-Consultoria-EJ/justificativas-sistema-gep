import ClienteRepository from "../../../database/repositories/precificacao/ClienteRepository";

class GetClienteService 
{
    /**
     * Serviço responsável por trazer todos os dados da tabela cliente.
     * @returns uma promise contendo uma coleção de objetos.
     */
    async execute()
    {
        return await ClienteRepository.select();
    }
}

export default new GetClienteService;