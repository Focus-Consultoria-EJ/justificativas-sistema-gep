import { Knex } from "knex";
import { TableNames } from "../TableNames";


export async function up(knex: Knex): Promise<void> 
{
    return await knex.schema.createTable(TableNames.ocorrencia, (table) => {
        table.increments("id").primary();
        table.timestamp("data_ocorrido").notNullable().defaultTo(knex.fn.now());
        table.smallint("id_tipo_ocorrencia").notNullable();
        table.smallint("id_tipo_assunto").notNullable();
        table.string("mensagem", 500).notNullable();
        table.smallint("valor_metragem").defaultTo(0);
        table.timestamp("data_criacao").defaultTo(knex.fn.now());
        table.smallint("id_shark_criador").notNullable();
        table.smallint("id_shark_referente").notNullable();
    
        table
            .foreign("id_tipo_ocorrencia")
            .references("id")
            .inTable(TableNames.tipo_ocorrencia)
            .onDelete("CASCADE")
            .onUpdate("CASCADE");

        table
            .foreign("id_tipo_assunto")
            .references("id")
            .inTable(TableNames.tipo_assunto)
            .onDelete("CASCADE")
            .onUpdate("CASCADE");
        
        table.foreign("id_shark_criador")
            .references("id")
            .inTable(TableNames.shark)
            .onDelete("CASCADE")
            .onUpdate("CASCADE");

        table
            .foreign("id_shark_referente")
            .references("id")
            .inTable(TableNames.shark)
            .onDelete("CASCADE")
            .onUpdate("CASCADE");

    }).then(() => { console.log("Tabela " + TableNames.ocorrencia + " criada."); });
}

export async function down(knex: Knex): Promise<void> 
{
    return await knex.schema.dropTable(TableNames.ocorrencia)
        .then(() => {
            console.log("A tabela " + TableNames.ocorrencia + " foi removida.");
        });
}

