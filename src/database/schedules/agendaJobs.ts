import { jobApagaOcorrencias } from "./gestaoNotificacao/delete_ocorrencias";
import { jobRemoveTodasOsArquivosDoDrive } from "./gestaoNotificacao/remove_all_files_on_drive";
import { jobResetMetragemSharks } from "./gestaoNotificacao/reset_metragem_sharks";

/**
 * Agenda funções que serão executadas em determinada data.
 */
export function agendaJobs() 
{
    jobRemoveTodasOsArquivosDoDrive(); // 3º
    jobResetMetragemSharks(); // 2º
    jobApagaOcorrencias(); // 1º
}