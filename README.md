

# 🛒 Projeto Vendas

Sistema de vendas simples para aprender **MySQL**, **API em Node.js** e como uma
**página web conversa com a API**.

```
Página (frontend/)  ──fetch──►  API (servidor.js)  ──►  banco.js  ──►  MySQL
```

O navegador não fala direto com o MySQL: ele pede para a API, e a API consulta o banco.

## Pastas e arquivos

```
projeto-vendas/
├── banco.js         <- funções SQL (aqui você coloca a senha)
├── servidor.js      <- a API (rotas)
├── criar_banco.js   <- cria o banco e as tabelas
├── teste.js         <- testa o banco no terminal
├── sql/             <- scripts SQL
└── frontend/        <- a página (index.html, estilo.css, script.js)
```

## O que instalar

- [Node.js](https://nodejs.org) (versão 18 ou mais nova)
- MySQL Server
- [Git](https://git-scm.com)

## Passo a passo

**1. Baixe o projeto e entre na pasta** (troque pelo endereço do repositório):

```bash
git clone https://github.com/SEU-USUARIO/projeto-vendas.git
cd projeto-vendas
```

⚠️ Rode todos os próximos comandos **dentro da pasta `projeto-vendas`**.

**2. Instale as bibliotecas** (só uma vez):

```bash
npm install
```

**3. Coloque a senha do seu MySQL.** Abra o `banco.js` e troque:

```js
password: 'SuaSenhaAqui',
```

> 🔒 Não envie sua senha real para o GitHub. Volte para `'SuaSenhaAqui'` antes do `git push`.

**4. Crie o banco de dados** (só uma vez):

```bash
npm run criar-banco
```

**5. Ligue o servidor** (deixe o terminal aberto):

```bash
npm start
```

**6. Abra no navegador:** 👉 **http://localhost:3000**

Para desligar, aperte `Ctrl + C` no terminal. Da próxima vez, só repita os passos **1 (cd)** e **5**.

⚠️ Não abra o `index.html` dando dois cliques. Use sempre o endereço acima.

## Ver a API funcionando

Com o servidor ligado, abra no navegador:

- http://localhost:3000/api — lista todas as rotas
- http://localhost:3000/api/produtos — os produtos em JSON (é isso que a página recebe!)

Cada tipo de pedido corresponde a um comando SQL:

| Método   | SQL    | Para quê  |
|----------|--------|-----------|
| `GET`    | SELECT | buscar    |
| `POST`   | INSERT | cadastrar |
| `PUT`    | UPDATE | atualizar |
| `DELETE` | DELETE | apagar    |

## Problemas comuns

| Mensagem | Solução |
|----------|---------|
| `npm não é reconhecido` | Instale o Node.js e reabra o terminal |
| `Cannot find module 'express'` | Rode `npm install` dentro da pasta do projeto |
| `Access denied for user 'root'` | Confira a senha no `banco.js` |
| `ECONNREFUSED` | O MySQL está desligado: inicie o serviço do MySQL |
| `Unknown database 'vendas_escola'` | Rode `npm run criar-banco` |
| `EADDRINUSE ... 3000` | Já há um servidor ligado: feche o outro terminal |
| Tabelas vazias na página | Rode `npm start` e acesse `http://localhost:3000` |

## Exercícios

1. Cadastre um produto pela página e depois abra `http://localhost:3000/api/produtos`. O que mudou?
2. Aperte **F12 → Rede**, cadastre um cliente e veja qual rota e qual método a página usou.
3. Em `frontend/estilo.css`, troque a cor de `--cor-principal` e aperte `F5`.

# 🛒 Projeto Vendas — Node.js + MySQL + API + HTML/CSS/JS

Um sistema de vendas bem simples para aprender **banco de dados** e **como uma
página web conversa com uma API**.

Você vai criar o banco no MySQL, ligar uma API em Node.js e usar uma página web
para cadastrar produtos, clientes, endereços e vendas.

## Como tudo se conecta

```
 FRONT-END                    API (servidor)                 BANCO
 frontend/script.js           servidor.js        banco.js
 ┌──────────────┐  fetch()   ┌───────────┐  chama  ┌──────────┐  SQL  ┌───────┐
 │  Página web  │ ─────────► │   ROTAS   │ ──────► │ funções  │ ────► │ MySQL │
 │ HTML/CSS/JS  │ ◄───────── │ /api/...  │ ◄────── │ SELECT.. │ ◄──── │       │
 └──────────────┘    JSON    └───────────┘ dados   └──────────┘       └───────┘
```

1. A página (front-end) faz um **pedido** (`fetch`) para uma **rota** da API.
2. A rota (em `servidor.js`) chama uma **função** do `banco.js`.
3. A função executa o comando **SQL** no MySQL.
4. O resultado volta em **JSON** e a página mostra na tela.

> O navegador **não** fala direto com o MySQL. Por isso existe a API no meio.

## O banco de dados

| Tabela       | O que guarda                          |
|--------------|---------------------------------------|
| `categorias` | tipos de produto (Informática, ...)   |
| `clientes`   | nome e e-mail de quem compra          |
| `enderecos`  | endereços dos clientes (pode ter 2+)  |
| `produtos`   | nome, preço e categoria               |
| `vendas`     | quem comprou, o quê, quantas, quando  |

## As rotas da API

Cada rota usa um **método HTTP**, que corresponde a um comando SQL:

| Método   | Comando SQL | Para quê          |
|----------|-------------|-------------------|
| `GET`    | SELECT      | buscar dados      |
| `POST`   | INSERT      | cadastrar         |
| `PUT`    | UPDATE      | atualizar         |
| `DELETE` | DELETE      | apagar            |

| Rota                     | Método   | O que faz                      | Dados enviados (JSON)                          |
|--------------------------|----------|--------------------------------|------------------------------------------------|
| `/api`                   | `GET`    | testa se a API está no ar      | —                                              |
| `/api/categorias`        | `GET`    | lista as categorias            | —                                              |
| `/api/produtos`          | `GET`    | lista os produtos              | —                                              |
| `/api/produtos`          | `POST`   | cadastra um produto            | `categoria_id`, `nome`, `preco`                |
| `/api/produtos/:id`      | `PUT`    | muda o preço de um produto     | `preco`                                        |
| `/api/produtos/:id`      | `DELETE` | apaga um produto               | —                                              |
| `/api/clientes`          | `GET`    | lista os clientes              | —                                              |
| `/api/clientes`          | `POST`   | cadastra um cliente            | `nome`, `email`                                |
| `/api/clientes/:id`      | `DELETE` | apaga um cliente               | —                                              |
| `/api/enderecos`         | `GET`    | lista os endereços             | —                                              |
| `/api/enderecos`         | `POST`   | cadastra um endereço           | `cliente_id`, `rua`, `numero`, `cidade`        |
| `/api/enderecos/:id`     | `DELETE` | apaga um endereço              | —                                              |
| `/api/vendas`            | `GET`    | lista as vendas (com total)    | —                                              |
| `/api/vendas`            | `POST`   | registra uma venda             | `cliente_id`, `produto_id`, `quantidade`       |
| `/api/vendas/:id`        | `DELETE` | apaga uma venda                | —                                              |

O `:id` é o número do item. Exemplo: `DELETE /api/produtos/3` apaga o produto de id 3.

## Estrutura das pastas

```
projeto-vendas/
├── README.md            <- este tutorial
├── package.json         <- lista das bibliotecas e dos comandos (npm)
├── banco.js             <- funções SQL (SELECT/INSERT/UPDATE/DELETE) — AQUI você coloca a senha
├── servidor.js          <- a API: define as rotas e chama o banco.js
├── criar_banco.js       <- cria o banco e as tabelas
├── teste.js             <- testa o banco.js direto no terminal
├── sql/
│   ├── 01_criar_tabelas.sql
│   ├── 02_inserir_dados.sql
│   └── 03_consultas.sql <- consultas para treinar no MySQL
└── frontend/            <- a página web
    ├── index.html       <- estrutura da página (HTML)
    ├── estilo.css       <- aparência (CSS)
    └── script.js        <- chama a API com fetch (JavaScript)
```

## ✅ O que instalar antes

| Programa | Para quê | Onde baixar |
|----------|----------|-------------|
| **Node.js** (versão 18 ou mais nova) | rodar o JavaScript fora do navegador | https://nodejs.org |
| **MySQL Server** | guardar os dados | https://dev.mysql.com/downloads/mysql/ |
| **Git** | baixar o projeto do GitHub | https://git-scm.com |

Para conferir se deu certo, abra o terminal e digite cada comando:

```bash
node -v
npm -v
git --version
mysql --version
```

Cada um deve mostrar um número de versão. Se aparecer "não é reconhecido",
feche e abra o terminal de novo. Se continuar, o programa não foi instalado direito.

> **Como abrir o terminal?**
> Windows: tecle `Windows`, digite `cmd` ou `PowerShell` e aperte Enter.
> Mac: abra o app *Terminal*. Linux: `Ctrl + Alt + T`.
> Dica: no VS Code, use o menu *Terminal → Novo Terminal*.
