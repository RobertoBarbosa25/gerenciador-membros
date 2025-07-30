-- Script para corrigir problemas comuns do banco de dados
-- Execute este script para resolver problemas automaticamente

-- 1. Criar vigílias se não existirem
INSERT INTO gestao_vigilia (nome) VALUES 
    ('Vigília 1'),
    ('Vigília 2'),
    ('Vigília 3')
ON CONFLICT DO NOTHING;

-- 2. Criar ciclo padrão se não existir
INSERT INTO ciclo (nome, data_inicio, ativo) 
VALUES ('Ciclo Padrão', NOW(), true)
ON CONFLICT DO NOTHING;

-- 3. Associar vigílias ao ciclo padrão se não estiverem associadas
INSERT INTO ciclo_vigilia (ciclo_id, gestao_vigilia_id, ordem)
SELECT 
    c.id as ciclo_id,
    v.id as gestao_vigilia_id,
    ROW_NUMBER() OVER (ORDER BY v.id) as ordem
FROM ciclo c, gestao_vigilia v
WHERE c.nome = 'Ciclo Padrão'
AND NOT EXISTS (
    SELECT 1 FROM ciclo_vigilia cv 
    WHERE cv.ciclo_id = c.id AND cv.gestao_vigilia_id = v.id
);

-- 4. Garantir que apenas um ciclo esteja ativo
UPDATE ciclo 
SET ativo = false 
WHERE id != (SELECT id FROM ciclo WHERE nome = 'Ciclo Padrão' LIMIT 1);

UPDATE ciclo 
SET ativo = true 
WHERE nome = 'Ciclo Padrão';

-- 5. Verificar se a coluna ciclo_id existe em gestao_presenca
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'gestao_presenca' AND column_name = 'ciclo_id'
    ) THEN
        ALTER TABLE gestao_presenca ADD COLUMN ciclo_id BIGINT;
    END IF;
END $$;

-- 6. Atualizar presenças existentes para usar o ciclo padrão
UPDATE gestao_presenca 
SET ciclo_id = (SELECT id FROM ciclo WHERE nome = 'Ciclo Padrão' LIMIT 1)
WHERE ciclo_id IS NULL;

-- 7. Adicionar foreign key se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_gestao_presenca_ciclo'
    ) THEN
        ALTER TABLE gestao_presenca 
        ADD CONSTRAINT fk_gestao_presenca_ciclo 
        FOREIGN KEY (ciclo_id) REFERENCES ciclo(id);
    END IF;
END $$;

-- 8. Verificar se tudo foi corrigido
SELECT '✅ Correções aplicadas com sucesso!' as status;

SELECT 'Vigílias disponíveis:' as info;
SELECT id, nome FROM gestao_vigilia ORDER BY id;

SELECT 'Ciclo ativo:' as info;
SELECT id, nome, ativo FROM ciclo WHERE ativo = true;

SELECT 'Associações ciclo-vigília:' as info;
SELECT 
    cv.id,
    c.nome as ciclo_nome,
    v.nome as vigilia_nome,
    cv.ordem
FROM ciclo_vigilia cv
JOIN ciclo c ON cv.ciclo_id = c.id
JOIN gestao_vigilia v ON cv.gestao_vigilia_id = v.id
ORDER BY cv.id; 