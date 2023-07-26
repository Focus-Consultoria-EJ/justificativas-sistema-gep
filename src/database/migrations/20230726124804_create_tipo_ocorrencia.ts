import { Knex } from "knex";
import { TableNames } from "../TableNames";


export async function up(knex: Knex): Promise<void> 
{
    return await knex.schema.createTable(TableNames.tipo_ocorrencia, (table) => {
        table.increments("id").primary().index();
        table.string("nome", 300).notNullable();
    }).then(() => {
        console.log("Tabela " + TableNames.tipo_ocorrencia + " criada.");

        return knex(TableNames.tipo_ocorrencia).insert([
            { nome: "Justificativa" },
            { nome: "Não aceita" },
            { nome: "Plausível" },
            { nome: "Primeiro aviso" },
            { nome: "Segundo aviso" },
            { nome: "Gratificação" },
            { nome: "Advertência" },
        ]);
    }).then(()=> console.log("Registros inseridos na tabela " + TableNames.tipo_ocorrencia + "."));
}


export async function down(knex: Knex): Promise<void> 
{
    return await knex.schema.dropTable(TableNames.tipo_ocorrencia)
        .then(() => {
            console.log("A tabela " + TableNames.tipo_ocorrencia + " foi removida.");
        });
}

