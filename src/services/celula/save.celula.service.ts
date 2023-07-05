import CelulaRepository from "../../database/repositories/CelulaRepository";
import { errMsg } from "../../helpers/ErrorMessages";
import { checkId } from "../../helpers/validation";
import { BadRequestError } from "../../middlewares/Error.middleware";
import { Celula } from "../../models/Celula";

class SaveCelulaService 
{
    async execute(data: any): Promise<void>
    {
        data.id = checkId(data.id);

        if(data.id >= 1 && data.id <= 6)
            throw new BadRequestError("Não é possível atualizar o índice, pois ele faz parte da lógica do sistema.");

        if(!data.nome || data.nome.length <= 3 || data.nome.length >= 120) 
            throw new BadRequestError("Digite uma célula com mais de 3 caracteres. (max: 120)");

        const celula: Celula = { id: data.id, nome: data.nome };  

        if(data.id)
            if(!await CelulaRepository.getById(celula.id!))
                throw new BadRequestError(errMsg.CELULA.NOT_FOUND);   

        const dataDistancia = await CelulaRepository.getByName(celula.nome!);
        
        // Verifica se a distancia já existe
        if(dataDistancia)
            throw new BadRequestError(errMsg.CELULA.ALREADY_EXISTS);

        if(celula.id)
            await CelulaRepository.update(celula);
        else
            await CelulaRepository.insert(celula);
    }
}

export default new SaveCelulaService;