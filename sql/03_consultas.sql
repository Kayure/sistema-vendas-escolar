-- ============================================
-- PASSO 3: consultas (SELECT) para treinar
-- Abra no MySQL e rode uma de cada vez.
-- ============================================
USE vendas_escola;

-- 1) Listar todos os produtos
SELECT * FROM produtos;

-- 2) Listar produtos com o nome da categoria
--    JOIN junta duas tabelas usando a ligação entre elas
SELECT produtos.nome AS produto, categorias.nome AS categoria, produtos.preco
FROM produtos
JOIN categorias ON categorias.id = produtos.categoria_id;

-- 3) Listar os endereços de cada cliente
SELECT clientes.nome, enderecos.rua, enderecos.numero, enderecos.cidade
FROM clientes
JOIN enderecos ON enderecos.cliente_id = clientes.id;

-- 4) Listar vendas com o nome do cliente e do produto
SELECT vendas.id, clientes.nome AS cliente, produtos.nome AS produto,
       vendas.quantidade, vendas.data_venda
FROM vendas
JOIN clientes ON clientes.id = vendas.cliente_id
JOIN produtos ON produtos.id = vendas.produto_id;

-- 5) Total de cada venda = preço x quantidade
SELECT vendas.id, produtos.nome AS produto,
       produtos.preco * vendas.quantidade AS total
FROM vendas
JOIN produtos ON produtos.id = vendas.produto_id;
