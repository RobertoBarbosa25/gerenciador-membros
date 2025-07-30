# 🔧 SOLUÇÃO PARA PROBLEMAS DE DEPLOY

## 🚨 Problemas Identificados:

### **1. 404 em `/api/ciclos/ativo`**
### **2. Vigílias não aparecem no modal de criar ciclo**

## 🎯 CAUSA RAIZ: Banco de Dados Vazio/Incompleto

Os problemas são causados porque o banco de dados não tem os dados básicos necessários.

---

## 🛠️ SOLUÇÃO PASSO A PASSO:

### **PASSO 1: Verificar o Status do Banco**

Execute o script `check_database.sql` no seu banco PostgreSQL:

```sql
-- Conecte no seu banco e execute:
\i check_database.sql
```

**Resultado esperado:**
- ❌ PROBLEMA: Nenhuma vigília encontrada
- ❌ PROBLEMA: Nenhum ciclo encontrado
- ❌ PROBLEMA: Nenhum ciclo ativo

### **PASSO 2: Corrigir o Banco de Dados**

Execute o script `fix_database.sql`:

```sql
-- Conecte no seu banco e execute:
\i fix_database.sql
```

**Este script vai:**
- ✅ Criar vigílias básicas (Vigília 1, 2, 3)
- ✅ Criar um ciclo padrão ativo
- ✅ Associar vigílias ao ciclo
- ✅ Corrigir estrutura da tabela gestao_presenca

### **PASSO 3: Verificar se Funcionou**

Execute novamente o `check_database.sql`:

```sql
\i check_database.sql
```

**Resultado esperado:**
- ✅ OK: 3 vigílias encontradas
- ✅ OK: 1 ciclos encontrados
- ✅ OK: 1 ciclo(s) ativo(s)

---

## 🔍 VERIFICAÇÃO MANUAL:

### **1. Verificar se as vigílias existem:**
```sql
SELECT id, nome FROM gestao_vigilia ORDER BY id;
```

**Deve retornar:**
```
id | nome
1  | Vigília 1
2  | Vigília 2
3  | Vigília 3
```

### **2. Verificar se há ciclo ativo:**
```sql
SELECT id, nome, ativo FROM ciclo WHERE ativo = true;
```

**Deve retornar:**
```
id | nome         | ativo
1  | Ciclo Padrão | true
```

### **3. Verificar associações:**
```sql
SELECT 
    c.nome as ciclo_nome,
    v.nome as vigilia_nome,
    cv.ordem
FROM ciclo_vigilia cv
JOIN ciclo c ON cv.ciclo_id = c.id
JOIN gestao_vigilia v ON cv.gestao_vigilia_id = v.id
ORDER BY cv.ordem;
```

**Deve retornar:**
```
ciclo_nome   | vigilia_nome | ordem
Ciclo Padrão | Vigília 1    | 1
Ciclo Padrão | Vigília 2    | 2
Ciclo Padrão | Vigília 3    | 3
```

---

## 🚀 TESTE APÓS CORREÇÃO:

### **1. Testar API do Ciclo Ativo:**
```bash
curl https://gerenciador-membros.onrender.com/api/ciclos/ativo
```

**Deve retornar:**
```json
{
  "id": 1,
  "nome": "Ciclo Padrão",
  "ativo": true,
  "dataInicio": "2024-01-01T00:00:00"
}
```

### **2. Testar API de Vigílias:**
```bash
curl https://gerenciador-membros.onrender.com/api/gestao/vigilias
```

**Deve retornar:**
```json
[
  {"id": 1, "nome": "Vigília 1"},
  {"id": 2, "nome": "Vigília 2"},
  {"id": 3, "nome": "Vigília 3"}
]
```

### **3. Testar Frontend:**
- Acesse a página de Gestão
- Clique em "🔄 Gerenciar Ciclos"
- Deve aparecer as vigílias para selecionar

---

## 🔧 SE AINDA HOUVER PROBLEMAS:

### **Problema: Script não executa**
```sql
-- Verificar se as tabelas existem
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

### **Problema: Permissões**
```sql
-- Verificar permissões
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO seu_usuario;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO seu_usuario;
```

### **Problema: Conexão**
- Verifique as variáveis de ambiente no Render
- Confirme se o banco está acessível
- Teste a conexão manualmente

---

## 📋 CHECKLIST FINAL:

- [ ] Banco de dados tem vigílias
- [ ] Banco de dados tem ciclo ativo
- [ ] API `/api/ciclos/ativo` retorna 200
- [ ] API `/api/gestao/vigilias` retorna vigílias
- [ ] Frontend mostra vigílias no modal
- [ ] CORS está configurado para produção

---

## 🎉 RESULTADO ESPERADO:

Após executar os scripts:
- ✅ **Problema 1 resolvido:** API retorna ciclo ativo
- ✅ **Problema 2 resolvido:** Vigílias aparecem no modal
- ✅ **Sistema funcional:** Pode criar ciclos e gerenciar presenças

**Execute os scripts e teste novamente!** 🚀 