import schedule from "node-schedule";
import { DateSchedules } from "../DateSchedules";
import { removeAllFilesFromDrive } from "../../../config/googleAPI";

/**
 * Executa uma sequência de comandos para apagar os dados da tabela ocorrencia e ocorrencia_log.
 */
const removeAllFilesOnDrive = async () => 
{ 
    await removeAllFilesFromDrive();
};

/**
 * Job responsável por apagar todos os arquivos dentro do google drive
 */
export async function jobRemoveTodasOsArquivosDoDrive() {
   
    const job1 = schedule.scheduleJob(DateSchedules.primeiroCiclo, () => {
        removeAllFilesOnDrive().then(() => {
            console.log("Executanto o agendamento... (remover todos os arquivos do drive)");
        })
            .catch(err => console.log(`Não foi possível executar o primeiro agendamento. Erro: ${err}`));
    });

    const job2 = schedule.scheduleJob(DateSchedules.segundoCiclo, () => {
        removeAllFilesOnDrive().then(() => {
            console.log("Executanto o segundo agendamento... (remover todos os arquivos do drive)");
        })
            .catch(err => console.log(`Não foi possível executar o segundo agendamento. Erro: ${err}`));
    });

    // Verificar se o job está configurado
    const jobsAgendados = schedule.scheduledJobs;

    if (job1.name in jobsAgendados) 
        console.log(`O ${job1.name} (remover todos os arquivos do drive) está configurado.`);
    else 
        console.log("A tarefa não está configurada ou já foi executada.");
    
    if (job2.name in jobsAgendados) 
        console.log(`O ${job2.name} (remover todos os arquivos do drive) está configurado.`);
    else 
        console.log("A tarefa não está configurada ou já foi executada.");
}