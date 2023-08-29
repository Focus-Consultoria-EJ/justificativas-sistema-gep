import CustoRepository from "../../../database/repositories/precificacao/CustoRepository";
import { errMsg } from "../../../helpers/ErrorMessages";
import { checkId } from "../../../helpers/validation";
import { BadRequestError } from "../../../middlewares/Error.middleware";
import { Custo } from "../../../models/precificacao/Custo";

class SaveCustoClienteService 
{
    /**
     * Serviço responsável pela inserção ou atualização de multiplos dados do tipo Custo. Eles precisam ser do tipo array JSON.
     * @param data - os dados vindos do header.
     */
    async execute(datas: Custo[], contentType?: string): Promise<void>
    {
        const custos: Custo[] = [];
        let idTotalCusto;

        // Verifica se o que vem do body é do tipo JSON
        if(!contentType || contentType !== "application/json")
            throw new BadRequestError("Os dados precisam ser um array do tipo JSON.");
        
        for (const key in datas) {
            const idx = parseInt(key);
            const data = datas[key];
            
            // Salva o id vindo do parâmetro
            if(typeof data === "string")
            {
                idTotalCusto = checkId(data);
                break;
            }

            if(!data.nome || data.nome.length <= 3 || data.nome.length >= 250) 
                throw new BadRequestError("Digite um nome com 3 ou mais caracteres. (max: 250) > item " + idx);

            if(!data.mesInicio || data.mesInicio.length <= 3 || data.mesInicio.length >= 80) 
                throw new BadRequestError("Digite um mês de início com 3 ou mais caracteres. (max: 80) > item " + idx);

            if(!data.quantidade || isNaN(data.quantidade) || Number(data.quantidade) < 0) 
                throw new BadRequestError("Digite uma quantidade maior que 0. > item " + idx);

            if(!data.preco || isNaN(data.preco)) 
                throw new BadRequestError("Digite uma preço. > item " + idx);

            if(!data.numeroDias || isNaN(data.numeroDias) || Number(data.numeroDias) < 0) 
                throw new BadRequestError("Digite um número de dias maior que 0. > item " + idx);

            if(data.valido && (!data.justificativa || data.justificativa.length < 10 || data.justificativa.length > 900))
                throw new BadRequestError("Digite uma uma justificativa com 10 ou mais caracteres. (max: 900) > item " + idx);

            const custo: Custo = { 
                nome: data.nome, 
                mesInicio: data.mesInicio,
                quantidade: data.quantidade,
                preco: data.preco,
                numeroDias: data.numeroDias,
                valido: data.valido,
                justificativa: data.justificativa
            };  

            custos.push(custo);
        }

        if(idTotalCusto)
            if(!await CustoRepository.getById(Number(idTotalCusto)))
                throw new BadRequestError(errMsg.CUSTO.NOT_FOUND);   

        if(idTotalCusto)
        {
            // Pega os ids de cada custo na tabela custo
            const custosOldData = await CustoRepository.getById(idTotalCusto);

            if(custosOldData?.length === 0)
                throw new BadRequestError("Custo vazio.");   

            // Associa os ids dos custos do banco de dados com os do forms
            custos.forEach((custo, idx) => {
                custo.id = custosOldData![idx].id;
            });

            await CustoRepository.update(custos, idTotalCusto);
        }
        else
            await CustoRepository.insert(custos);
    }
}

export default new SaveCustoClienteService;