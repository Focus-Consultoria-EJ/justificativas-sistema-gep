export enum DateSchedules {
    /* 
   *   Agendamento 1, Será executado em 30/06 de qualquer ano às 00:00:00
   *   seg min hora dia mes ano
   */
    primeiroCiclo = "0 0 0 30 6 *",

   /* 
   *   Agendamento 2, Será executado em 31/12 de qualquer ano às 00:00:00
   *   seg min hora dia mes ano
   */
   segundoCiclo = "0 0 0 31 12 *"
}