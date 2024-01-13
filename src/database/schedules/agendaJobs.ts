import { jobApagaOcorrencias } from "./gestaoNotificacao/delete_ocorrencias";
import { jobRemoveTodasOsArquivosDoDrive } from "./gestaoNotificacao/remove_all_files_on_drive";
import { jobResetMetragemSharks } from "./gestaoNotificacao/reset_metragem_sharks";

/**
 * Agenda funções que serão executadas em determinada data.
 */
export async function agendaJobs() 
{
    await jobResetMetragemSharks(); // 2º
    await jobRemoveTodasOsArquivosDoDrive(); // 3º
    await jobApagaOcorrencias(); // 1º
}