import { Knex } from "knex";
import { TableNames } from "../TableNames";


export async function up(knex: Knex): Promise<void>
{
    return await knex.schema.createTable(TableNames.custo, (table) => {
        table.increments("id").primary().index();
        table.string("nome", 300).notNullable();
        table.string("mes_inicio", 100).notNullable();
        table.smallint("quantidade").notNullable();
        table.float("preco").notNullable();
        table.smallint("numero_dias");
        table.boolean("valido");
        table.string("justificativa", 1200); // É preenchido pelo adm fin quando recusar
        table.smallint("id_total_custo").notNullable();

        table
            .foreign("id_total_custo")
            .references("id")
            .inTable(TableNames.total_custo)
            .onDelete("RESTRICT")
            .onUpdate("RESTRICT");

    }).then(()=> console.log("Registros inseridos na tabela " + TableNames.custo + "."));
}

export async function down(knex: Knex): Promise<void> 
{
    return await knex.schema.dropTable(TableNames.custo)
        .then(() => {
            console.log("A tabela " + TableNames.custo + " foi removida.");
        });
}

