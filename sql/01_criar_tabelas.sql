-- ============================================
-- PASSO 1: criar o banco de dados e as tabelas
-- ============================================

-- Apaga o banco antigo (se existir) para começar do zero
DROP DATABASE IF EXISTS vendas_escola;

-- Cria o banco de dados e começa a usá-lo
CREATE DATABASE vendas_escola CHARACTER SET utf8mb4;
USE vendas_escola;

-- Tabela de categorias (ex.: Informática, Roupas...)
CREATE TABLE categorias (
  id   INT AUTO_INCREMENT PRIMARY KEY,  -- número único de cada categoria
  nome VARCHAR(50) NOT NULL             -- NOT NULL = não pode ficar vazio
);

-- Tabela de clientes
CREATE TABLE clientes (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  nome  VARCHAR(100) NOT NULL,
  email VARCHAR(100)
);

-- Tabela de endereços: um cliente pode ter vários
CREATE TABLE enderecos (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  rua        VARCHAR(100) NOT NULL,
  numero     VARCHAR(10),
  cidade     VARCHAR(60) NOT NULL,
  -- FOREIGN KEY liga este endereço a um cliente que existe
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

-- Tabela de produtos: cada produto pertence a uma categoria
CREATE TABLE produtos (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  categoria_id INT NOT NULL,
  nome         VARCHAR(100) NOT NULL,
  preco        DECIMAL(10,2) NOT NULL,  -- número com 2 casas (ex.: 59.90)
  FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- Tabela de vendas: cada venda é de um cliente e de um produto
CREATE TABLE vendas (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  produto_id INT NOT NULL,
  quantidade INT NOT NULL,
  data_venda DATE NOT NULL,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id),
  FOREIGN KEY (produto_id) REFERENCES produtos(id)
);
