import { Knex } from "knex";
import { isNumber } from "../../helpers/validation";
import { TableNames } from "../TableNames";

/**
 * Verifica se o número de itens a serem criados foi passado no cli. Se não, define o número de registros para 15.
 */
const numRegistros: number = isNumber(process.argv[process.argv.length - 1]) ? parseInt(process.argv[process.argv.length - 1]) : 15;

/**
 * Gera um número aleatório entre os índices do array.
 * @param arrayNums - um array de números (referente a cada id existente).
 * @returns um índice do array.
 */
const randomIndexOfArray = (arrayNums: Array<number>) => { return arrayNums[Math.floor(Math.random() * arrayNums.length)]; };

/**
 * Gera um número aleatório entre o valor mínimo e máximo.
 * @param min - o valor mínimo.
 * @param max - o valor máximo.
 * @returns o número gerado.
 */
const random = (min: number, max: number) => { return Math.floor(Math.random() * (max - min + 1)) + min; };

/**
 * Formata o fuso horário para ficar de acordo com o banco de dados
 * @param date um valor do tipo Date
 * @returns uma data formatada para o banco de dados
 */
const dataFormatToDataBase = (date: any = new Date()) => 
{
    const dateformat = new Date(date);
    return new Date(dateformat.getTime() + dateformat.getTimezoneOffset() * 60000);
};

/**
 * Gera uma data aleatória de acordo com os valores de entrada
 * @param minMonths - valor mínimo do mês
 * @param maxMonths - valor máximo do mês
 * @param minYears - valor mínimo do mês
 * @param maxYears - valor máximo do mês
 * @returns uma data formatada para String ex: YYYY-MM-DD
 */
const getRandomDateInMonthsAndYears = (minMonths: number, maxMonths: number, minYears: number, maxYears: number) => 
{
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    let futureMonth = currentMonth + random(minMonths, maxMonths);
    let futureYear = Math.floor((currentMonth + random(minMonths, maxMonths)) / 12) + random(minYears, maxYears);

    const lastDayOfMonth = new Date(futureYear, futureMonth + 1, 0).getDate();
    let futureDay = random(1, lastDayOfMonth);

    const newDate = `${futureYear}-${futureMonth}-${futureDay}`;
    
    if(new Date(newDate).toString() == "Invalid Date")
    {
        futureYear = currentYear;
        futureMonth = currentMonth;
        futureDay = today.getDay();
    }
    
    return `${futureYear}-${futureMonth}-${futureDay}`;
};

interface DadosToDB 
{
    data_ocorrido: Date, 
    id_tipo_ocorrencia: number, 
    id_tipo_assunto: number,
    mensagem: string,
    valor_metragem: number, 
    id_nivel_gratificacao?: number,
    id_nivel_advertencia?: number,
    id_shark_criador: number, 
    id_shark_referente: number
}

/**
 * Gera os índices a serem inseridos na tabela shark do banco de dados.
 * @param numRegistros - O número de registros a serem gerados na seed.
 * @returns uma promise contendo uma coleção de objetos relacionadas a tabela shark.
 */
const generateData = async (numRegistros: number, idsSharks: Array<number>, idsTipoOcorencias: Array<number>, idsTipoAssuntos: Array<number>,
    idsNivelGratificacao: Array<number>, idsNivelAdvertencia: Array<number>) => {

    const dadosGerados: DadosToDB[] = [];

    for (let i = 0; i < numRegistros; i++)
    {
        // Pega um id aleatório dentro do array
        const tipoOcorrencia = randomIndexOfArray(idsTipoOcorencias);
        const tipoAssunto = randomIndexOfArray(idsTipoAssuntos);
        const mensagem = `${i} - mensagem padrão.`;
        const valorMetragem = random(0, 12);
        const sharkReferente = { id: randomIndexOfArray(idsSharks), celula: {id: random(1, 6) }, email: "test@hotmail.com", nome: "Nome test"};
        const dataOcorrido = getRandomDateInMonthsAndYears(1, 12, 2014, 2023);
        let nivelGratificacao;
        let nivelAdvertencia;

        if(tipoOcorrencia === 5)
            nivelGratificacao = randomIndexOfArray(idsNivelGratificacao);
        else if(tipoOcorrencia === 6)
            nivelAdvertencia = randomIndexOfArray(idsNivelAdvertencia);

        dadosGerados.push({ 
            data_ocorrido: dataFormatToDataBase(dataOcorrido), id_tipo_assunto: tipoAssunto, id_shark_referente: sharkReferente.id,
            id_tipo_ocorrencia: tipoOcorrencia, mensagem: mensagem, valor_metragem: valorMetragem, id_shark_criador: 1,
            id_nivel_gratificacao: nivelGratificacao, id_nivel_advertencia: nivelAdvertencia
        });
    }

    return dadosGerados;
};

export async function seed(knex: Knex) 
{
    const idsSharks = (await knex(TableNames.shark)).map(obj => obj.id);
    const idsTipoOcorencias = (await knex(TableNames.tipo_ocorrencia)).map(obj => obj.id);
    const idsTipoAssuntos = (await knex(TableNames.tipo_assunto)).map(obj => obj.id);
    const idsNivelAdvertencia = (await knex(TableNames.nivel_advertencia)).map(obj => obj.id);
    const idsNivelGratificacao = (await knex(TableNames.nivel_gratificacao)).map(obj => obj.id);
    
    if(idsSharks[0] === 1)
        idsSharks.shift(); // remove o id 1
    
    const dadosGerados = await generateData(numRegistros, idsSharks, idsTipoOcorencias, idsTipoAssuntos, 
        idsNivelGratificacao, idsNivelAdvertencia);

    await knex(TableNames.ocorrencia).insert(dadosGerados);
}