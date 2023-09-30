## Exportação dos dados no heroku postgresq

- **Passo 1**: Acesse a página do banco de dados
- **Passo 2**: Acesse a categoria "Durability" e clique em "Create Manual Backup"
- **Passo 3**: Basta fazer download do arquivo

## Importação dos dados no banco de dados postgresql no heroku

- **Passo 1**: Realize o comando "heroku login" no prompt de comando, para acessar a heroku.
- **Passo 2**: Execute o comando abaixo:

pg_restore --verbose --clean --no-acl --no-owner -h `<host>` -U `<user>` -d `<banco_de_dados>` `<o_arquivo_de_backup>`

### Todos os dados abaixo, com excessão do <o_arquivo_de_backup>, estão em "Settings" > "Database Credentials", basta clicar em "View Credentials...". 
`<host>`: o host do banco de dados do heroku. 
`<user>`: o nome do usuário do banco de dados com permissões para realizar a importação.
`<banco_de_dados>`: o nome do banco de dados para onde você deseja importar os dados.
`<o_arquivo_de_backup>`: o caminho e nome do arquivo de backup que deseja importar, lembrando que se estiver no mesmo path basta apenas o nome do arquivo.

Um exemplo de como ficaria o comando: 
pg_restore --verbose --clean --no-acl --no-owner -h ec2-1-234-154-63.compute-1.amazonaws.com -U dfyghannhmazrc -d d8aqe2glakhl5q 5856ec89-075c-4537-a3ef-802973a2489d 

- **Passo 3**: Após a execução do 2º comando, a heroku irá exigir a senha daquele usuário inserido `<user>`. Esta senha também está nas credentials.



