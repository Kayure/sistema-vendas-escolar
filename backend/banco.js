// =================================================================
// BANCO.JS - conversa com o MySQL
// Aqui ficam as funções que fazem SELECT, INSERT, UPDATE e DELETE.
// Quem chama essas funções é o servidor.js (nas rotas) ou o teste.js.
// =================================================================

// Importamos a biblioteca do MySQL
const mysql = require('mysql2/promise');

// =================================================================
// CONEXÃO: Troque a senha abaixo pela senha do seu MySQL no computador
// =================================================================
async function criarConexao(paraCriarBanco = false) {
  return await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'SuaSenhaAqui', // <-- COLOQUE SUA SENHA AQUI
    // Ao criar o banco ele ainda não existe, então entramos sem escolher um
    database: paraCriarBanco ? undefined : 'vendas_escola',
    // Só deixamos rodar vários comandos juntos quando estamos criando o banco
    multipleStatements: paraCriarBanco
  });
}

// Função auxiliar: abre a conexão, executa o comando SQL e fecha a conexão.
// Os pontos de interrogação (?) são trocados pelos valores da lista "valores".
async function executar(sql, valores = []) {
  const conexao = await criarConexao();
  try {
    const [resultado] = await conexao.query(sql, valores);
    return resultado;
  } finally {
    await conexao.end(); // fecha a conexão mesmo se der erro
  }
}

// ======================= CATEGORIAS =======================

// SELECT: lista as categorias
async function listarCategorias() {
  return await executar('SELECT * FROM categorias ORDER BY nome');
}

// ======================= PRODUTOS =======================

// SELECT: lista os produtos e suas categorias
async function listarProdutos() {
  return await executar(`
    SELECT p.id, p.nome, p.preco, c.nome AS categoria
    FROM produtos p
    JOIN categorias c ON p.categoria_id = c.id
    ORDER BY p.id
  `);
}

// INSERT: cadastra um novo produto e devolve o id criado
async function cadastrarProduto(categoriaId, nome, preco) {
  const resultado = await executar(
    'INSERT INTO produtos (categoria_id, nome, preco) VALUES (?, ?, ?)',
    [categoriaId, nome, preco]
  );
  return resultado.insertId;
}

// UPDATE: muda o preço de um produto
async function atualizarPreco(idProduto, novoPreco) {
  await executar('UPDATE produtos SET preco = ? WHERE id = ?', [novoPreco, idProduto]);
}

// DELETE: apaga um produto pelo id
async function apagarProduto(idProduto) {
  await executar('DELETE FROM produtos WHERE id = ?', [idProduto]);
}

// ======================= CLIENTES =======================

// SELECT: lista os clientes
async function listarClientes() {
  return await executar('SELECT * FROM clientes ORDER BY id');
}

// INSERT: cadastra um novo cliente e devolve o id criado
async function cadastrarCliente(nome, email) {
  const resultado = await executar(
    'INSERT INTO clientes (nome, email) VALUES (?, ?)',
    [nome, email]
  );
  return resultado.insertId;
}

// DELETE: apaga um cliente pelo id
async function apagarCliente(idCliente) {
  await executar('DELETE FROM clientes WHERE id = ?', [idCliente]);
}

// ======================= ENDEREÇOS =======================

// SELECT: lista os endereços com o nome do dono
async function listarEnderecos() {
  return await executar(`
    SELECT e.id, c.nome AS cliente, e.rua, e.numero, e.cidade
    FROM enderecos e
    JOIN clientes c ON e.cliente_id = c.id
    ORDER BY e.id
  `);
}

// INSERT: cadastra um endereço para um cliente
async function cadastrarEndereco(clienteId, rua, numero, cidade) {
  const resultado = await executar(
    'INSERT INTO enderecos (cliente_id, rua, numero, cidade) VALUES (?, ?, ?, ?)',
    [clienteId, rua, numero, cidade]
  );
  return resultado.insertId;
}

// DELETE: apaga um endereço pelo id
async function apagarEndereco(idEndereco) {
  await executar('DELETE FROM enderecos WHERE id = ?', [idEndereco]);
}

// ======================= VENDAS =======================

// SELECT: lista as vendas com cliente, produto e total (preço x quantidade)
async function listarVendas() {
  return await executar(`
    SELECT v.id, c.nome AS cliente, p.nome AS produto, v.quantidade,
           p.preco * v.quantidade AS total,
           DATE_FORMAT(v.data_venda, '%d/%m/%Y') AS data
    FROM vendas v
    JOIN clientes c ON v.cliente_id = c.id
    JOIN produtos p ON v.produto_id = p.id
    ORDER BY v.id DESC
  `);
}

// INSERT: registra uma venda (a data é a de hoje: CURDATE())
async function cadastrarVenda(clienteId, produtoId, quantidade) {
  const resultado = await executar(
    'INSERT INTO vendas (cliente_id, produto_id, quantidade, data_venda) VALUES (?, ?, ?, CURDATE())',
    [clienteId, produtoId, quantidade]
  );
  return resultado.insertId;
}

// DELETE: apaga uma venda pelo id
async function apagarVenda(idVenda) {
  await executar('DELETE FROM vendas WHERE id = ?', [idVenda]);
}

// Deixa as funções disponíveis para os outros arquivos usarem
module.exports = {
  criarConexao,
  listarCategorias,
  listarProdutos, cadastrarProduto, atualizarPreco, apagarProduto,
  listarClientes, cadastrarCliente, apagarCliente,
  listarEnderecos, cadastrarEndereco, apagarEndereco,
  listarVendas, cadastrarVenda, apagarVenda
};
