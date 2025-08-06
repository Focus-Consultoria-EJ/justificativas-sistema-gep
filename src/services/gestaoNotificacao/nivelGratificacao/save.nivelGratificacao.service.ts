import NivelGratificacaoRepository from "../../../database/repositories/gestaoNotificacao/NivelGratificacaoRepository";
import { errMsg } from "../../../helpers/ErrorMessages";
import { checkId } from "../../../helpers/validation";
import { BadRequestError } from "../../../middlewares/Error.middleware";
import { NivelGratificacao } from "../../../models/gestaoNotificacao/NivelGratificacao";

class SaveNivelGratificacaoService
{
    /**
     * Serviço responsável pela inserção ou atualização de um nível de gratificação se o id for passado no parâmetro data.
     * @param data - os dados vindos do header.
     */
    async execute(data: any): Promise<void>
    {
        data.id = checkId(data.id);

        if(!data.nome || data.nome.length <= 3 || data.nome.length >= 100) 
            throw new BadRequestError("Digite um nível de gratificação com mais de 3 caracteres. (max: 100)");

        if(!data.valor || isNaN(data.valor) || data.valor <= 0) 
            throw new BadRequestError("Digite um valor para nível de gratificação maior que 0.");

        const nivelGratificacao: NivelGratificacao = { id: data.id, nome: data.nome, valor: data.valor };  

        if(data.id)
            if(!await NivelGratificacaoRepository.getById(nivelGratificacao.id!))
                throw new BadRequestError(errMsg.NIVEL_GRATIFICACAO.NOT_FOUND);   

        const dataDistancia = await NivelGratificacaoRepository.existsByNameAndValue(nivelGratificacao.nome!, nivelGratificacao.valor!);
        
        // Verifica se a distancia já existe
        if(dataDistancia)
            throw new BadRequestError(errMsg.NIVEL_GRATIFICACAO.ALREADY_EXISTS);

        if(nivelGratificacao.id)
            await NivelGratificacaoRepository.update(nivelGratificacao);
        else
            await NivelGratificacaoRepository.insert(nivelGratificacao);
    }
}

export default new SaveNivelGratificacaoService;