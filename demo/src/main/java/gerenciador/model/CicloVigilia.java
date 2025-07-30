package gerenciador.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "ciclo_vigilia")
public class CicloVigilia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @JsonBackReference
    @ManyToOne(optional = false)
    @JoinColumn(name = "ciclo_id")
    private Ciclo ciclo;
    
    @ManyToOne(optional = false)
    @JoinColumn(name = "gestao_vigilia_id")
    private GestaoVigilia gestaoVigilia;
    
    @Column(nullable = false)
    private int ordem; // 1, 2, 3 para indicar a ordem da vigília no ciclo
    
    public CicloVigilia() {}
    
    public CicloVigilia(Ciclo ciclo, GestaoVigilia gestaoVigilia, int ordem) {
        this.ciclo = ciclo;
        this.gestaoVigilia = gestaoVigilia;
        this.ordem = ordem;
    }
    
    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Ciclo getCiclo() { return ciclo; }
    public void setCiclo(Ciclo ciclo) { this.ciclo = ciclo; }
    
    public GestaoVigilia getGestaoVigilia() { return gestaoVigilia; }
    public void setGestaoVigilia(GestaoVigilia gestaoVigilia) { this.gestaoVigilia = gestaoVigilia; }
    
    public int getOrdem() { return ordem; }
    public void setOrdem(int ordem) { this.ordem = ordem; }
} 