import { jobApagaOcorrencias } from "./gestaoNotificacao/delete_ocorrencias";

/**
 * Agenda funções que serão executadas em determinada data.
 */
export function agendaJobs() 
{
    jobApagaOcorrencias();
}