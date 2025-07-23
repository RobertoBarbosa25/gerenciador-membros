package gerenciador.model;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonIdentityInfo; // NOVO IMPORT
import com.fasterxml.jackson.annotation.ObjectIdGenerators; // NOVO IMPORT

@Entity
@Table(name = "partida")
@JsonIdentityInfo(
    generator = ObjectIdGenerators.PropertyGenerator.class,
    property = "id") // ADICIONE ESTA ANOTAÇÃO AQUI!
public class Partida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nome;

    @Column(nullable = false)
    private String tipo; // 'RITO' ou 'VIGILIA'

    @Column(nullable = false)
    private Integer capacidadeMaximaJogadores = 8;

    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
        name = "partida_membros",
        joinColumns = @JoinColumn(name = "partida_id"),
        inverseJoinColumns = @JoinColumn(name = "membro_id")
    )
    // REMOVA: @JsonManagedReference
    private Set<Membro> membros = new HashSet<>();

    public Partida() {}

    public Partida(String nome, String tipo) {
        this.nome = nome;
        this.tipo = tipo;
    }

    // --- Getters e Setters (inalterados) ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getTipo() {
        return tipo;
    }
    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Integer getCapacidadeMaximaJogadores() {
        return capacidadeMaximaJogadores;
    }

    public void setCapacidadeMaximaJogadores(Integer capacidadeMaximaJogadores) {
        this.capacidadeMaximaJogadores = capacidadeMaximaJogadores;
    }

    public Set<Membro> getMembros() {
        return membros;
    }

    public void setMembros(Set<Membro> membros) {
        this.membros = membros;
    }

    public void adicionarMembro(Membro membro) {
        this.membros.add(membro);
        membro.getPartidas().add(this);
    }

    public void removerMembro(Membro membro) {
        this.membros.remove(membro);
        membro.getPartidas().remove(this);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Partida partida = (Partida) o;
        return id != null && id.equals(partida.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}