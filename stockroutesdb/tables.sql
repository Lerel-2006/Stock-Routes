CREATE DATABASE stock_routes;

USE stock_routes;

CREATE TABLE usuarios(
	id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(90) NOT NULL,
    senha VARCHAR(20) NOT NULL
);

CREATE TABLE produtos(
	id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(20) NOT NULL,
    preco FLOAT UNSIGNED NOT NULL
);

CREATE TABLE estante(
	id INT AUTO_INCREMENT PRIMARY KEY
);

CREATE TABLE estante_produto(
	id INT AUTO_INCREMENT PRIMARY KEY,
    estante_id INT NOT NULL,
    produto_id INT NOT NULL,
    fileira INT NOT NULL,
    andar INT NOT NULL,
    quantidade INT NOT NULL,
    
    FOREIGN KEY(estante_id) REFERENCES estantes(id),
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

CREATE TABLE movimentacao_estoque(
	id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    estante_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL,
    tipo INT NOT NULL,
	data_alteracao DATETIME NOT NULL,
    
    FOREIGN KEY(usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY(estante_id) REFERENCES estantes(id),
    FOREIGN KEY(produto_id) REFERENCES produtos(id)
);

