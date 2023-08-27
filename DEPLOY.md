# O deploy foi inicialmente pensado para a heroku
## Deploy do app 

- **Passo 1**: subir a aplicação no github
- **Passo 2**: criar um novo app no site do heroku e adicionar o nome do app
- **Passo 3**: acessar a aplicação, clicar na aba 'Deploy' e vincular o heroku com o github
- **Passo 4**: escolher o branch e fazer o deploy
- **Passo 5**: acessar a aba de 'Settings' e definir as seguintes variáveis de ambiente:
    - `JWT_SECRET_TOKEN` seguido do código secreto que queremos
    - `JWT_EXPIRES_IN` seguindo do tempo de duração do código JWT (por padrão está definido 1d)
    - `MAILER_HOST` seguido do servidor de e-mail utilizado, no caso do gmail 'smtp.gmail.com'
    - `MAILER_PORT` seguido da porta utilizada pelo servidor, no caso do gmail '465'
    - `MAILER_AUTH_USER ` seguido do e-mail que irá lançar os e-mails, ex: 'example@gmail.com'
    - `MAILER_AUTH_PASS` seguido da senha associada ao e-mail 
    - `URL_FRONT_END` = url do front-end, ex: https://url-frontend.com.br (Sem a barra no final!)
    - `ENABLE_UPLOAD_FILES` = habilita o upload/remoção de arquivos no drive, por default é true 
    - `ID_GOOGLE_FOLDER` = Se a variável ENABLE_UPLOAD_FILES for true, deve ser passado aqui o id da pasta
    do google drive que foi compartilhada. (Normalmente este id está na URL quando se está dentro da pasta)
    (ATENÇÃO: baixar o arquivo .json com as credenciais no site do google API, renomea-lo como 'google_api_credentials.json' e inseri-lo dentro da pasta src/config)

## Deploy do DB

- **Passo 1**: acessar a aba 'Resources' do app
- **Passo 2**: selecionar o banco de dados postgresql, o plano desejado e aguardar o tempo de criação do bd
- **Passo 3**: certfique-se de que o HerokuCLI esteja instalado (https://devcenter.heroku.com/articles/heroku-cli)
- **Passo 4**: realize o login no heroku, digite o comando 'heroku login'
- **Passo 5**: acesse o app através do comando: 'heroku run bash --app nome-do-app-no-heroku'
- **Passo 6**: digitar o comando `npm i dotenv` e depois, `npm i`
- **Passo 7**: Atenção! o comando abaixo para o deploy do banco de dados. Se já houver dados importantes, é necessário fazer um backup.
    - O comando `npm run knex:latest:production`, serve para criar as tabelas no banco
    
**Caso seja necessário remover os dados usar o use o comando a seguir: O comando `knex:rollback:production`, serve para apagar todas as tabelas do banco**
            

O retorno esperado do passo 6 é:
A variável de ambiente DATABASE_URL não foi setada ou é inválida. (se em desenvolvimento ignorar)
Using environment: development
Tabela distancia_residencia criada.
Registros inseridos na tabela distancia_residencia.
Tabela celula criada.
Registros inseridos na tabela celula.
Tabela role criada.
Registros inseridos na tabela role.
Tabela shark criada.
Registro inserido na tabela shark.
Tabela email_pessoal criada.
Tabela tipo_acao_log criada.
Registros inseridos na tabela tipo_acao_log.
Tabela tipo_ocorrencia criada.
Registros inseridos na tabela tipo_ocorrencia.
Tabela tipo_assunto criada.
Registros inseridos na tabela tipo_assunto.
Tabela shark_log criada.
Tabela nivel_advertencia criada.
Registros inseridos na tabela nivel_advertencia.
Tabela nivel_gratificacao criada.
Registros inseridos na tabela nivel_gratificacao.
Tabela ocorrencia criada.
Tabela ocorrencia_log criada.
Função de metragem criada
Trigger de inserção de metragem criada
Trigger de atualização de metragem criada
Trigger de devolução de metragem criada
Tabela upload_file criada.
Batch 1 run: 15 migrations