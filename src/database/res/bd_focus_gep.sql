-- CREATE SCHEMA public; -- CREATE DATABASE IF NOT EXISTS db_focus_gep_backend;
-- \c db_focus_gep_backend;

-- begin;
-- set transaction read write;

CREATE TABLE tipo_ocorrencia (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(300) NOT NULL
);

INSERT INTO tipo_ocorrencia (nome) VALUES ('justificativa');
INSERT INTO tipo_ocorrencia (nome) VALUES ('não aceita');
INSERT INTO tipo_ocorrencia (nome) VALUES ('plausível');
INSERT INTO tipo_ocorrencia (nome) VALUES ('aviso');
INSERT INTO tipo_ocorrencia (nome) VALUES ('gratificação');
INSERT INTO tipo_ocorrencia (nome) VALUES ('advertência');

CREATE TABLE tipo_assunto (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(300) NOT NULL
);

INSERT INTO tipo_assunto (nome) VALUES ('plantão');
INSERT INTO tipo_assunto (nome) VALUES ('reunião de célula');
INSERT INTO tipo_assunto (nome) VALUES ('reunião geral');
INSERT INTO tipo_assunto (nome) VALUES ('reunião de projetos');
INSERT INTO tipo_assunto (nome) VALUES ('shark-in ou shark-out');
INSERT INTO tipo_assunto (nome) VALUES ('treinamento');
INSERT INTO tipo_assunto (nome) VALUES ('outros');

CREATE TABLE nivel_advertencia (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
	valor SMALLINT NOT NULL
);

INSERT INTO nivel_advertencia (nome, valor) VALUES ('leve', 2);
INSERT INTO nivel_advertencia (nome, valor) VALUES ('moderado', 4);
INSERT INTO nivel_advertencia (nome, valor) VALUES ('grave', 6);
INSERT INTO nivel_advertencia (nome, valor) VALUES ('gravíssima', 8);
INSERT INTO nivel_advertencia (nome, valor) VALUES ('gravíssima', 10);

CREATE TABLE nivel_gratificacao (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
	valor SMALLINT NOT NULL
);

INSERT INTO nivel_gratificacao (nome, valor) VALUES ('bom', 1);
INSERT INTO nivel_gratificacao (nome, valor) VALUES ('ótimo', 2);
INSERT INTO nivel_gratificacao (nome, valor) VALUES ('excelente', 4);

CREATE TABLE celula (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(300) NOT NULL
);

INSERT INTO celula (nome) VALUES ('presidência');
INSERT INTO celula (nome) VALUES ('administração Financeira');
INSERT INTO celula (nome) VALUES ('gestão estratégica de pessoas');
INSERT INTO celula (nome) VALUES ('marketing');
INSERT INTO celula (nome) VALUES ('comercial');
INSERT INTO celula (nome) VALUES ('projetos');

CREATE TABLE distancia_residencia (
    id SERIAL PRIMARY KEY,
    distancia VARCHAR(300) NOT NULL
);

INSERT INTO distancia_residencia (distancia) VALUES ('perto');
INSERT INTO distancia_residencia (distancia) VALUES ('longe');
INSERT INTO distancia_residencia (distancia) VALUES ('muito longe');

CREATE TABLE role (
	id SERIAL PRIMARY KEY,
	nome VARCHAR(60) NOT NULL
);

INSERT INTO role (nome) VALUES ('member');
INSERT INTO role (nome) VALUES ('admin');
INSERT INTO role (nome) VALUES ('dev');

CREATE TABLE shark (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(300) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    telefone VARCHAR(14),
    id_distancia_residencia SMALLINT NOT NULL,
    matricula VARCHAR(15) NOT NULL UNIQUE,
    senha VARCHAR(60) NOT NULL,
    id_celula SMALLINT NOT NULL,
    num_projeto SMALLINT NOT NULL DEFAULT 0,
    metragem SMALLINT NOT NULL DEFAULT 24,
    id_role SMALLINT NOT NULL DEFAULT 1, -- DEFAULT member
    membro_ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP NOT NULL DEFAULT NOW(),
  	CONSTRAINT fk_shark__id_distancia_residencia FOREIGN KEY (id_distancia_residencia)
		REFERENCES distancia_residencia(id) ON DELETE CASCADE ON UPDATE CASCADE,  
	CONSTRAINT fk_shark__id_celula FOREIGN KEY (id_celula)
		REFERENCES celula(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_shark__id_role FOREIGN KEY (id_role)
		REFERENCES role(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Login: email ou matricula, Senha: f0K!1503
INSERT INTO shark (nome, email, cpf, id_distancia_residencia, matricula, senha, id_celula, id_role)
	VALUES ('admin', 'admin@hotmail.com', '123.456.789-10', 1, '0000000', '$2b$10$nFpL8mEl54cDYFYSQriSBOt1qqp2h9rg2x2gAmgAXbOlKJVo7XRb6', 3, 3);
	
CREATE TABLE email_pessoal (
	id SERIAL PRIMARY KEY,
	id_shark SMALLINT NOT NULL,
	email VARCHAR(100) NOT NULL UNIQUE,
	CONSTRAINT fk_email_pessoal__shark_id FOREIGN KEY (id_shark)
		REFERENCES shark(id) ON DELETE CASCADE ON UPDATE CASCADE
);	
	
CREATE TABLE tipo_acao_log (
	id SERIAL PRIMARY KEY,
  	nome VARCHAR(40) NOT NULL
);

INSERT INTO tipo_acao_log (nome) VALUES ('inserção');
INSERT INTO tipo_acao_log (nome) VALUES ('atualização');
INSERT INTO tipo_acao_log (nome) VALUES ('remoção');

CREATE TABLE shark_log (
  id SERIAL PRIMARY KEY,
  id_tipo_acao_log SMALLINT NOT NULL,
  id_shark SMALLINT NOT NULL,
  id_shark_editor SMALLINT NOT NULL,
  data_acao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_shark_log__tipo_acao_log_id FOREIGN KEY (id_tipo_acao_log)
  REFERENCES tipo_acao_log(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_shark_log__shark_id_editor FOREIGN KEY (id_shark_editor)
  REFERENCES shark(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE ocorrencia(
	id SERIAL PRIMARY KEY,
	data_ocorrido TIMESTAMP NOT NULL DEFAULT NOW(),
	id_tipo_ocorrencia SMALLINT NOT NULL,
	id_tipo_assunto SMALLINT NOT NULL,
	mensagem VARCHAR(500) NOT NULL,
	valor_metragem SMALLINT DEFAULT 0,
	id_nivel_advertencia SMALLINT,
	id_nivel_gratificacao SMALLINT,
	id_shark_criador SMALLINT NOT NULL,
	id_shark_referente SMALLINT NOT NULL,
	data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT fk_ocorrencia__tipo_ocorrencia_id FOREIGN KEY (id_tipo_ocorrencia)
		REFERENCES tipo_ocorrencia(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_ocorrencia__tipo_assunto_id FOREIGN KEY (id_tipo_assunto)
		REFERENCES tipo_assunto(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_ocorrencia__nivel_advertencia_id FOREIGN KEY (id_nivel_advertencia)
		REFERENCES nivel_advertencia(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
	CONSTRAINT fk_ocorrencia__nivel_gratificacao_id FOREIGN KEY (id_nivel_gratificacao)
		REFERENCES nivel_gratificacao(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
	CONSTRAINT fk_ocorrencia__shark_id_criador FOREIGN KEY (id_shark_criador)
		REFERENCES shark(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_ocorrencia__shark_id_referente FOREIGN KEY (id_shark_referente)
		REFERENCES shark(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE ocorrencia_log (
	id SERIAL PRIMARY KEY,
    id_tipo_acao_log SMALLINT NOT NULL,
    id_ocorrencia SMALLINT NOT NULL,
    id_shark_editor SMALLINT NOT NULL,
    data_acao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ocorrencia_log__tipo_acao_log_id FOREIGN KEY (id_tipo_acao_log)
		REFERENCES tipo_acao_log(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_ocorrencia_log__shark_id_editor FOREIGN KEY (id_shark_editor)
		REFERENCES shark(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE upload_file (
  id INT AUTO_INCREMENT PRIMARY KEY,
  google_drive_id VARCHAR(255) NOT NULL,
  nome_arquivo VARCHAR(255) NOT NULL,
  tipo_arquivo VARCHAR(50) NOT NULL,
  id_ocorrencia SMALLINT NOT NULL,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_uploaded_files__ocorrencia_id FOREIGN KEY (id_ocorrencia)
		REFERENCES ocorrencia(id) ON DELETE CASCADE ON UPDATE CASCADE,
);

CREATE TABLE evento (
	id SERIAL PRIMARY KEY,
    titulo VARCHAR(300) NOT NULL,
    descricao VARCHAR(2000),
    data_acao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,		
    data_termino TIMESTAMP DEFAULT (CURRENT_DATE + INTERVAL '1 DAY')
);

CREATE TABLE presenca (
	id SERIAL PRIMARY KEY,
    id_shark SMALLINT NOT NULL,
    id_evento SMALLINT NOT NULL,
    confirmado BOOLEAN NOT NULL DEFAULT FALSE,
    data_acao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_presenca__shark_id FOREIGN KEY (id_shark)
		REFERENCES shark(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_presenca__evento_id FOREIGN KEY (id_evento)
		REFERENCES evento(id) ON DELETE CASCADE ON UPDATE CASCADE
);

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
$$ LANGUAGE plpgsql;

CREATE TRIGGER tg_atualiza_metragem_insert
AFTER INSERT ON ocorrencia
FOR EACH ROW EXECUTE FUNCTION atualiza_metragem();

CREATE TRIGGER tg_atualiza_metragem_update
AFTER UPDATE ON ocorrencia
FOR EACH ROW EXECUTE FUNCTION atualiza_metragem();

CREATE TRIGGER tg_devolve_metragem_delete
AFTER DELETE ON ocorrencia
FOR EACH ROW EXECUTE FUNCTION atualiza_metragem();

-- commit;
