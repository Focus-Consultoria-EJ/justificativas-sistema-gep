import TipoAssuntoRepository from "../../../database/repositories/gestaoNotificacao/TipoAssuntoRepository";
import { errMsg } from "../../../helpers/ErrorMessages";
import { checkId } from "../../../helpers/validation";
import { BadRequestError } from "../../../middlewares/Error.middleware";
import { TipoAssunto } from "../../../models/gestaoNotificacao/TipoAssunto";

class SaveTipoAssuntoService 
{
    /**
     * Serviço responsável pela inserção ou atualização de um tipo de assunto se o id for passado no parâmetro data.
     * @param data - os dados vindos do header.
     */
    async execute(data: any): Promise<void>
    {
        data.id = checkId(data.id);

        if(!data.nome || data.nome.length <= 3 || data.nome.length >= 120) 
            throw new BadRequestError("Digite um tipo de assunto com mais de 3 caracteres. (max: 120)");

        const tipoAssunto: TipoAssunto = { id: data.id, nome: data.nome };  

        if(data.id)
            if(!await TipoAssuntoRepository.getById(tipoAssunto.id!))
                throw new BadRequestError(errMsg.TIPO_ASSUNTO.NOT_FOUND);   

        const dataDistancia = await TipoAssuntoRepository.existsByName(tipoAssunto.nome!);
        
        // Verifica se a distancia já existe
        if(dataDistancia)
            throw new BadRequestError(errMsg.TIPO_ASSUNTO.ALREADY_EXISTS);

        if(tipoAssunto.id)
            await TipoAssuntoRepository.update(tipoAssunto);
        else
            await TipoAssuntoRepository.insert(tipoAssunto);
    }
}

export default new SaveTipoAssuntoService;