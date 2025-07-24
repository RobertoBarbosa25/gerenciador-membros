# Use a imagem oficial do Java 17
FROM eclipse-temurin:17-jdk

# Crie o diretório da aplicação
WORKDIR /app

# Copie o projeto para dentro do container
COPY . .

# Build do projeto
RUN ./mvnw clean package -DskipTests

# Exponha a porta padrão do Spring Boot
EXPOSE 8080

# Comando para rodar a aplicação
CMD ["java", "-jar", "target/gerenciador-membros-0.0.1-SNAPSHOT.jar"] 