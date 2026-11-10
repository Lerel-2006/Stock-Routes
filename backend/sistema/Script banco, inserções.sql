
-- ============================================
-- SISTEMA DE ROTAS DE ESTOQUE V2
-- CADASTRO DOS DADOS INICIAIS
-- ============================================

USE sistema_rotas_v2;

-- Desativar temporariamente o Safe Update
SET SQL_SAFE_UPDATES = 0;

-- Iniciar transação
START TRANSACTION;

-- ============================================
-- 1. APAGAR REGISTROS ANTIGOS
-- ============================================

DELETE FROM arestas;
DELETE FROM produtos;
DELETE FROM estantes;

-- ============================================
-- 2. CADASTRAR ESTANTES
-- ============================================

INSERT INTO estantes
(codigo, created_at, updated_at)
VALUES
('E01', NOW(), NOW()),
('E02', NOW(), NOW()),
('E03', NOW(), NOW()),
('E04', NOW(), NOW()),
('E05', NOW(), NOW()),
('E06', NOW(), NOW()),
('E07', NOW(), NOW()),
('E08', NOW(), NOW());

-- ============================================
-- 3. CADASTRAR PRODUTOS
-- Cada estante possui um tipo de produto
-- ============================================

INSERT INTO produtos
(nome, quantidade, estante_id, created_at, updated_at)
VALUES
('Teclado', 20,
 (SELECT id FROM estantes WHERE codigo = 'E01'),
 NOW(), NOW()),

('Mouse', 35,
 (SELECT id FROM estantes WHERE codigo = 'E02'),
 NOW(), NOW()),

('Monitor', 12,
 (SELECT id FROM estantes WHERE codigo = 'E03'),
 NOW(), NOW()),

('Headset', 25,
 (SELECT id FROM estantes WHERE codigo = 'E04'),
 NOW(), NOW()),

('Webcam', 18,
 (SELECT id FROM estantes WHERE codigo = 'E05'),
 NOW(), NOW()),

('Microfone', 15,
 (SELECT id FROM estantes WHERE codigo = 'E06'),
 NOW(), NOW()),

('Controle', 30,
 (SELECT id FROM estantes WHERE codigo = 'E07'),
 NOW(), NOW()),

('Caixa de Som', 10,
 (SELECT id FROM estantes WHERE codigo = 'E08'),
 NOW(), NOW());

-- ============================================
-- 4. CADASTRAR ARESTAS
-- Grafo não direcionado
-- Distâncias em metros
-- ============================================

INSERT INTO arestas
(estante_origem_id, estante_destino_id, distancia,
 created_at, updated_at)
VALUES

-- E01 <-> E02
((SELECT id FROM estantes WHERE codigo = 'E01'),
 (SELECT id FROM estantes WHERE codigo = 'E02'),
 4, NOW(), NOW()),

-- E02 <-> E03
((SELECT id FROM estantes WHERE codigo = 'E02'),
 (SELECT id FROM estantes WHERE codigo = 'E03'),
 6, NOW(), NOW()),

-- E01 <-> E04
((SELECT id FROM estantes WHERE codigo = 'E01'),
 (SELECT id FROM estantes WHERE codigo = 'E04'),
 3, NOW(), NOW()),

-- E02 <-> E05
((SELECT id FROM estantes WHERE codigo = 'E02'),
 (SELECT id FROM estantes WHERE codigo = 'E05'),
 5, NOW(), NOW()),

-- E03 <-> E06
((SELECT id FROM estantes WHERE codigo = 'E03'),
 (SELECT id FROM estantes WHERE codigo = 'E06'),
 2, NOW(), NOW()),

-- E04 <-> E05
((SELECT id FROM estantes WHERE codigo = 'E04'),
 (SELECT id FROM estantes WHERE codigo = 'E05'),
 7, NOW(), NOW()),

-- E05 <-> E06
((SELECT id FROM estantes WHERE codigo = 'E05'),
 (SELECT id FROM estantes WHERE codigo = 'E06'),
 4, NOW(), NOW()),

-- E04 <-> E07
((SELECT id FROM estantes WHERE codigo = 'E04'),
 (SELECT id FROM estantes WHERE codigo = 'E07'),
 6, NOW(), NOW()),

-- E05 <-> E08
((SELECT id FROM estantes WHERE codigo = 'E05'),
 (SELECT id FROM estantes WHERE codigo = 'E08'),
 3, NOW(), NOW()),

-- E07 <-> E08
((SELECT id FROM estantes WHERE codigo = 'E07'),
 (SELECT id FROM estantes WHERE codigo = 'E08'),
 5, NOW(), NOW());

-- ============================================
-- 5. CONFIRMAR ALTERAÇÕES
-- ============================================

COMMIT;

-- Reativar a proteção do MySQL
SET SQL_SAFE_UPDATES = 1;

-- ============================================
-- 6. CONFERIR OS REGISTROS
-- ============================================

SELECT * FROM estantes ORDER BY codigo;

SELECT * FROM produtos ORDER BY nome;

SELECT * FROM arestas ORDER BY id;

-- ============================================
-- 7. CONFERIR AS QUANTIDADES
-- ============================================

SELECT COUNT(*) AS total_estantes FROM estantes;

SELECT COUNT(*) AS total_produtos FROM produtos;

SELECT COUNT(*) AS total_arestas FROM arestas;

-- ============================================
-- 8. VISUALIZAR AS CONEXÕES
-- ============================================

SELECT
    origem.codigo AS origem,
    destino.codigo AS destino,
    arestas.distancia AS distancia_metros
FROM arestas
INNER JOIN estantes AS origem
    ON arestas.estante_origem_id = origem.id
INNER JOIN estantes AS destino
    ON arestas.estante_destino_id = destino.id
ORDER BY origem.codigo, destino.codigo;
