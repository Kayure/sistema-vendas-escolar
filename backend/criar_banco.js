// Este arquivo lê os arquivos .sql e executa no MySQL.
// Rode UMA vez com:  npm run criar-banco
const fs = require('fs');
const path = require('path');
const { criarConexao } = require('./banco');

async function criar() {
  try {
    const conexao = await criarConexao(true); // true = o banco ainda não existe

    // Lê o texto de cada arquivo .sql e manda o MySQL executar
    const tabelas = fs.readFileSync(path.join(__dirname, 'sql', '01_criar_tabelas.sql'), 'utf8');
    await conexao.query(tabelas);
    console.log('✅ Tabelas criadas!');

    const dados = fs.readFileSync(path.join(__dirname, 'sql', '02_inserir_dados.sql'), 'utf8');
    await conexao.query(dados);
    console.log('✅ Dados de exemplo inseridos!');

    await conexao.end(); // fecha a conexão
  } catch (erro) {
    console.error('❌ Ops, algo deu errado:', erro.message);
  }
}

criar();
