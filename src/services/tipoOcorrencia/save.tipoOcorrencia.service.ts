import TipoOcorrenciaRepository from "../../database/repositories/TipoOcorrenciaRepository";
import { errMsg } from "../../helpers/ErrorMessages";
import { checkId } from "../../helpers/validation";
import { BadRequestError } from "../../middlewares/Error.middleware";
import { TipoOcorrencia } from "../../models/TipoOcorrencia";

class SaveTipoOcorrenciaService 
{
    /**
     * Serviço responsável pela inserção ou atualização de um tipo de ocorrência se o id for passado no parâmetro data.
     * @param data - os dados vindos do header.
     */
    async execute(data: any): Promise<void>
    {
        data.id = checkId(data.id);

        if(data.id >= 1 && data.id <= 7)
            throw new BadRequestError("Não é possível atualizar o índice, pois ele faz parte da lógica do sistema.");

        if(!data.nome || data.nome.length <= 3 || data.nome.length >= 120) 
            throw new BadRequestError("Digite um tipo de ocorrência com mais de 3 caracteres. (max: 120)");

        const tipoOcorrencia: TipoOcorrencia = { id: data.id, nome: data.nome };  

        if(data.id)
            if(!await TipoOcorrenciaRepository.getById(tipoOcorrencia.id!))
                throw new BadRequestError(errMsg.TIPO_OCORRENCIA.NOT_FOUND);   

        const dataDistancia = await TipoOcorrenciaRepository.existsByName(tipoOcorrencia.nome!);

        // Verifica se a distancia já existe
        if(dataDistancia)
            throw new BadRequestError(errMsg.TIPO_OCORRENCIA.ALREADY_EXISTS);

        if(tipoOcorrencia.id)
            await TipoOcorrenciaRepository.update(tipoOcorrencia);
        else
            await TipoOcorrenciaRepository.insert(tipoOcorrencia);
    }
}

export default new SaveTipoOcorrenciaService;