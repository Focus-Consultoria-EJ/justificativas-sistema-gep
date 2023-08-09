import { jobApagaOcorrencias } from "./gestaoNotificacao/delete_ocorrencias";
import { jobResetMetragemSharks } from "./gestaoNotificacao/reset_metragem_sharks";

/**
 * Agenda funções que serão executadas em determinada data.
 */
export function agendaJobs() 
{
    jobResetMetragemSharks(); // 2º
    jobApagaOcorrencias(); // 1º
}