import NivelGratificacaoRepository from "../../../database/repositories/gestaoNotificacao/NivelGratificacaoRepository";

class GetNivelGratificacaoService 
{
    /**
     * Serviço responsável por trazer todos os níveis de gratificação.
     * @returns uma promise contendo uma coleção de objetos.
     */
    async execute()
    {
        return await NivelGratificacaoRepository.select();
    }
}

export default new GetNivelGratificacaoService;