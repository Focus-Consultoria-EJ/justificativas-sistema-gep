import schedule from "node-schedule";
import { DateSchedules } from "../DateSchedules";
import SharkRepository from "../../repositories/SharkRepository";

/**
 * Job responsável por apagar todas as ocorrências
 */
export async function jobResetMetragemSharks() {
   
    const job1 = schedule.scheduleJob(DateSchedules.primeiroCiclo, () => {
        SharkRepository.resetMetragem().then(() => {
            console.log("Executanto o agendamento... (Reset de metragem)");
        })
            .catch(err => console.log(`Não foi possível executar o primeiro agendamento. Erro: ${err}`));
    });

    const job2 = schedule.scheduleJob(DateSchedules.segundoCiclo, () => {
        SharkRepository.resetMetragem().then(() => {
            console.log("Executanto o agendamento... (Reset de metragem)");
        })
            .catch(err => console.log(`Não foi possível executar o segundo agendamento. Erro: ${err}`));
    });

    // Verificar se o job está configurado
    const jobsAgendados = schedule.scheduledJobs;

    if (job1.name in jobsAgendados) 
        console.log(`O ${job1.name} (reset de metragem) está configurado.`);
    else 
        console.log("A tarefa não está configurada ou já foi executada.");
    
    if (job2.name in jobsAgendados) 
        console.log(`O ${job2.name} (reset de metragem) está configurado.`);
    else 
        console.log("A tarefa não está configurada ou já foi executada.");
}