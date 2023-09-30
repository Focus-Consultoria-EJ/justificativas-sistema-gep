import { Knex } from "knex";
import { TableNames } from "../TableNames";


export async function up(knex: Knex): Promise<void>
{
    return await knex.schema.createTable(TableNames.servico, (table) => {
        table.increments("id").primary().index();
        table.string("nome", 300).notNullable();
    }).then(() => {
        console.log("Tabela " + TableNames.servico + " criada.");

        return knex(TableNames.servico).insert([
            { nome: "Estudo de Viabilidade Técnico Econômica" },
            { nome: "Mapeamento e Otimização de Processos" },
            { nome: "Pesquisa de Clima Organizacional" },
            { nome: "Pesquisa de Mercado" },
            { nome: "Pesquisa de Satisfação" },
            { nome: "Planejamento Estratégico" },
            { nome: "Planejamento Financeiro" },
            { nome: "Clima Organizacional" },
            { nome: "Plano de Negócios" },
            { nome: "Plano de Marketing" },
            { nome: "Precificação" },
            { nome: "Recrutamento e Seleção" },
            { nome: "Análise de Mercado" },
            { nome: "Pesquisa de Marketing" },
        ]);
    }).then(()=> console.log("Registros inseridos na tabela " + TableNames.servico + "."));
}

export async function down(knex: Knex): Promise<void> 
{
    return await knex.schema.dropTable(TableNames.servico)
        .then(() => {
            console.log("A tabela " + TableNames.servico + " foi removida.");
        });
}

