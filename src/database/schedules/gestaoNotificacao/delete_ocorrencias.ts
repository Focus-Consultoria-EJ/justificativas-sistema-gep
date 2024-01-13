import schedule from "node-schedule";
import OcorrenciaRepository from "../../repositories/gestaoNotificacao/OcorrenciaRepository";
import { DateSchedules } from "../DateSchedules";

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
export async function jobApagaOcorrencias() {
   
    const job1 = schedule.scheduleJob(DateSchedules.primeiroCiclo, () => {
        deleteData().then(() => {
            console.log("Executanto o agendamento... (delete de ocorrências)");
        })
            .catch(err => console.log(`Não foi possível executar o primeiro agendamento. Erro: ${err}`));
    });

    const job2 = schedule.scheduleJob(DateSchedules.segundoCiclo, () => {
        deleteData().then(() => {
            console.log("Executanto o segundo agendamento... (delete de ocorrências)");
        })
            .catch(err => console.log(`Não foi possível executar o segundo agendamento. Erro: ${err}`));
    });

    // Verificar se o job está configurado
    const jobsAgendados = schedule.scheduledJobs;

    if (job1.name in jobsAgendados) 
        console.log(`O ${job1.name} (delete de ocorrências) está configurado.`);
    else 
        console.log("A tarefa não está configurada ou já foi executada.");
    
    if (job2.name in jobsAgendados) 
        console.log(`O ${job2.name} (delete de ocorrências) está configurado.`);
    else 
        console.log("A tarefa não está configurada ou já foi executada.");
}