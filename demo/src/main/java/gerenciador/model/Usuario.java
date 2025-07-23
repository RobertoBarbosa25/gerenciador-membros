package gerenciador.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor; 
import lombok.AllArgsConstructor; 

@Entity
@Data
@NoArgsConstructor // Gera um construtor sem argumentos
@AllArgsConstructor // Gera um construtor com todos os argumentos
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username; // Nome de usuário
    private String password; // Senha (será armazenada criptografada)
    private String role;     // Papel/Perfil do usuário (ex: "ADMIN", "USER")

    // Se preferir não usar @NoArgsConstructor e @AllArgsConstructor do Lombok,
    // pode deixar apenas o construtor padrão e adicionar um construtor com campos:
    // public Usuario() {}
    // public Usuario(String username, String password, String role) {
    //     this.username = username;
    //     this.password = password;
    //     this.role = role;
    // }
}
