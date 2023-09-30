import { Knex } from "knex";
import { TableNames } from "../TableNames";


export async function up(knex: Knex): Promise<void> 
{
    return await knex.schema.createTable(TableNames.precificacao, (table) => {
        table.increments("id").primary();
        table.boolean("composta").defaultTo(false);
        table.smallint("id_servico").notNullable();
        table.smallint("id_servico_composto"); // Se composta true, então este item deve ser passado
        table.smallint("id_cliente").notNullable();
        table.string("tipo_negocio", 300).notNullable();
        table.float("margem_incerteza").notNullable();
        table.smallint("qtd_membros").notNullable();
        table.float("custo_variavel").notNullable();
        table.string("modalidade", 300).notNullable();
        table.smallint("id_tipo_preco").notNullable();
        table.float("entrada").notNullable();
        table.smallint("parcelado").notNullable();
        table.float("valor_parcelas").notNullable();
        table.float("valor_a_vista").notNullable();
        table.timestamp("data_criacao").defaultTo(knex.fn.now());
    
        table
            .foreign("id_servico")
            .references("id")
            .inTable(TableNames.servico)
            .onDelete("RESTRICT")
            .onUpdate("CASCADE");

        table
            .foreign("id_servico_composto")
            .references("id")
            .inTable(TableNames.servico)
            .onDelete("RESTRICT")
            .onUpdate("CASCADE");
        
        table
            .foreign("id_cliente")
            .references("id")
            .inTable(TableNames.cliente)
            .onDelete("CASCADE")
            .onUpdate("CASCADE");

        table
            .foreign("id_tipo_preco")
            .references("id")
            .inTable(TableNames.tipo_preco)
            .onDelete("RESTRICT")
            .onUpdate("CASCADE");

    }).then(() => { console.log("Tabela " + TableNames.precificacao + " criada."); });
}

export async function down(knex: Knex): Promise<void> 
{
    return await knex.schema.dropTable(TableNames.precificacao)
        .then(() => {
            console.log("A tabela " + TableNames.precificacao + " foi removida.");
        });
}

