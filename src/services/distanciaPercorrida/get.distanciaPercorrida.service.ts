import distanciaRepo from "../../database/repositories/DistanciaResidenciaRepository";

class GetDistanciaPercorridaService 
{
    async execute()
    {
        return await distanciaRepo.select();
    }
}

export default new GetDistanciaPercorridaService;