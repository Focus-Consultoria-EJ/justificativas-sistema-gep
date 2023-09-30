import PrecificacaoRepository from "../../../database/repositories/precificacao/PrecificacaoRepository";

class GetPrecificacaoService 
{
    /**
     * Serviço responsável por trazer todos os dados da tabela precificacao.
     * @returns uma promise contendo uma coleção de objetos.
     */
    async execute()
    {
        return await PrecificacaoRepository.select();
    }
}

export default new GetPrecificacaoService;