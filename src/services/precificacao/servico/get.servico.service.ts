import ServicoRepository from "../../../database/repositories/precificacao/ServicoRepository";
class GetServicoService 
{
    /**
     * Serviço responsável por trazer todos os dados da tabela servico.
     * @returns uma promise contendo uma coleção de objetos.
     */
    async execute()
    {
        return await ServicoRepository.select();
    }
}

export default new GetServicoService;