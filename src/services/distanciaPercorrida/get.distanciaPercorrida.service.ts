import distanciaRepo from "../../database/repositories/DistanciaResidenciaRepository";

class GetDistanciaPercorridaService 
{
    /**
     * Serviço responsável por trazer todos os dados da distância percorrida.
     * @returns uma promise contendo uma coleção de objetos.
     */
    async execute()
    {
        return await distanciaRepo.select();
    }
}

export default new GetDistanciaPercorridaService;