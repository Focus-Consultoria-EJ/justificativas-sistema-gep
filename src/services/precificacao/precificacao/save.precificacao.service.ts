import ClienteRepository from "../../../database/repositories/precificacao/ClienteRepository";
import PrecificacaoRepository from "../../../database/repositories/precificacao/PrecificacaoRepository";
import ServicoRepository from "../../../database/repositories/precificacao/ServicoRepository";
import TipoPrecoRepository from "../../../database/repositories/precificacao/TipoPrecoRepository";
import { errMsg } from "../../../helpers/ErrorMessages";
import { precificacaoFormValidation } from "../../../helpers/precificacao/precificacaoValidation";
import { checkId, valueExists } from "../../../helpers/validation";
import { BadRequestError } from "../../../middlewares/Error.middleware";
import { Precificacao } from "../../../models/precificacao/Precificacao";

class SavePrecificacaoService 
{
    /**
     * Serviço responsável pela inserção ou atualização de um cliente se o id for passado no parâmetro data.
     * @param data - os dados vindos do header.
     */
    async execute(data: Precificacao): Promise<void>
    {
        data.id = checkId(data.id);

        const precificacao = await precificacaoFormValidation(data);

        if(typeof precificacao === "string")
            throw new BadRequestError(precificacao);

        
        if(precificacao.id)
            if(!await PrecificacaoRepository.getById(precificacao.id))
                throw new BadRequestError(errMsg.PRECIFICACAO.NOT_FOUND);   
        
        const servico = await ServicoRepository.getById(precificacao.servico!.id!);
        valueExists(servico, errMsg.SERVICO.NOT_FOUND);

        if(precificacao.composta)
        {
            const servicoComposto = await ServicoRepository.getById(precificacao.servicoComposto!.id!);
            valueExists(servicoComposto, "O serviço composto não foi encontrado.");
        }
        
        const cliente = await ClienteRepository.getById(precificacao.cliente!.id!);
        valueExists(cliente, errMsg.CLIENTE.NOT_FOUND);

        const tipoPreco = await TipoPrecoRepository.getById(precificacao.tipoPreco!.id!);
        valueExists(tipoPreco, errMsg.TIPO_PRECO.NOT_FOUND);

        if(precificacao.id)
            await PrecificacaoRepository.update(precificacao);
        else
            await PrecificacaoRepository.insert(precificacao);
    }
}

export default new SavePrecificacaoService;