package gerenciador.model;

import jakarta.persistence.*;

@Entity
@Table(name = "gestao_vigilia")
public class GestaoVigilia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    public GestaoVigilia() {}
    public GestaoVigilia(String nome) { this.nome = nome; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
} 