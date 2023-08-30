import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> 
{
    await knex.raw(`
        CREATE OR REPLACE FUNCTION atualiza_metragem()
        RETURNS TRIGGER AS $$
        DECLARE
            vIdAdvertencia INT;
            vIdGratificacao INT;
            vIdAviso INT;
        BEGIN
            -- Salva o id referente ao tipo de ocorrência advertência
            SELECT id INTO vIdAdvertencia FROM tipo_ocorrencia
            WHERE nome ILIKE '%adver%';
        
            -- Salva o id referente ao tipo de ocorrência gratificação
            SELECT id INTO vIdGratificacao FROM tipo_ocorrencia
            WHERE nome ILIKE '%grat%';
        
            -- Salva o id referente ao tipo de ocorrência aviso
            SELECT id INTO vIdAviso FROM tipo_ocorrencia
            WHERE nome ILIKE '%aviso%';
                    
            IF (new.valor_metragem != 0) THEN
                /* Lógica de inclusão: calcula a metragem quando a ocorrência é inserida ou atualizada */
                IF (new.id_tipo_ocorrencia = vIdAdvertencia) THEN -- Alterar o valor de acordo com id da advertência na tabela tipo_ocorrencia
                    UPDATE shark SET metragem = metragem - new.valor_metragem
                    WHERE id = new.id_shark_referente;
                ELSIF (new.id_tipo_ocorrencia = vIdGratificacao) THEN
                    UPDATE shark SET metragem = metragem + new.valor_metragem
                    WHERE id = new.id_shark_referente;
                ELSIF (new.id_tipo_ocorrencia = vIdAviso) THEN
                    UPDATE shark SET metragem = metragem - new.valor_metragem
                    WHERE id = new.id_shark_referente;
                END IF;
            ELSIF (old.valor_metragem != 0) THEN 
            /* Lógica de exclusão: devolve a metragem quando a ocorrência é apagada */
                IF (old.id_tipo_ocorrencia = vIdAdvertencia) THEN -- Alterar o valor de acordo com id da advertência na tabela tipo_ocorrencia
                    UPDATE shark SET metragem = metragem + old.valor_metragem
                    WHERE id = old.id_shark_referente;
                ELSIF (old.id_tipo_ocorrencia = vIdGratificacao) THEN
                    UPDATE shark SET metragem = metragem - old.valor_metragem
                    WHERE id = old.id_shark_referente;
                ELSIF (old.id_tipo_ocorrencia = vIdAviso) THEN
                    UPDATE shark SET metragem = metragem + old.valor_metragem
                    WHERE id = old.id_shark_referente;
                END IF;
            END IF;
        
            RETURN NULL;
        END;
        $$ LANGUAGE plpgsql;`
    ).then(() => { console.log("Função de metragem criada"); });

    await knex.raw(`
        CREATE TRIGGER tg_atualiza_metragem_insert
        AFTER INSERT ON ocorrencia
        FOR EACH ROW EXECUTE FUNCTION atualiza_metragem();
    `).then(() => { console.log("Trigger de inserção de metragem criada"); });

    await knex.raw(`
        CREATE TRIGGER tg_atualiza_metragem_update
        AFTER UPDATE ON ocorrencia
        FOR EACH ROW EXECUTE FUNCTION atualiza_metragem();
    `).then(() => { console.log("Trigger de atualização de metragem criada"); });

    await knex.raw(`
        CREATE TRIGGER tg_devolve_metragem_delete
        AFTER DELETE ON ocorrencia
        FOR EACH ROW EXECUTE FUNCTION atualiza_metragem();
    `).then(() => { console.log("Trigger de devolução de metragem criada"); });
}


export async function down(knex: Knex): Promise<void> 
{
    await knex.schema.raw("DROP TRIGGER IF EXISTS tg_atualiza_metragem_insert ON ocorrencia;")
        .then(() => { console.log("Trigger de inserção de metragem removida"); });
    await knex.schema.raw("DROP TRIGGER IF EXISTS tg_atualiza_metragem_update ON ocorrencia;")
        .then(() => { console.log("Trigger de atualização de metragem removida"); });
    await knex.schema.raw("DROP TRIGGER IF EXISTS tg_devolve_metragem_delete ON ocorrencia;")
        .then(() => { console.log("Trigger de devolver de metragem on delete removida"); });
    await knex.schema.raw("DROP FUNCTION IF EXISTS atualiza_metragem();")
        .then(() => { console.log("Função de atualização de metragem removida"); });
}

