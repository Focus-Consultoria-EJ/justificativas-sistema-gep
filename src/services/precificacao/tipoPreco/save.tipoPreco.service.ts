import TipoPrecoRepository from "../../../database/repositories/precificacao/TipoPrecoRepository";
import { errMsg } from "../../../helpers/ErrorMessages";
import { checkId } from "../../../helpers/validation";
import { BadRequestError } from "../../../middlewares/Error.middleware";
import { TipoPreco } from "../../../models/precificacao/TipoPreco";

class SaveTipoPrecoService 
{
    /**
     * Serviço responsável pela inserção ou atualização de um tipo de preço se o id for passado no parâmetro data.
     * @param data - os dados vindos do header.
     */
    async execute(data: TipoPreco): Promise<void>
    {
        data.id = checkId(data.id);

        if(!data.nome || data.nome.length <= 3 || data.nome.length >= 200) 
            throw new BadRequestError("Digite um nome para o tipo de preço com 3 ou mais caracteres. (max: 200)");

        const tipoPreco: TipoPreco = { id: data.id, nome: data.nome };  

        if(data.id)
            if(!await TipoPrecoRepository.getById(tipoPreco.id!))
                throw new BadRequestError(errMsg.TIPO_PRECO.NOT_FOUND);   

        const result = await TipoPrecoRepository.existsByName(tipoPreco.nome!);
        
        if(result)
            throw new BadRequestError(errMsg.TIPO_PRECO.ALREADY_EXISTS);

        if(tipoPreco.id)
            await TipoPrecoRepository.update(tipoPreco);
        else
            await TipoPrecoRepository.insert(tipoPreco);
    }
}

export default new SaveTipoPrecoService;