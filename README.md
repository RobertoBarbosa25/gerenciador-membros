# Gerenciador de Membros

## Descrição
Sistema completo para gestão de membros, organização de salas (Rito e Vigilia), com backend em Spring Boot + PostgreSQL e frontend em React.

---

## Pré-requisitos
- Java 17+
- Maven 3.8+
- Node.js 18+
- PostgreSQL

---

## Backend (Spring Boot)

### Instalação e Execução
```sh
cd demo
mvn clean install -DskipTests
mvn spring-boot:run
```

### Configuração do Banco de Dados
Edite `demo/src/main/resources/application.yml` conforme seu ambiente:
```yml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/gerenciador_membros
    username: postgres
    password: sua_senha
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
```

### Documentação da API (Swagger)
Acesse após iniciar o backend:
- [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

Principais endpoints documentados:
- `/api/partidas` — Gerenciamento de partidas do Rito
- `/api/vigilia` — Gerenciamento de salas da Vigilia
- `/api/membros` — Gerenciamento de membros

---

## Frontend (React)

### Instalação e Execução
```sh
cd frontend
npm install
npm run dev
```

Acesse em: [http://localhost:5173](http://localhost:5173)

---

## Funcionalidades
- Gestão de membros (CRUD)
- Organização de salas do Rito (10 partidas)
- Organização de salas da Vigilia (12 salas)
- Busca inteligente por nome (ignora acentos/case)
- Feedback visual (toasts, loading)
- Documentação automática da API (Swagger)

---

## Observações
- Para editar nomes de partidas, não pode haver duplicidade (ignorando maiúsculas/minúsculas).
- Para deletar partidas diretamente no banco, remova antes as referências em `partida_membros`.
- O backend diferencia partidas do Rito e Vigilia pelo campo `tipo`.

---

## Licença
MIT 