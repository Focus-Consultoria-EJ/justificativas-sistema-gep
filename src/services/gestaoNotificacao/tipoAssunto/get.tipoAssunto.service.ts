import TipoAssuntoRepository from "../../../database/repositories/gestaoNotificacao/TipoAssuntoRepository";

class getTipoAssuntoService 
{
    /**
     * Serviço responsável por trazer todos os tipos de assuntos.
     * @returns uma promise contendo uma coleção de objetos.
     */
    async execute()
    {
        return await TipoAssuntoRepository.select();
    }
}

export default new getTipoAssuntoService;