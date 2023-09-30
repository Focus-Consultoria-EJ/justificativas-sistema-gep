import TipoPrecoRepository from "../../../database/repositories/precificacao/TipoPrecoRepository";

class GetTipoPrecoService 
{
    /**
     * Serviço responsável por trazer todos os dados da tabela tipo_preco.
     * @returns uma promise contendo uma coleção de objetos.
     */
    async execute()
    {
        return await TipoPrecoRepository.select();
    }
}

export default new GetTipoPrecoService;