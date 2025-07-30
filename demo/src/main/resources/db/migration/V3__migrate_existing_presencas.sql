-- Criar um ciclo padrão para dados existentes
INSERT INTO ciclo (nome, data_inicio, ativo) 
VALUES ('Ciclo Padrão - Dados Existentes', NOW(), true)
ON CONFLICT DO NOTHING;

-- Atualizar presenças existentes para usar o ciclo padrão
UPDATE gestao_presenca 
SET ciclo_id = (SELECT id FROM ciclo WHERE nome = 'Ciclo Padrão - Dados Existentes' LIMIT 1)
WHERE ciclo_id IS NULL;

-- Tornar a coluna NOT NULL após migração
ALTER TABLE gestao_presenca ALTER COLUMN ciclo_id SET NOT NULL; 