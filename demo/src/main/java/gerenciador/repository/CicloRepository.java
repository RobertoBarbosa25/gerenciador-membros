package gerenciador.repository;

import gerenciador.model.Ciclo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CicloRepository extends JpaRepository<Ciclo, Long> {
    List<Ciclo> findByAtivoOrderByDataInicioDesc(boolean ativo);
    List<Ciclo> findAllByOrderByDataInicioDesc();
    
    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("UPDATE Ciclo c SET c.ativo = false, c.dataFim = :dataFim WHERE c.ativo = true")
    void desativarTodosCiclosAtivos(java.time.LocalDateTime dataFim);
} 