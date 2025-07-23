package gerenciador.repository;


import gerenciador.model.Membro; // Importe a classe Membro
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository // Indica que esta interface é um componente de repositório
public interface MembroRepository extends JpaRepository<Membro, Long> {

    // Opcional: Adicionar um método para buscar por nome
    // O Spring Data JPA cria a implementação automaticamente
     List<Membro> findByNameContainingIgnoreCase(String name);
     List<Membro> findByMemberClassIgnoreCase(String memberClass);
     List<Membro> findByClaIgnoreCase(String cla);
     List<Membro> findByMemberClassIgnoreCaseAndClaIgnoreCase(String memberClass, String cla);
     @Query(value = "SELECT * FROM membros m WHERE unaccent(lower(m.name)) LIKE unaccent(lower(concat('%', :name, '%')))", nativeQuery = true)
     List<Membro> searchByNameUnaccent(@Param("name") String name);

     void deleteAll();
}
