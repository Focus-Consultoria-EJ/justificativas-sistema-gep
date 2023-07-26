import distanciaRepo from "../../../database/repositories/gestaoNotificacao/DistanciaResidenciaRepository";
import { errMsg } from "../../../helpers/ErrorMessages";
import { checkId, valueExists } from "../../../helpers/validation";
import { DistanciaResidencia } from "../../../models/gestaoNotificacao/DistanciaResidencia";

class DeleteDistanciaPercorridaService 
{
    /**
     * Serviço responsável pela remoção de uma distância através do identificador.
     * @param id - o identificador do índice a ser removido.
     */
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