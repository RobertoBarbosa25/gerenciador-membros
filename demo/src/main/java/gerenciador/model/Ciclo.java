package gerenciador.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "ciclo")
public class Ciclo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nome;
    
    @Column(name = "data_inicio")
    private LocalDateTime dataInicio;
    
    @Column(name = "data_fim")
    private LocalDateTime dataFim;
    
    @Column(nullable = false)
    private boolean ativo = true;
    
    @JsonManagedReference
    @OneToMany(mappedBy = "ciclo", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CicloVigilia> cicloVigilias;
    
    public Ciclo() {}
    
    public Ciclo(String nome) {
        this.nome = nome;
        this.dataInicio = LocalDateTime.now();
    }
    
    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    
    public LocalDateTime getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDateTime dataInicio) { this.dataInicio = dataInicio; }
    
    public LocalDateTime getDataFim() { return dataFim; }
    public void setDataFim(LocalDateTime dataFim) { this.dataFim = dataFim; }
    
    public boolean isAtivo() { return ativo; }
    public void setAtivo(boolean ativo) { this.ativo = ativo; }
    
    public List<CicloVigilia> getCicloVigilias() { return cicloVigilias; }
    public void setCicloVigilias(List<CicloVigilia> cicloVigilias) { this.cicloVigilias = cicloVigilias; }
} 