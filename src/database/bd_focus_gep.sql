CREATE TABLE tipo_ocorrencia (
	id TINYINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(300) NOT NULL
) ENGINE = InnoDB;

INSERT INTO tipo_ocorrencia (nome) VALUES ("Justificativa");
INSERT INTO tipo_ocorrencia (nome) VALUES ("Não aceita");
INSERT INTO tipo_ocorrencia (nome) VALUES ("Plausível");
INSERT INTO tipo_ocorrencia (nome) VALUES ("Primeiro aviso");
INSERT INTO tipo_ocorrencia (nome) VALUES ("Segundo aviso");
INSERT INTO tipo_ocorrencia (nome) VALUES ("Gratificação");
INSERT INTO tipo_ocorrencia (nome) VALUES ("Advertência");

CREATE TABLE tipo_assunto (
	id TINYINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(300) NOT NULL
) ENGINE = InnoDB;

INSERT INTO tipo_assunto (nome) VALUES ("Plantão");
INSERT INTO tipo_assunto (nome) VALUES ("Reunião de célula");
INSERT INTO tipo_assunto (nome) VALUES ("Reunião geral");
INSERT INTO tipo_assunto (nome) VALUES ("Reunião de projetos");
INSERT INTO tipo_assunto (nome) VALUES ("Shark-in ou Shark-out");
INSERT INTO tipo_assunto (nome) VALUES ("Treinamento");
INSERT INTO tipo_assunto (nome) VALUES ("Outros");

CREATE TABLE shark (
	id TINYINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(300) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telefone VARCHAR(14),
    matricula VARCHAR(15) NOT NULL,
    senha VARCHAR(60) NOT NULL,
    area VARCHAR(100) NOT NULL,
    num_projeto TINYINT  NOT NULL DEFAULT 0,
    metragem TINYINT  NOT NULL DEFAULT 24,
    admin BOOLEAN NOT NULL DEFAULT 0,
    membro_ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP NOT NULL DEFAULT NOW()
) ENGINE = InnoDB;

CREATE TABLE shark_image (
	id TINYINT AUTO_INCREMENT PRIMARY KEY,
	filename VARCHAR(1000) NOT NULL,
    size INT NOT NULL,
    hashname VARCHAR(1200) NOT NULL,
    url VARCHAR(1200) NOT NULL,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_shark TINYINT NOT NULL,
    CONSTRAINT fk_shark_image__shark_id FOREIGN KEY (id_shark)
		REFERENCES shark(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Login: email ou matricula, Senha: f0K!1503
INSERT INTO shark (nome, email, matricula, senha, area, admin)
	VALUES ("admin", "admin@hotmail.com", "0000000", "$2b$10$nFpL8mEl54cDYFYSQriSBOt1qqp2h9rg2x2gAmgAXbOlKJVo7XRb6", "Administrador", 1);

CREATE TABLE tipo_acao_log (
	id TINYINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(40) NOT NULL
);

INSERT INTO tipo_acao_log (nome) VALUES ("Inserção");
INSERT INTO tipo_acao_log (nome) VALUES ("Atualização");
INSERT INTO tipo_acao_log (nome) VALUES ("Remoção");

CREATE TABLE shark_log (
	id TINYINT AUTO_INCREMENT PRIMARY KEY,
    id_tipo_acao_log TINYINT NOT NULL,
    id_shark TINYINT NOT NULL,
    id_shark_editor TINYINT NOT NULL,
    data_acao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_shark_log__tipo_acao_log_id FOREIGN KEY (id_tipo_acao_log)
		REFERENCES tipo_acao_log(id) ON DELETE CASCADE ON UPDATE CASCADE,
    -- CONSTRAINT fk_shark_log__shark_id FOREIGN KEY (id_shark) REFERENCES shark(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_shark_log__shark_id_editor FOREIGN KEY (id_shark_editor)
		REFERENCES shark(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE ocorrencia(
	id TINYINT AUTO_INCREMENT PRIMARY KEY,
    data_ocorrido TIMESTAMP NOT NULL DEFAULT NOW(),
    id_tipo_ocorrencia TINYINT NOT NULL,
    id_tipo_assunto TINYINT NOT NULL,
    mensagem VARCHAR(300) NOT NULL,
    valor_metragem TINYINT DEFAULT 0,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_shark_criador TINYINT NOT NULL,
    id_shark_referente TINYINT NOT NULL,
    CONSTRAINT fk_ocorrencia__tipo_ocorrencia_id FOREIGN KEY (id_tipo_ocorrencia)
		REFERENCES tipo_ocorrencia(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_ocorrencia__tipo_assunto_id FOREIGN KEY (id_tipo_assunto)
		REFERENCES tipo_assunto(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_ocorrencia__shark_id_criador FOREIGN KEY (id_shark_criador)
		REFERENCES shark(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_ocorrencia__shark_id_referente FOREIGN KEY (id_shark_referente)
		REFERENCES shark(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE ocorrencia_log (
	id TINYINT AUTO_INCREMENT PRIMARY KEY,
    id_tipo_acao_log TINYINT NOT NULL,
    id_ocorrencia TINYINT NOT NULL,
    id_shark_editor TINYINT NOT NULL,
    data_acao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ocorrencia_log__tipo_acao_log_id FOREIGN KEY (id_tipo_acao_log)
		REFERENCES tipo_acao_log(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_ocorrencia_log__shark_id_editor FOREIGN KEY (id_shark_editor)
		REFERENCES shark(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

/*-- Triggers para alterar o valor da metragem de acordo com a ocorrência --*/
DELIMITER //
CREATE TRIGGER tg_atualiza_metragem_insert
AFTER INSERT
ON ocorrencia
FOR EACH ROW
BEGIN
	DECLARE vIdAdvertencia INT;
    DECLARE vIdGratificacao INT;
    
    -- Salva o id referente ao tipo de ocorrência advertência
    SELECT id INTO vIdAdvertencia FROM tipo_ocorrencia
    WHERE nome like("%adver%");
    
    -- Salva o id referente ao tipo de ocorrência gratificação
	SELECT id INTO vIdGratificacao FROM tipo_ocorrencia
    WHERE nome like("%grat%");

	IF(new.valor_metragem != 0) THEN
		-- Se for advertência subtrai a metragem
		If(new.id_tipo_ocorrencia = vIdAdvertencia) THEN -- Alterar o valor de acordo com id da advertência na tabela tipo_ocorrencia
			UPDATE shark SET metragem = metragem - new.valor_metragem
			WHERE id = new.id_shark_referente;
		ELSEIF (new.id_tipo_ocorrencia = vIdGratificacao) THEN
			UPDATE shark SET metragem = metragem + new.valor_metragem
			WHERE id = new.id_shark_referente;
        END IF;
    END IF;
END//

DELIMITER //
CREATE TRIGGER tg_atualiza_metragem_update
AFTER UPDATE
ON ocorrencia
FOR EACH ROW
BEGIN

	DECLARE vIdAdvertencia INT;
    DECLARE vIdGratificacao INT;
    
    -- Salva o id referente ao tipo de ocorrência advertência
    SELECT id INTO vIdAdvertencia FROM tipo_ocorrencia
    WHERE nome like("%adver%");
    
    -- Salva o id referente ao tipo de ocorrência gratificação
	SELECT id INTO vIdGratificacao FROM tipo_ocorrencia
    WHERE nome like("%grat%");
    
	IF(new.valor_metragem != 0) THEN
		-- Se for advertência subtrai a metragem
		If(new.id_tipo_ocorrencia = vIdAdvertencia) THEN -- Alterar o valor de acordo com id da advertência na tabela tipo_ocorrencia
			UPDATE shark SET metragem = metragem - new.valor_metragem
			WHERE id = new.id_shark_referente;
		ELSEIF (new.id_tipo_ocorrencia = vIdGratificacao) THEN
			UPDATE shark SET metragem = metragem + new.valor_metragem
			WHERE id = new.id_shark_referente;
        END IF;
    END IF;
END//
