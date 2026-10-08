// =================================================================
// SCRIPT.JS - a página conversa com a API
//
// Todo pedido ao servidor é feito com fetch() para uma ROTA da API:
//   GET    /api/produtos      -> buscar a lista
//   POST   /api/produtos      -> cadastrar
//   PUT    /api/produtos/3    -> atualizar o produto de id 3
//   DELETE /api/produtos/3    -> apagar o produto de id 3
// =================================================================

// Endereço base da API (como a página é entregue pelo próprio servidor,
// basta começar com "/api")
const API_URL = '/api';

// ================= FUNÇÕES AUXILIARES =================

// Faz um pedido para a API e devolve a resposta já convertida (JSON).
// Exemplos:
//   await chamar('/produtos')                              -> GET
//   await chamar('/produtos', 'POST', { nome: 'Mouse' })   -> POST
async function chamar(caminho, metodo = 'GET', corpo) {
  const resposta = await fetch(API_URL + caminho, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: corpo ? JSON.stringify(corpo) : undefined, // dados enviados (POST/PUT)
  });
  const dados = await resposta.json();
  if (!resposta.ok) throw new Error(dados.erro); // a API avisou que deu erro
  return dados;
}

// Mostra um aviso (verde = sucesso, vermelho = erro) por 4 segundos
function avisar(texto, ehErro = false) {
  const mensagem = document.getElementById('mensagem');
  mensagem.textContent = texto;
  mensagem.className = ehErro ? 'erro' : 'ok';
  setTimeout(() => { mensagem.textContent = ''; }, 4000);
}

// Transforma 59.9 em "R$ 59,90"
function dinheiro(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Deixa o texto seguro antes de colocar na página (evita código malicioso)
function seguro(texto) {
  const div = document.createElement('div');
  div.textContent = texto ?? '';
  return div.innerHTML;
}

// Cria as opções de uma caixa de seleção (<select>)
function preencherSelect(id, lista, textoInicial) {
  const opcoes = lista.map((item) => `<option value="${item.id}">${seguro(item.nome)}</option>`);
  document.getElementById(id).innerHTML =
    `<option value="">${textoInicial}</option>` + opcoes.join('');
}

// ================= CARREGAR DADOS (GET) =================

// GET /api/categorias
async function carregarCategorias() {
  const categorias = await chamar('/categorias');
  preencherSelect('produto-categoria', categorias, 'Escolha a categoria');
}

// GET /api/produtos
async function carregarProdutos() {
  const produtos = await chamar('/produtos');

  // Monta uma linha (<tr>) da tabela para cada produto
  document.getElementById('tabela-produtos').innerHTML = produtos.map((p) => `
    <tr>
      <td>${p.id}</td>
      <td>${seguro(p.nome)}</td>
      <td>${seguro(p.categoria)}</td>
      <td>${dinheiro(p.preco)}</td>
      <td>
        <button onclick="mudarPreco(${p.id})">Mudar preço</button>
        <button class="perigo" onclick="apagarProduto(${p.id})">Apagar</button>
      </td>
    </tr>`).join('');

  // Aproveita a lista para preencher o <select> da aba Vendas
  const lista = produtos.map((p) => ({ id: p.id, nome: `${p.nome} - ${dinheiro(p.preco)}` }));
  preencherSelect('venda-produto', lista, 'Escolha o produto');
}

// GET /api/clientes
async function carregarClientes() {
  const clientes = await chamar('/clientes');

  document.getElementById('tabela-clientes').innerHTML = clientes.map((c) => `
    <tr>
      <td>${c.id}</td>
      <td>${seguro(c.nome)}</td>
      <td>${seguro(c.email)}</td>
      <td><button class="perigo" onclick="apagarCliente(${c.id})">Apagar</button></td>
    </tr>`).join('');

  // Os mesmos clientes aparecem nos <select> de endereço e de venda
  preencherSelect('endereco-cliente', clientes, 'Escolha o cliente');
  preencherSelect('venda-cliente', clientes, 'Escolha o cliente');
}

// GET /api/enderecos
async function carregarEnderecos() {
  const enderecos = await chamar('/enderecos');

  document.getElementById('tabela-enderecos').innerHTML = enderecos.map((e) => `
    <tr>
      <td>${seguro(e.cliente)}</td>
      <td>${seguro(e.rua)}</td>
      <td>${seguro(e.numero)}</td>
      <td>${seguro(e.cidade)}</td>
      <td><button class="perigo" onclick="apagarEndereco(${e.id})">Apagar</button></td>
    </tr>`).join('');
}

// GET /api/vendas
async function carregarVendas() {
  const vendas = await chamar('/vendas');

  document.getElementById('tabela-vendas').innerHTML = vendas.map((v) => `
    <tr>
      <td>${v.id}</td>
      <td>${seguro(v.cliente)}</td>
      <td>${seguro(v.produto)}</td>
      <td>${v.quantidade}</td>
      <td>${dinheiro(v.total)}</td>
      <td>${v.data}</td>
      <td><button class="perigo" onclick="apagarVenda(${v.id})">Apagar</button></td>
    </tr>`).join('');

  // Soma o total de todas as vendas
  const soma = vendas.reduce((acumulado, v) => acumulado + Number(v.total), 0);
  document.getElementById('total-geral').textContent = 'Total vendido: ' + dinheiro(soma);
}

// Recarrega tudo (usado depois de cada mudança)
async function atualizarTudo() {
  try {
    await carregarCategorias();
    await carregarProdutos();
    await carregarClientes();
    await carregarEnderecos();
    await carregarVendas();
  } catch (erro) {
    avisar('Não consegui carregar os dados: ' + erro.message, true);
  }
}

// ================= AÇÕES DOS BOTÕES (PUT e DELETE) =================

// PUT /api/produtos/:id
async function mudarPreco(id) {
  const novo = prompt('Digite o novo preço (ex.: 49.90):');
  if (!novo) return; // clicou em Cancelar
  try {
    await chamar('/produtos/' + id, 'PUT', { preco: novo.replace(',', '.') });
    avisar('Preço atualizado!');
    atualizarTudo();
  } catch (erro) {
    avisar(erro.message, true);
  }
}

// DELETE /api/produtos/:id
async function apagarProduto(id) {
  if (!confirm('Tem certeza que quer apagar este produto?')) return;
  try {
    await chamar('/produtos/' + id, 'DELETE');
    avisar('Produto apagado!');
    atualizarTudo();
  } catch (erro) {
    avisar(erro.message, true);
  }
}

// DELETE /api/clientes/:id
async function apagarCliente(id) {
  if (!confirm('Tem certeza que quer apagar este cliente?')) return;
  try {
    await chamar('/clientes/' + id, 'DELETE');
    avisar('Cliente apagado!');
    atualizarTudo();
  } catch (erro) {
    avisar(erro.message, true);
  }
}

// DELETE /api/enderecos/:id
async function apagarEndereco(id) {
  if (!confirm('Tem certeza que quer apagar este endereço?')) return;
  try {
    await chamar('/enderecos/' + id, 'DELETE');
    avisar('Endereço apagado!');
    atualizarTudo();
  } catch (erro) {
    avisar(erro.message, true);
  }
}

// DELETE /api/vendas/:id
async function apagarVenda(id) {
  if (!confirm('Tem certeza que quer apagar esta venda?')) return;
  try {
    await chamar('/vendas/' + id, 'DELETE');
    avisar('Venda apagada!');
    atualizarTudo();
  } catch (erro) {
    avisar(erro.message, true);
  }
}

// ================= FORMULÁRIOS (POST) =================

// POST /api/produtos
document.getElementById('form-produto').addEventListener('submit', async (evento) => {
  evento.preventDefault(); // impede a página de recarregar
  try {
    await chamar('/produtos', 'POST', {
      nome: document.getElementById('produto-nome').value,
      preco: document.getElementById('produto-preco').value,
      categoria_id: document.getElementById('produto-categoria').value,
    });
    evento.target.reset(); // limpa o formulário
    avisar('Produto cadastrado!');
    atualizarTudo();
  } catch (erro) {
    avisar(erro.message, true);
  }
});

// POST /api/clientes
document.getElementById('form-cliente').addEventListener('submit', async (evento) => {
  evento.preventDefault();
  try {
    await chamar('/clientes', 'POST', {
      nome: document.getElementById('cliente-nome').value,
      email: document.getElementById('cliente-email').value,
    });
    evento.target.reset();
    avisar('Cliente cadastrado!');
    atualizarTudo();
  } catch (erro) {
    avisar(erro.message, true);
  }
});

// POST /api/enderecos
document.getElementById('form-endereco').addEventListener('submit', async (evento) => {
  evento.preventDefault();
  try {
    await chamar('/enderecos', 'POST', {
      cliente_id: document.getElementById('endereco-cliente').value,
      rua: document.getElementById('endereco-rua').value,
      numero: document.getElementById('endereco-numero').value,
      cidade: document.getElementById('endereco-cidade').value,
    });
    evento.target.reset();
    avisar('Endereço cadastrado!');
    atualizarTudo();
  } catch (erro) {
    avisar(erro.message, true);
  }
});

// POST /api/vendas
document.getElementById('form-venda').addEventListener('submit', async (evento) => {
  evento.preventDefault();
  try {
    await chamar('/vendas', 'POST', {
      cliente_id: document.getElementById('venda-cliente').value,
      produto_id: document.getElementById('venda-produto').value,
      quantidade: document.getElementById('venda-quantidade').value,
    });
    evento.target.reset();
    avisar('Venda registrada!');
    atualizarTudo();
  } catch (erro) {
    avisar(erro.message, true);
  }
});

// ================= MENU (ABAS) =================

document.querySelectorAll('nav button').forEach((botao) => {
  botao.addEventListener('click', () => {
    // Esconde todas as abas e tira o destaque de todos os botões
    document.querySelectorAll('.aba').forEach((aba) => aba.classList.add('escondida'));
    document.querySelectorAll('nav button').forEach((b) => b.classList.remove('ativa'));
    // Mostra só a aba clicada
    document.getElementById('aba-' + botao.dataset.aba).classList.remove('escondida');
    botao.classList.add('ativa');
  });
});

// ================= COMEÇO =================
atualizarTudo(); // assim que a página abre, busca os dados na API
