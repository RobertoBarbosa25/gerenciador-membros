-- Script de inicialização do banco de dados
-- Execute este script no seu banco PostgreSQL para criar dados básicos

-- 1. Verificar se as tabelas existem e criar se necessário
CREATE TABLE IF NOT EXISTS gestao_vigilia (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS ciclo (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    data_inicio TIMESTAMP DEFAULT NOW(),
    data_fim TIMESTAMP,
    ativo BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS ciclo_vigilia (
    id BIGSERIAL PRIMARY KEY,
    ciclo_id BIGINT REFERENCES ciclo(id),
    gestao_vigilia_id BIGINT REFERENCES gestao_vigilia(id),
    ordem INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS membro (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    resonance INTEGER DEFAULT 0,
    member_class VARCHAR(100),
    phone VARCHAR(50),
    discord_id VARCHAR(100),
    cla VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS gestao_presenca (
    id BIGSERIAL PRIMARY KEY,
    membro_id BIGINT REFERENCES membro(id),
    gestao_vigilia_id BIGINT REFERENCES gestao_vigilia(id),
    ciclo_id BIGINT REFERENCES ciclo(id),
    status VARCHAR(50),
    escalado BOOLEAN DEFAULT false
);

-- 2. Inserir vigílias básicas se não existirem
INSERT INTO gestao_vigilia (nome) VALUES 
    ('Vigília 1'),
    ('Vigília 2'),
    ('Vigília 3')
ON CONFLICT DO NOTHING;

-- 3. Criar um ciclo padrão se não existir
INSERT INTO ciclo (nome, data_inicio, ativo) 
VALUES ('Ciclo Inicial', NOW(), true)
ON CONFLICT DO NOTHING;

-- 4. Associar vigílias ao ciclo padrão
INSERT INTO ciclo_vigilia (ciclo_id, gestao_vigilia_id, ordem)
SELECT 
    c.id as ciclo_id,
    v.id as gestao_vigilia_id,
    ROW_NUMBER() OVER (ORDER BY v.id) as ordem
FROM ciclo c, gestao_vigilia v
WHERE c.nome = 'Ciclo Inicial'
ON CONFLICT DO NOTHING;

-- 5. Inserir alguns membros de exemplo se não existirem
INSERT INTO membro (name, resonance, member_class, phone, discord_id, cla) VALUES 
    ('Membro Exemplo 1', 3000, 'Arcanista', '', 'Discord#1234', 'Chernobyl'),
    ('Membro Exemplo 2', 2800, 'Guerreiro', '', 'Discord#5678', 'Chernobyl'),
    ('Membro Exemplo 3', 3200, 'Mago', '', 'Discord#9012', 'Chernobyl')
ON CONFLICT DO NOTHING;

-- 6. Verificar se tudo foi criado corretamente
SELECT 'Vigílias criadas:' as info, COUNT(*) as total FROM gestao_vigilia;
SELECT 'Ciclos criados:' as info, COUNT(*) as total FROM ciclo;
SELECT 'Membros criados:' as info, COUNT(*) as total FROM membro;
SELECT 'Associações ciclo-vigília:' as info, COUNT(*) as total FROM ciclo_vigilia;

-- 7. Mostrar dados criados
SELECT 'Vigílias disponíveis:' as info;
SELECT id, nome FROM gestao_vigilia ORDER BY id;

SELECT 'Ciclos disponíveis:' as info;
SELECT id, nome, ativo FROM ciclo ORDER BY id;

SELECT 'Membros disponíveis:' as info;
SELECT id, name, member_class, cla FROM membro ORDER BY id; 