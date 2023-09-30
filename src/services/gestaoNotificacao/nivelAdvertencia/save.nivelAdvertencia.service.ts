import NivelAdvertenciaRepository from "../../../database/repositories/gestaoNotificacao/NivelAdvertenciaRepository";
import { errMsg } from "../../../helpers/ErrorMessages";
import { checkId } from "../../../helpers/validation";
import { BadRequestError } from "../../../middlewares/Error.middleware";
import { NivelAdvertencia } from "../../../models/gestaoNotificacao/NivelAdvertencia";

class SaveNivelAdvertenciaService
{
    /**
     * Serviço responsável pela inserção ou atualização de um nível de advertência se o id for passado no parâmetro data.
     * @param data - os dados vindos do header.
     */
    async execute(data: any): Promise<void>
    {
        data.id = checkId(data.id);

        if(!data.nome || data.nome.length <= 3 || data.nome.length >= 100) 
            throw new BadRequestError("Digite um nível de advertência com mais de 3 caracteres. (max: 100)");

        if(!data.valor || isNaN(data.valor) || data.valor <= 0) 
            throw new BadRequestError("Digite um valor para nível de advertência maior que 0.");

        const nivelAdvertencia: NivelAdvertencia = { id: data.id, nome: data.nome, valor: data.valor };  

        if(data.id)
            if(!await NivelAdvertenciaRepository.getById(nivelAdvertencia.id!))
                throw new BadRequestError(errMsg.NIVEL_ADVERTENCIA.NOT_FOUND);   

        const dataDistancia = await NivelAdvertenciaRepository.existsByNameAndValue(nivelAdvertencia.nome!, nivelAdvertencia.valor!);
        
        // Verifica se a distancia já existe
        if(dataDistancia)
            throw new BadRequestError(errMsg.NIVEL_ADVERTENCIA.ALREADY_EXISTS);

        if(nivelAdvertencia.id)
            await NivelAdvertenciaRepository.update(nivelAdvertencia);
        else
            await NivelAdvertenciaRepository.insert(nivelAdvertencia);
    }
}

export default new SaveNivelAdvertenciaService;