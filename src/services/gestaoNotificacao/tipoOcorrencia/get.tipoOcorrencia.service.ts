import TipoOcorrenciaRepository from "../../../database/repositories/gestaoNotificacao/TipoOcorrenciaRepository";

class getTipoOcorrenciaService 
{
    /**
     * Serviço responsável por trazer todos os tipos de ocorrências.
     * @returns uma promise contendo uma coleção de objetos.
     */
    async execute()
    {
        return await TipoOcorrenciaRepository.select();
    }
}

export default new getTipoOcorrenciaService;