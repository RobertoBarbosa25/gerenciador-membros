package gerenciador.repository;

import gerenciador.model.Partida;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository // Opcional, mas boa prática para indicar que é um componente de repositório
public interface PartidaRepository extends JpaRepository<Partida, Long> {
    // Spring Data JPA já fornece métodos como save(), findById(), findAll(), delete()
    // Você pode adicionar métodos de consulta personalizados aqui se precisar,
    // como findByNome(String nome);
}