import CustoRepository from "../../../database/repositories/precificacao/CustoRepository";

class GetCustoService 
{
    /**
     * Serviço responsável por trazer todos os dados da tabela custo e total_custo.
     * @returns uma promise contendo uma coleção de objetos.
     */
    async execute()
    {
        return await CustoRepository.select();
    }
}

export default new GetCustoService;