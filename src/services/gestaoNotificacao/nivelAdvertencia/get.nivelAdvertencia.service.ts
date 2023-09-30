import NivelAdvertenciaRepository from "../../../database/repositories/gestaoNotificacao/NivelAdvertenciaRepository";

class GetNivelAdvertenciaService 
{
    /**
     * Serviço responsável por trazer todos os níveis de advertência.
     * @returns uma promise contendo uma coleção de objetos.
     */
    async execute()
    {
        return await NivelAdvertenciaRepository.select();
    }
}

export default new GetNivelAdvertenciaService;