USE sistema_rotas_v2;

-- Desativar temporariamente o Safe Update
SET SQL_SAFE_UPDATES = 0;

START TRANSACTION;

-- Apagar os registros na ordem correta
DELETE FROM arestas;
DELETE FROM produtos;
DELETE FROM estantes;

COMMIT;

-- Reativar o Safe Update
SET SQL_SAFE_UPDATES = 1;

-- Conferir se as tabelas estão vazias
SELECT * FROM arestas;
SELECT * FROM produtos;
SELECT * FROM estantes;