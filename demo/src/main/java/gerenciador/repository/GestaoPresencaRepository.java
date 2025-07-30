package gerenciador.repository;

import gerenciador.model.Ciclo;
import gerenciador.model.GestaoPresenca;
import gerenciador.model.GestaoVigilia;
import gerenciador.model.Membro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface GestaoPresencaRepository extends JpaRepository<GestaoPresenca, Long> {
    List<GestaoPresenca> findByGestaoVigilia(GestaoVigilia gestaoVigilia);
    List<GestaoPresenca> findByMembro(Membro membro);
    Optional<GestaoPresenca> findByMembroAndGestaoVigilia(Membro membro, GestaoVigilia gestaoVigilia);
    
    // Novos métodos para filtrar por ciclo
    List<GestaoPresenca> findByCiclo(Ciclo ciclo);
    List<GestaoPresenca> findByCicloAndGestaoVigilia(Ciclo ciclo, GestaoVigilia gestaoVigilia);
    List<GestaoPresenca> findByCicloAndMembro(Ciclo ciclo, Membro membro);
    
    // Buscar presenças de um membro em um ciclo específico
    @Query("SELECT gp FROM GestaoPresenca gp WHERE gp.ciclo = :ciclo AND gp.membro = :membro")
    List<GestaoPresenca> findByCicloAndMembroQuery(@Param("ciclo") Ciclo ciclo, @Param("membro") Membro membro);
    
    // Buscar presenças de uma vigília em um ciclo específico
    @Query("SELECT gp FROM GestaoPresenca gp WHERE gp.ciclo = :ciclo AND gp.gestaoVigilia = :gestaoVigilia")
    List<GestaoPresenca> findByCicloAndGestaoVigiliaQuery(@Param("ciclo") Ciclo ciclo, @Param("gestaoVigilia") GestaoVigilia gestaoVigilia);
    
    // Buscar presenças de um ciclo com fetch join para evitar lazy loading
    @Query("SELECT gp FROM GestaoPresenca gp " +
           "JOIN FETCH gp.membro " +
           "JOIN FETCH gp.gestaoVigilia " +
           "JOIN FETCH gp.ciclo " +
           "WHERE gp.ciclo.id = :cicloId")
    List<GestaoPresenca> findByCicloIdWithFetch(@Param("cicloId") Long cicloId);
    
    // Buscar presença específica por membro, vigília E ciclo
    @Query("SELECT gp FROM GestaoPresenca gp WHERE gp.membro = :membro AND gp.gestaoVigilia = :gestaoVigilia AND gp.ciclo = :ciclo")
    Optional<GestaoPresenca> findByMembroAndGestaoVigiliaAndCiclo(@Param("membro") Membro membro, @Param("gestaoVigilia") GestaoVigilia gestaoVigilia, @Param("ciclo") Ciclo ciclo);
} 