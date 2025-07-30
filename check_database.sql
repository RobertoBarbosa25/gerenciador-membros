-- Script para verificar o status do banco de dados
-- Execute este script para diagnosticar problemas

-- 1. Verificar se as tabelas existem
SELECT 'Tabelas existentes:' as info;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('gestao_vigilia', 'ciclo', 'ciclo_vigilia', 'membro', 'gestao_presenca')
ORDER BY table_name;

-- 2. Verificar dados nas tabelas
SELECT 'Contagem de registros:' as info;
SELECT 'gestao_vigilia' as tabela, COUNT(*) as total FROM gestao_vigilia
UNION ALL
SELECT 'ciclo' as tabela, COUNT(*) as total FROM ciclo
UNION ALL
SELECT 'ciclo_vigilia' as tabela, COUNT(*) as total FROM ciclo_vigilia
UNION ALL
SELECT 'membro' as tabela, COUNT(*) as total FROM membro
UNION ALL
SELECT 'gestao_presenca' as tabela, COUNT(*) as total FROM gestao_presenca;

-- 3. Verificar vigílias disponíveis
SELECT 'Vigílias disponíveis:' as info;
SELECT id, nome FROM gestao_vigilia ORDER BY id;

-- 4. Verificar ciclos disponíveis
SELECT 'Ciclos disponíveis:' as info;
SELECT id, nome, ativo, data_inicio FROM ciclo ORDER BY id;

-- 5. Verificar associações ciclo-vigília
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

-- 6. Verificar se há ciclo ativo
SELECT 'Ciclo ativo:' as info;
SELECT id, nome, ativo FROM ciclo WHERE ativo = true;

-- 7. Verificar membros disponíveis
SELECT 'Membros disponíveis:' as info;
SELECT id, name, member_class, cla FROM membro ORDER BY id LIMIT 10;

-- 8. Verificar presenças
SELECT 'Presenças registradas:' as info;
SELECT COUNT(*) as total_presencas FROM gestao_presenca;

-- 9. Verificar problemas comuns
SELECT 'Diagnóstico de problemas:' as info;

-- Verificar se há vigílias
SELECT 
    CASE 
        WHEN COUNT(*) = 0 THEN '❌ PROBLEMA: Nenhuma vigília encontrada'
        ELSE '✅ OK: ' || COUNT(*) || ' vigílias encontradas'
    END as status_vigilias
FROM gestao_vigilia;

-- Verificar se há ciclos
SELECT 
    CASE 
        WHEN COUNT(*) = 0 THEN '❌ PROBLEMA: Nenhum ciclo encontrado'
        ELSE '✅ OK: ' || COUNT(*) || ' ciclos encontrados'
    END as status_ciclos
FROM ciclo;

-- Verificar se há ciclo ativo
SELECT 
    CASE 
        WHEN COUNT(*) = 0 THEN '❌ PROBLEMA: Nenhum ciclo ativo'
        ELSE '✅ OK: ' || COUNT(*) || ' ciclo(s) ativo(s)'
    END as status_ciclo_ativo
FROM ciclo WHERE ativo = true;

-- Verificar se há associações ciclo-vigília
SELECT 
    CASE 
        WHEN COUNT(*) = 0 THEN '❌ PROBLEMA: Nenhuma associação ciclo-vigília'
        ELSE '✅ OK: ' || COUNT(*) || ' associações encontradas'
    END as status_associacoes
FROM ciclo_vigilia; 