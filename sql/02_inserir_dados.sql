-- ============================================
-- PASSO 2: colocar dados de exemplo nas tabelas
-- ============================================
USE vendas_escola;

-- 3 categorias (os ids serão 1, 2 e 3)
INSERT INTO categorias (nome) VALUES
  ('Informática'),
  ('Roupas'),
  ('Livros');

-- 4 clientes (ids 1 a 4)
INSERT INTO clientes (nome, email) VALUES
  ('Ana Souza',    'ana@email.com'),
  ('Bruno Lima',   'bruno@email.com'),
  ('Carla Mendes', 'carla@email.com'),
  ('Diego Rocha',  'diego@email.com');

-- 5 endereços (a Ana tem 2 endereços)
INSERT INTO enderecos (cliente_id, rua, numero, cidade) VALUES
  (1, 'Rua das Flores',  '100', 'Paranaguá'),
  (1, 'Rua do Porto',    '45',  'Paranaguá'),
  (2, 'Av. Brasil',      '800', 'Curitiba'),
  (3, 'Rua XV',          '12',  'Curitiba'),
  (4, 'Rua das Palmeiras','33', 'Pontal do Paraná');

-- 6 produtos (categoria_id diz a qual categoria pertence)
INSERT INTO produtos (categoria_id, nome, preco) VALUES
  (1, 'Mouse',           59.90),
  (1, 'Teclado',        120.00),
  (2, 'Camiseta',        39.90),
  (2, 'Boné',            25.00),
  (3, 'Livro de Python', 80.00),
  (3, 'Livro de SQL',    70.00);

-- 5 vendas (quem comprou, o que comprou, quantas unidades e quando)
INSERT INTO vendas (cliente_id, produto_id, quantidade, data_venda) VALUES
  (1, 1, 2, '2026-10-01'),
  (2, 3, 3, '2026-10-02'),
  (3, 5, 1, '2026-10-03'),
  (1, 6, 1, '2026-10-04'),
  (4, 2, 1, '2026-10-05');
