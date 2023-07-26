import schedule from "node-schedule";
import OcorrenciaRepository from "../../repositories/gestaoNotificacao/OcorrenciaRepository";

/**
 * Executa uma sequência de comandos para apagar os dados da tabela ocorrencia e ocorrencia_log.
 */
const deleteData = async () => 
{ 
    await OcorrenciaRepository.deleteAllOcorrenciaLog();
    await OcorrenciaRepository.deleteAllOcorrencia();
};

/**
 * Job responsável por apagar todas as ocorrências
 */
export function jobApagaOcorrencias() {
    /* 
    *   Agendamento 1, Será executado em 30/06 de qualquer ano às 00:00:00
    *   seg min hora dia mes ano
    */
    const job1 = schedule.scheduleJob("0 0 0 30 6 *", () => {
        deleteData().then(() => {
            console.log("Executanto o primeiro agendamento...");
        })
            .catch(err => console.log(`Não foi possível executar o primeiro agendamento. Erro: ${err}`));
    });

    /* 
    *   Agendamento 2, Será executado em 31/12 de qualquer ano às 00:00:00
    *   seg min hora dia mes ano
    */
    const job2 = schedule.scheduleJob("0 0 0 31 12 *", () => {
        deleteData().then(() => {
            console.log("Executanto o segundo agendamento...");
        })
            .catch(err => console.log(`Não foi possível executar o primeiro agendamento. Erro: ${err}`));
    });

    // Verificar se o job está configurado
    const jobsAgendados = schedule.scheduledJobs;

    if (job1.name in jobsAgendados) 
        console.log(`O ${job1.name} está configurado.`);
    else 
        console.log("A tarefa não está configurada ou já foi executada.");
    
    if (job2.name in jobsAgendados) 
        console.log(`O ${job2.name} está configurado.`);
    else 
        console.log("A tarefa não está configurada ou já foi executada.");
}