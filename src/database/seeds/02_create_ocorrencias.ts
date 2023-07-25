import { Knex } from "knex";
import { isNumber } from "../../helpers/validation";
import { TableNames } from "../TableNames";
import { Ocorrencia } from "../../models/gestaoNotificacao/Ocorrencia";

/**
 * Verifica se o número de itens a serem criados foi passado no cli. Se não, define o número de registros para 15.
 */
const numRegistros: number = isNumber(process.argv[process.argv.length - 1]) ? parseInt(process.argv[process.argv.length - 1]) : 15;


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
    id_shark_criador: number, 
    id_shark_referente: number
}

/**
 * Gera os índices a serem inseridos na tabela shark do banco de dados.
 * @param numRegistros - O número de registros a serem gerados na seed.
 * @returns uma promise contendo uma coleção de objetos relacionadas a tabela shark.
 */
const generateData = async (numRegistros: number, arrayOfIds: Array<number>) => {

    const dadosGerados: DadosToDB[] = [];

    const ocorrencia: Ocorrencia = {
        id: 1,
        tipoOcorrencia: { id: random(1, 7) },
        tipoAssunto: { id: random(1, 7) },
        mensagem: "Mensagem padrão.",
        valorMetragem: random(0, 12),
        sharkReferente: { id: random(1, 15), celula: {id: random(1, 6) }, email: "test@hotmail.com", nome: "Nome test"},
        dataOcorrido: getRandomDateInMonthsAndYears(1, 12, 2014, 2023),
    };

    for (let i = 0; i < numRegistros; i++)
    {
        // Pega um id aleatório dentro do array
        const randomIndex = Math.floor(Math.random() * arrayOfIds.length);

        const tipoOcorrencia = ocorrencia.tipoOcorrencia.id = random(1, 7);
        const tipoAssunto = ocorrencia.tipoAssunto.id = random(1, 7);
        const mensagem = ocorrencia.mensagem = `${i} - mensagem padrão.`;
        const valorMetragem = ocorrencia.valorMetragem = random(0, 12);
        const sharkReferente = ocorrencia.sharkReferente = { id: arrayOfIds[randomIndex], celula: {id: random(1, 6) }, email: "test@hotmail.com", nome: "Nome test"};
        const dataOcorrido = ocorrencia.dataOcorrido = getRandomDateInMonthsAndYears(1, 12, 2014, 2023);

        dadosGerados.push({ 
            data_ocorrido: dataFormatToDataBase(dataOcorrido), id_tipo_assunto: tipoAssunto, id_shark_referente: sharkReferente.id,
            id_tipo_ocorrencia: tipoOcorrencia, mensagem: mensagem, valor_metragem: valorMetragem, id_shark_criador: 1
        });
    }

    return dadosGerados;
};

export async function seed(knex: Knex) 
{
    const ids = (await knex(TableNames.shark)).map(obj => obj.id);
    
    if(ids[0] === 1)
        ids.shift(); // remove o id 1

    const dadosGerados = await generateData(numRegistros, ids);
    await knex(TableNames.ocorrencia).insert(dadosGerados);
}