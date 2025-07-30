package gerenciador.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "gestao_presenca")
public class GestaoPresenca {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "gestao_vigilia_id")
    @JsonManagedReference
    private GestaoVigilia gestaoVigilia;

    @ManyToOne(optional = false)
    @JoinColumn(name = "membro_id")
    @JsonManagedReference
    private Membro membro;

    @Column(nullable = false)
    private String status; // 'presente' ou 'faltou'

    @Column(nullable = false)
    private boolean escalado;

    @ManyToOne(optional = false)
    @JoinColumn(name = "ciclo_id")
    @JsonManagedReference
    private Ciclo ciclo;

    public GestaoPresenca() {}
    public GestaoPresenca(GestaoVigilia gestaoVigilia, Membro membro, String status, boolean escalado, Ciclo ciclo) {
        this.gestaoVigilia = gestaoVigilia;
        this.membro = membro;
        this.status = status;
        this.escalado = escalado;
        this.ciclo = ciclo;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public GestaoVigilia getGestaoVigilia() { return gestaoVigilia; }
    public void setGestaoVigilia(GestaoVigilia gestaoVigilia) { this.gestaoVigilia = gestaoVigilia; }
    public Membro getMembro() { return membro; }
    public void setMembro(Membro membro) { this.membro = membro; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public boolean isEscalado() { return escalado; }
    public void setEscalado(boolean escalado) { this.escalado = escalado; }
    public Ciclo getCiclo() { return ciclo; }
    public void setCiclo(Ciclo ciclo) { this.ciclo = ciclo; }
} 