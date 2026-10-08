// Testa as funções do banco.js direto no terminal, sem página e sem servidor.
// Rode com:  npm run teste
const banco = require('./banco');

async function executar() {
  try {
    console.log('\n--- LISTA DE PRODUTOS ---');
    console.table(await banco.listarProdutos());

    const id = await banco.cadastrarCliente('Mariana Costa', 'mariana@email.com');
    console.log(`\n✅ Cliente cadastrado! Novo ID: ${id}`);

    await banco.atualizarPreco(1, 59.90);
    console.log('\n✅ Preço do produto 1 alterado para R$ 59.90');

    await banco.apagarCliente(id);
    console.log(`\n✅ Cliente ${id} apagado com sucesso!`);

    console.log('\n--- FIM DOS TESTES ---');
  } catch (erro) {
    console.error('❌ Ops, algo deu errado:', erro.message);
  }
}

executar();
