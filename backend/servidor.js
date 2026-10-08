// =================================================================
// SERVIDOR.JS - a API (as "rotas")
//
// O navegador não fala direto com o MySQL. Ele faz um pedido (fetch)
// para uma ROTA deste servidor. A rota chama uma função do banco.js,
// que consulta o MySQL, e o servidor devolve a resposta em JSON.
//
//   Front (fetch)  -->  rota (servidor.js)  -->  função (banco.js)  -->  MySQL
//
// Rode com:  npm start    e abra    http://localhost:3000
//
// Cada tipo de pedido (método HTTP) corresponde a um comando SQL:
//   GET = SELECT    POST = INSERT    PUT = UPDATE    DELETE = DELETE
// =================================================================
const path = require('path');
const express = require('express');
const banco = require('./banco');

const app = express();

app.use(express.json());                                      // entende o JSON enviado pelo front
app.use(express.static(path.join(__dirname, 'frontend')));    // entrega a página (pasta frontend)

// Função auxiliar: devolve uma resposta de erro para o front
function responderErro(res, erro) {
  console.error('❌ Erro:', erro.message);
  if (erro.code === 'ER_ROW_IS_REFERENCED_2') {
    // O banco impediu apagar porque outra tabela usa este registro (FOREIGN KEY)
    res.status(400).json({ erro: 'Não dá para apagar: este item está sendo usado em outra tabela.' });
  } else {
    res.status(500).json({ erro: 'Erro no servidor: ' + erro.message });
  }
}

// ---------- ROTA DE TESTE ----------
// Abra http://localhost:3000/api no navegador para ver se a API está no ar
app.get('/api', (req, res) => {
  res.json({
    mensagem: 'API de vendas funcionando!',
    rotas: [
      'GET    /api/categorias',
      'GET    /api/produtos',   'POST   /api/produtos',   'PUT    /api/produtos/:id',  'DELETE /api/produtos/:id',
      'GET    /api/clientes',   'POST   /api/clientes',   'DELETE /api/clientes/:id',
      'GET    /api/enderecos',  'POST   /api/enderecos',  'DELETE /api/enderecos/:id',
      'GET    /api/vendas',     'POST   /api/vendas',     'DELETE /api/vendas/:id'
    ]
  });
});

// ================= CATEGORIAS =================

// GET /api/categorias  ->  lista as categorias
app.get('/api/categorias', async (req, res) => {
  try {
    res.json(await banco.listarCategorias());
  } catch (erro) {
    responderErro(res, erro);
  }
});

// ================= PRODUTOS =================

// GET /api/produtos  ->  lista os produtos
app.get('/api/produtos', async (req, res) => {
  try {
    res.json(await banco.listarProdutos());
  } catch (erro) {
    responderErro(res, erro);
  }
});

// POST /api/produtos  ->  cadastra um produto
// O front envia: { "categoria_id": 1, "nome": "Mouse", "preco": 59.9 }
app.post('/api/produtos', async (req, res) => {
  try {
    const { categoria_id, nome, preco } = req.body;
    if (!categoria_id || !nome || !preco) {
      return res.status(400).json({ erro: 'Preencha nome, preço e categoria.' });
    }
    const id = await banco.cadastrarProduto(categoria_id, nome, preco);
    res.status(201).json({ id });
  } catch (erro) {
    responderErro(res, erro);
  }
});

// PUT /api/produtos/:id  ->  muda o preço do produto
// O ":id" da rota vira req.params.id (ex.: /api/produtos/3 -> id = 3)
app.put('/api/produtos/:id', async (req, res) => {
  try {
    const { preco } = req.body;
    if (!preco) return res.status(400).json({ erro: 'Informe o novo preço.' });
    await banco.atualizarPreco(req.params.id, preco);
    res.json({ ok: true });
  } catch (erro) {
    responderErro(res, erro);
  }
});

// DELETE /api/produtos/:id  ->  apaga o produto
app.delete('/api/produtos/:id', async (req, res) => {
  try {
    await banco.apagarProduto(req.params.id);
    res.json({ ok: true });
  } catch (erro) {
    responderErro(res, erro);
  }
});

// ================= CLIENTES =================

// GET /api/clientes  ->  lista os clientes
app.get('/api/clientes', async (req, res) => {
  try {
    res.json(await banco.listarClientes());
  } catch (erro) {
    responderErro(res, erro);
  }
});

// POST /api/clientes  ->  cadastra um cliente
// O front envia: { "nome": "Maria", "email": "maria@email.com" }
app.post('/api/clientes', async (req, res) => {
  try {
    const { nome, email } = req.body;
    if (!nome) return res.status(400).json({ erro: 'Informe o nome do cliente.' });
    const id = await banco.cadastrarCliente(nome, email || null);
    res.status(201).json({ id });
  } catch (erro) {
    responderErro(res, erro);
  }
});

// DELETE /api/clientes/:id  ->  apaga o cliente
app.delete('/api/clientes/:id', async (req, res) => {
  try {
    await banco.apagarCliente(req.params.id);
    res.json({ ok: true });
  } catch (erro) {
    responderErro(res, erro);
  }
});

// ================= ENDEREÇOS =================

// GET /api/enderecos  ->  lista os endereços
app.get('/api/enderecos', async (req, res) => {
  try {
    res.json(await banco.listarEnderecos());
  } catch (erro) {
    responderErro(res, erro);
  }
});

// POST /api/enderecos  ->  cadastra um endereço
// O front envia: { "cliente_id": 1, "rua": "Rua A", "numero": "10", "cidade": "Paranaguá" }
app.post('/api/enderecos', async (req, res) => {
  try {
    const { cliente_id, rua, numero, cidade } = req.body;
    if (!cliente_id || !rua || !cidade) {
      return res.status(400).json({ erro: 'Escolha o cliente e preencha rua e cidade.' });
    }
    const id = await banco.cadastrarEndereco(cliente_id, rua, numero || null, cidade);
    res.status(201).json({ id });
  } catch (erro) {
    responderErro(res, erro);
  }
});

// DELETE /api/enderecos/:id  ->  apaga o endereço
app.delete('/api/enderecos/:id', async (req, res) => {
  try {
    await banco.apagarEndereco(req.params.id);
    res.json({ ok: true });
  } catch (erro) {
    responderErro(res, erro);
  }
});

// ================= VENDAS =================

// GET /api/vendas  ->  lista as vendas (com cliente, produto e total)
app.get('/api/vendas', async (req, res) => {
  try {
    res.json(await banco.listarVendas());
  } catch (erro) {
    responderErro(res, erro);
  }
});

// POST /api/vendas  ->  registra uma venda
// O front envia: { "cliente_id": 1, "produto_id": 2, "quantidade": 3 }
app.post('/api/vendas', async (req, res) => {
  try {
    const { cliente_id, produto_id, quantidade } = req.body;
    if (!cliente_id || !produto_id || !quantidade) {
      return res.status(400).json({ erro: 'Escolha o cliente, o produto e a quantidade.' });
    }
    const id = await banco.cadastrarVenda(cliente_id, produto_id, quantidade);
    res.status(201).json({ id });
  } catch (erro) {
    responderErro(res, erro);
  }
});

// DELETE /api/vendas/:id  ->  apaga a venda
app.delete('/api/vendas/:id', async (req, res) => {
  try {
    await banco.apagarVenda(req.params.id);
    res.json({ ok: true });
  } catch (erro) {
    responderErro(res, erro);
  }
});

// ---------- Liga o servidor ----------
const PORTA = 3000;
app.listen(PORTA, () => {
  console.log(`✅ Servidor rodando! Abra no navegador: http://localhost:${PORTA}`);
  console.log(`   Teste a API em:                      http://localhost:${PORTA}/api`);
});
