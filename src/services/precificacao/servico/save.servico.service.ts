import ServicoRepository from "../../../database/repositories/precificacao/ServicoRepository";
import { errMsg } from "../../../helpers/ErrorMessages";
import { checkId } from "../../../helpers/validation";
import { BadRequestError } from "../../../middlewares/Error.middleware";
import { Servico } from "../../../models/precificacao/Servico";

class SaveServicoService 
{
    /**
     * Serviço responsável pela inserção ou atualização de um serviço se o id for passado no parâmetro data.
     * @param data - os dados vindos do header.
     */
    async execute(data: Servico): Promise<void>
    {
        data.id = checkId(data.id);

        if(!data.nome || data.nome.length <= 3 || data.nome.length >= 200) 
            throw new BadRequestError("Digite um nome de serviço com 3 ou mais caracteres. (max: 200)");

        const servico: Servico = { id: data.id, nome: data.nome };  

        if(data.id)
            if(!await ServicoRepository.getById(data.id))
                throw new BadRequestError(errMsg.SERVICO.NOT_FOUND);   

        const result = await ServicoRepository.existsByName(servico.nome!);
        
        // Verifica se a distancia já existe
        if(result)
            throw new BadRequestError(errMsg.SERVICO.ALREADY_EXISTS);

        if(servico.id)
            await ServicoRepository.update(servico);
        else
            await ServicoRepository.insert(servico);
    }
}

export default new SaveServicoService;