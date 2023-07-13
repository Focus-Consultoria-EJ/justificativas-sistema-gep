import distanciaRepo from "../../database/repositories/DistanciaResidenciaRepository";
import { errMsg } from "../../helpers/ErrorMessages";
import { checkId } from "../../helpers/validation";
import { BadRequestError } from "../../middlewares/Error.middleware";
import { DistanciaResidencia } from "../../models/DistanciaResidencia";

class SaveDistanciaPercorridaService 
{
    /**
     * Serviço responsável pela inserção ou atualização de uma distância se o id for passado no parâmetro data.
     * @param data - os dados vindos do header.
     */
    async execute(data: any): Promise<void>
    {
        data.id = checkId(data.id);

        if(!data.distancia || data.distancia.length <= 3 || data.distancia.length >= 120) 
            throw new BadRequestError("Digite uma distância com mais de 3 caracteres. (max: 120)");

        const distanciaRes: DistanciaResidencia = { id: data.id, distancia: data.distancia };  

        if(data.id)
            if(!await distanciaRepo.getById(data.id))
                throw new BadRequestError(errMsg.DISTANCIA.NOT_FOUND);   

        const dataDistancia = await distanciaRepo.existsByName(distanciaRes.distancia!);
        
        // Verifica se a distancia já existe
        if(dataDistancia)
            throw new BadRequestError(errMsg.DISTANCIA.ALREADY_EXISTS);

        if(distanciaRes.id)
            await distanciaRepo.update(distanciaRes);
        else
            await distanciaRepo.insert(distanciaRes);
    }
}

export default new SaveDistanciaPercorridaService;