package gerenciador.repository;

import gerenciador.model.CicloVigilia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CicloVigiliaRepository extends JpaRepository<CicloVigilia, Long> {
    List<CicloVigilia> findByCicloIdOrderByOrdem(Long cicloId);
    List<CicloVigilia> findByGestaoVigiliaId(Long gestaoVigiliaId);
} 