USE stock_routes;

INSERT INTO usuarios (email, senha) VALUES
('jose@gmail.com', '4321'),
('ronaldo@gmail.com', '1234'),
('leila@gmail.com', '2222');


INSERT INTO produtos (nome, preco) VALUES
('Mouse', 45.0),
('Teclado', 100.0),
('Monitor', 500.0),
('Headset', 150.0),
('Webcam', 200.00);

INSERT INTO estante VALUES
(NULL),
(NULL),
(NULL);

INSERT INTO estante_produto
(estante_id, produto_id, fileira, andar, quantidade) 
VALUES 
(1, 1, 1, 1, 50),
(1, 2, 2, 1, 30),
(1, 3, 3, 2, 15),
(2, 1, 1, 2, 40),
(2, 4, 2, 2, 25),
(2, 5, 3, 3, 10),
(3, 2, 1, 1, 20),
(3, 3, 2, 2, 10);

INSERT INTO movimentacao_estoque
(usuario_id, estante_id, produto_id, quantidade, tipo, data_alteracao)
VALUES
(2, 1, 1, 5, 2, NOW()),
(1, 1, 1, 20, 1, NOW());
    
    
SELECT 
    estante_produto.estante_id,
    produtos.nome AS produto,
    estante_produto.fileira,
    estante_produto.andar,
    estante_produto.quantidade
FROM estante_produto JOIN produtos 
ON estante_produto.produto_id = produtos.id;