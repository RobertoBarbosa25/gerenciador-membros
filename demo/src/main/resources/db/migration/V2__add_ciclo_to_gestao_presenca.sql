-- Adicionar coluna ciclo_id à tabela gestao_presenca
ALTER TABLE gestao_presenca ADD COLUMN ciclo_id BIGINT;

-- Adicionar foreign key constraint
ALTER TABLE gestao_presenca 
ADD CONSTRAINT fk_gestao_presenca_ciclo 
FOREIGN KEY (ciclo_id) REFERENCES ciclo(id);

-- Tornar a coluna NOT NULL após migração dos dados
-- ALTER TABLE gestao_presenca ALTER COLUMN ciclo_id SET NOT NULL; 