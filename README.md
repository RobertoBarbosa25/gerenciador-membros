# Gerenciador de Membros

Sistema completo para gestão de membros, partidas e vigílias, com frontend em React (Vite) e backend em Spring Boot.

---

## Deploy

- **Frontend:** [Netlify](https://www.netlify.com/)
- **Backend:** [Render](https://render.com/)

---

## Como rodar localmente

### Pré-requisitos
- Node.js (para o frontend)
- Java 17+ e Maven (para o backend)
- PostgreSQL (ou use o banco do Render)

---

### Backend (Spring Boot)

```bash
cd demo
./mvnw spring-boot:run
```

**Variáveis de ambiente necessárias:**
- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `SPRING_JPA_HIBERNATE_DDL_AUTO` (opcional, ex: `update`)

Exemplo de configuração no `application.yml`:
```yaml
server:
  port: ${PORT:8080}

spring:
  datasource:
    url: ${SPRING_DATASOURCE_URL}
    username: ${SPRING_DATASOURCE_USERNAME}
    password: ${SPRING_DATASOURCE_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: ${SPRING_JPA_HIBERNATE_DDL_AUTO:update}
    show-sql: true
```

---

### Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

**Variável de ambiente:**
- `VITE_API_URL` (URL do backend, ex: `http://localhost:8080` ou a URL do Render)

Crie um arquivo `.env` na pasta `frontend`:
```
VITE_API_URL=http://localhost:8080
```

---

## Deploy em Produção

- **Backend:**  
  Deploy automático no Render, usando Dockerfile na pasta `demo/`.
- **Frontend:**  
  Deploy automático no Netlify.  
  Defina a variável de ambiente `VITE_API_URL` no painel do Netlify com a URL do backend Render.

---

## Links úteis
- [Render Dashboard](https://dashboard.render.com/)
- [Netlify Dashboard](https://app.netlify.com/)

---

## Licença
[MIT](LICENSE) 