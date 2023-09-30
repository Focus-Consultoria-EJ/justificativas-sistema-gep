import CelulaRepository from "../../database/repositories/CelulaRepository";

class getCelulaService 
{
    /**
     * Serviço responsável por trazer todos os dados da celula.
     * @returns uma promise contendo uma coleção de objetos.
     */
    async execute()
    {
        return await CelulaRepository.select();
    }
}

export default new getCelulaService;