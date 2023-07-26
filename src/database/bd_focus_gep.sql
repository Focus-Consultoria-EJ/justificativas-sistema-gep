CREATE SCHEMA public;-- CREATE DATABASE IF NOT EXISTS db_focus_gep_backend;
-- \c db_focus_gep_backend;

-- begin;
-- set transaction read write;

CREATE TABLE tipo_ocorrencia (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(300) NOT NULL
);

INSERT INTO tipo_ocorrencia (nome) VALUES ('Justificativa');
INSERT INTO tipo_ocorrencia (nome) VALUES ('Não aceita');
INSERT INTO tipo_ocorrencia (nome) VALUES ('Plausível');
INSERT INTO tipo_ocorrencia (nome) VALUES ('Primeiro aviso');
INSERT INTO tipo_ocorrencia (nome) VALUES ('Segundo aviso');
INSERT INTO tipo_ocorrencia (nome) VALUES ('Gratificação');
INSERT INTO tipo_ocorrencia (nome) VALUES ('Advertência');

CREATE TABLE tipo_assunto (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(300) NOT NULL
);

INSERT INTO tipo_assunto (nome) VALUES ('Plantão');
INSERT INTO tipo_assunto (nome) VALUES ('Reunião de célula');
INSERT INTO tipo_assunto (nome) VALUES ('Reunião geral');
INSERT INTO tipo_assunto (nome) VALUES ('Reunião de projetos');
INSERT INTO tipo_assunto (nome) VALUES ('Shark-in ou Shark-out');
INSERT INTO tipo_assunto (nome) VALUES ('Treinamento');
INSERT INTO tipo_assunto (nome) VALUES ('Outros');

CREATE TABLE celula (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(300) NOT NULL
);

INSERT INTO celula (nome) VALUES ('Presidência');
INSERT INTO celula (nome) VALUES ('Administração Financeira');
INSERT INTO celula (nome) VALUES ('Gestão estratégica de pessoas');
INSERT INTO celula (nome) VALUES ('Marketing');
INSERT INTO celula (nome) VALUES ('Comercial');
INSERT INTO celula (nome) VALUES ('Projetos');

CREATE TABLE distancia_residencia (
    id SERIAL PRIMARY KEY,
    distancia VARCHAR(300) NOT NULL
);

INSERT INTO distancia_residencia (distancia) VALUES ('Perto');
INSERT INTO distancia_residencia (distancia) VALUES ('Longe');
INSERT INTO distancia_residencia (distancia) VALUES ('Muito Longe');

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
INSERT INTO shark (nome, email, cpf, matricula, senha, id_celula, id_role)
	VALUES ('admin', 'admin@hotmail.com', '123.456.789-10', '0000000', '$2b$10$nFpL8mEl54cDYFYSQriSBOt1qqp2h9rg2x2gAmgAXbOlKJVo7XRb6', 3, 3);
	
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

INSERT INTO tipo_acao_log (nome) VALUES ('Inserção');
INSERT INTO tipo_acao_log (nome) VALUES ('Atualização');
INSERT INTO tipo_acao_log (nome) VALUES ('Remoção');

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
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  id_shark_criador SMALLINT NOT NULL,
  id_shark_referente SMALLINT NOT NULL,
  CONSTRAINT fk_ocorrencia__tipo_ocorrencia_id FOREIGN KEY (id_tipo_ocorrencia)
		REFERENCES tipo_ocorrencia(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_ocorrencia__tipo_assunto_id FOREIGN KEY (id_tipo_assunto)
		REFERENCES tipo_assunto(id) ON DELETE CASCADE ON UPDATE CASCADE,
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
BEGIN
	-- Salva o id referente ao tipo de ocorrência advertência
	SELECT id INTO vIdAdvertencia FROM tipo_ocorrencia
	WHERE nome ILIKE '%adver%';

	-- Salva o id referente ao tipo de ocorrência gratificação
	SELECT id INTO vIdGratificacao FROM tipo_ocorrencia
	WHERE nome ILIKE '%grat%';

	IF (new.valor_metragem != 0) THEN
		-- Se for advertência subtrai a metragem
		IF (new.id_tipo_ocorrencia = vIdAdvertencia) THEN -- Alterar o valor de acordo com id da advertência na tabela tipo_ocorrencia
			UPDATE shark SET metragem = metragem - new.valor_metragem
			WHERE id = new.id_shark_referente;
		ELSIF (new.id_tipo_ocorrencia = vIdGratificacao) THEN
			UPDATE shark SET metragem = metragem + new.valor_metragem
			WHERE id = new.id_shark_referente;
		END IF;
	END IF;

	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tg_atualiza_metragem_insert
AFTER INSERT ON ocorrencia
FOR EACH ROW EXECUTE FUNCTION atualiza_metragem();

CREATE TRIGGER tg_atualiza_metragem_update
AFTER UPDATE ON ocorrencia
FOR EACH ROW EXECUTE FUNCTION atualiza_metragem();

-- commit;
