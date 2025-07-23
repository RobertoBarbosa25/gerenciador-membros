package gerenciador.repository;

import gerenciador.model.Usuario; // Importe a entidade Usuario
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional; // Importe Optional

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Método para buscar um usuário pelo username
    Optional<Usuario> findByUsername(String username);
}
