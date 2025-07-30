-- Script para atualizar o banco de dados com a nova estrutura de ciclos
-- Execute este script no seu banco PostgreSQL

-- 1. Adicionar coluna ciclo_id à tabela gestao_presenca
ALTER TABLE gestao_presenca ADD COLUMN IF NOT EXISTS ciclo_id BIGINT;

-- 2. Criar um ciclo padrão para dados existentes
INSERT INTO ciclo (nome, data_inicio, ativo) 
VALUES ('Ciclo Padrão - Dados Existentes', NOW(), true)
ON CONFLICT DO NOTHING;

-- 3. Atualizar presenças existentes para usar o ciclo padrão
UPDATE gestao_presenca 
SET ciclo_id = (SELECT id FROM ciclo WHERE nome = 'Ciclo Padrão - Dados Existentes' LIMIT 1)
WHERE ciclo_id IS NULL;

-- 4. Adicionar foreign key constraint
ALTER TABLE gestao_presenca 
ADD CONSTRAINT IF NOT EXISTS fk_gestao_presenca_ciclo 
FOREIGN KEY (ciclo_id) REFERENCES ciclo(id);

-- 5. Tornar a coluna NOT NULL após migração
ALTER TABLE gestao_presenca ALTER COLUMN ciclo_id SET NOT NULL;

-- 6. Verificar se tudo foi migrado corretamente
SELECT COUNT(*) as total_presencas, 
       COUNT(ciclo_id) as presencas_com_ciclo,
       COUNT(*) - COUNT(ciclo_id) as presencas_sem_ciclo
FROM gestao_presenca; 