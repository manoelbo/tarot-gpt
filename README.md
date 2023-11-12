
# Zoltar Tarot IA

## 1. Clonar o Projeto do GitHub

Para baixar o projeto do GitHub:

```bash
git clone https://github.com/manoelbo/tarot-gpt.git
```


## 2. Instalar Pacotes e Rodar o Projeto

Após clonar o repositório, instale os pacotes necessários usando o NPM e inicie o projeto:

```bash
npm install
npm start
```

## 3. Adicionar Arquivo `.env`

Crie um arquivo `.env` na raiz do projeto e adicione as variáveis de ambiente necessárias:

```bash
touch .env
```

Adicione as variáveis no formato `CHAVE=valor`. Por exemplo:

```
META_TOKEN="XXXXXXX"
NODE_ENV="development"
```

## 4. Criar uma Nova Branch e Enviar para o GitHub

Para criar uma nova branch e começar a trabalhar em uma nova funcionalidade:

```bash
git checkout -b [nome_da_branch]
```

Após fazer as alterações, envie-as para o GitHub:

```bash
git add .
git commit -m "Descrição das alterações"
git push origin [nome_da_branch]
```

Substitua `[nome_da_branch]` pelo nome que deseja dar à sua branch.

## 5. Deploy no Heroku

Para fazer deploy no Heroku, primeiro, certifique-se de ter a CLI do Heroku instalada e estar logado na sua conta. Então:

```bash
heroku create
git push heroku master
```


