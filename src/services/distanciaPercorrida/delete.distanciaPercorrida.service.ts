import distanciaRepo from "../../database/repositories/DistanciaResidenciaRepository";
import { errMsg } from "../../helpers/ErrorMessages";
import { checkId, valueExists } from "../../helpers/validation";
import { DistanciaResidencia } from "../../models/DistanciaResidencia";

class DeleteDistanciaPercorridaService 
{
    async execute(id: any): Promise<void>
    {
        id = checkId(id);

        const distanciaRes: DistanciaResidencia = { id: id, distancia: ""};

        const dataCelula = await distanciaRepo.getById(distanciaRes.id!);
        valueExists(dataCelula, errMsg.DISTANCIA.NOT_FOUND);
            
        await distanciaRepo.delete(distanciaRes.id!);
    }
}

export default new DeleteDistanciaPercorridaService;