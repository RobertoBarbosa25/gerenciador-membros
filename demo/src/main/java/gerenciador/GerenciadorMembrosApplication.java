package gerenciador;
 
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication // Esta anotação é essencial!
public class GerenciadorMembrosApplication {

    public static void main(String[] args) {
        // Este é o método principal que inicia a aplicação Spring Boot
        SpringApplication.run(GerenciadorMembrosApplication.class, args);
    }
}
