
CREATE TABLE servico (
	id SERIAL PRIMARY KEY,
	nome VARCHAR(300) NOT NULL
);

INSERT INTO servico (nome) VALUES ('Estudo de Viabilidade Técnico Econômica');
INSERT INTO servico (nome) VALUES ('Mapeamento e Otimização de Processos');
INSERT INTO servico (nome) VALUES ('Pesquisa de Clima Organizacional');
INSERT INTO servico (nome) VALUES ('Pesquisa de Mercado');
INSERT INTO servico (nome) VALUES ('Pesquisa de Satisfação');
INSERT INTO servico (nome) VALUES ('Planejamento Estratégico');
INSERT INTO servico (nome) VALUES ('Planejamento Financeiro');
INSERT INTO servico (nome) VALUES ('Clima Organizacional');
INSERT INTO servico (nome) VALUES ('Plano de Negócios');
INSERT INTO servico (nome) VALUES ('Plano de Marketing');
INSERT INTO servico (nome) VALUES ('Precificação');
INSERT INTO servico (nome) VALUES ('Recrutamento e Seleção');
INSERT INTO servico (nome) VALUES ('Análise de Mercado');
INSERT INTO servico (nome) VALUES ('Pesquisa de Marketing');

CREATE TABLE tipo_preco (
	id SERIAL PRIMARY KEY,
	nome VARCHAR(100) NOT NULL
);

INSERT INTO tipo_preco (nome) VALUES 
	('preço piso'),
	('preço médio'),
	('preço teto');
	
CREATE TABLE porte_cliente (
	id SERIAL PRIMARY KEY,
	tipo VARCHAR(60) NOT NULL,
	desconto FLOAT NOT NULL
);

INSERT INTO porte_cliente (tipo, desconto) VALUES 
	('empreendedor', 0),
	('micro empresa', 0.05),
	('pequeno porte', 0.1),
	('médio porte', 0.3),
	('grande porte', 0.4);

CREATE TABLE cliente (
	id SERIAL PRIMARY KEY,
	nome VARCHAR(300) NOT NULL,
	nome_empresa VARCHAR(500) NOT NULL,
	tipo_cliente VARCHAR(300) NOT NULL,
	idade SMALLINT,
	negociador VARCHAR(300) NOT NULL,
	estado VARCHAR(150) NOT NULL,
	cidade VARCHAR(150) NOT NULL,
	sexo VARCHAR(100),
	id_porte_cliente SMALLINT NOT NULL,
	data_criacao TIMESTAMP NOT NULL DEFAULT NOW(),
	CONSTRAINT fk_precificacao__id_porte_cliente FOREIGN KEY (id_porte_cliente)
		REFERENCES porte_cliente(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE custo (
	id SERIAL PRIMARY KEY,
	nome VARCHAR(300) NOT NULL,
	mes_inicio VARCHAR(100) NOT NULL, 
	quantidade SMALLINT NOT NULL, 
	preco FLOAT NOT NULL,
	numero_dias SMALLINT,
	valido BOOLEAN,
	justificativa VARCHAR(1200) -- É preenchido pelo adm fin quando recusar
	id_total_custo SMALLINT NOT NULL,
	CONSTRAINT fk_custo__id_total_custo FOREIGN KEY (id_total_custo)
		REFERENCES total_custo(id) ON DELETE RESTRICT ON UPDATE RESTRICT
);

CREATE TABLE total_custo (
	id SERIAL PRIMARY KEY,
	valido BOOLEAN,
	justificativa VARCHAR(1200), -- É preenchido pelo adm fin quando recusar
	resultado FLOAT NOT NULL,
	data_criacao TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE custo_variavel (
	id SERIAL PRIMARY KEY,
	nome VARCHAR(300),
	mes_inicio VARCHAR(100), 
	quantidade SMALLINT NOT NULL, 
	preco FLOAT NOT NULL,
	numero_dias SMALLINT NOT NULL,
	resultado FLOAT NOT NULL,
	data_criacao TIMESTAMP NOT NULL DEFAULT NOW(),
);
	
CREATE TABLE precificacao (
	id SERIAL PRIMARY KEY,
	composta BOOLEAN NOT NULL DEFAULT FALSE,
	id_servico SMALLINT NOT NULL,
	id_servico_composto SMALLINT, -- Se composta true, então deve ser passado outro serviço
	id_cliente SMALLINT NOT NULL,
	tipo_negocio VARCHAR(300) NOT NULL,
	margem_incerteza FLOAT NOT NULL,
	qtd_membros SMALLINT NOT NULL,
	custo_variavel FLOAT NOT NULL,
	modalidade VARCHAR(300) NOT NULL,
	id_tipo_preco SMALLINT NOT NULL,
	modalidade VARCHAR(300) NOT NULL,
	-- Observar estes itens abaixo:
	entrada FLOAT NOT NULL,
	parcelado SMALLINT NOT NULL,
	valor_parcelas FLOAT NOT NULL,
	valor_a_vista FLOAT NOT NULL,
	data_criacao TIMESTAMP NOT NULL DEFAULT NOW(),
	CONSTRAINT fk_precificacao__id_servico FOREIGN KEY (id_servico)
		REFERENCES servico(id) ON DELETE RESTRICT ON UPDATE CASCADE,
	CONSTRAINT fk_precificacao__id_servico_composto FOREIGN KEY (id_servico_composto)
		REFERENCES servico(id) ON DELETE RESTRICT ON UPDATE CASCADE,
	CONSTRAINT fk_precificacao__id_cliente FOREIGN KEY (id_cliente)
		REFERENCES cliente(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_precificacao__id_tipo_preco FOREIGN KEY (id_tipo_preco)
		REFERENCES tipo_preco(id) ON DELETE RESTRICT ON UPDATE CASCADE
);