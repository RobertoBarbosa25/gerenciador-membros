package gerenciador.model;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "membros") // O nome da sua tabela no banco de dados
public class Membro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- Atributo 'name' ---
    @Column(name = "name", nullable = false)
    private String name;

    // --- Atributo 'resonance' ---
    @Column(nullable = false) // Coluna no DB também é "resonance", então não precisa de name="resonance"
    private Integer resonance;

    // --- CORREÇÃO FINAL AQUI: Atributo Java NÃO pode ser 'class'. Usaremos 'memberClass' ---
    @Column(name = "class", nullable = false) // Mapeia o atributo Java 'memberClass' para a coluna 'class' no banco de dados
    private String memberClass; // Atributo em Java agora é 'memberClass' (ou playerClass, etc.)
    // --- FIM DA CORREÇÃO ---

    // --- Atributo 'phone' ---
    @Column(name = "phone") // Removi 'nullable = false', ajuste se for obrigatório no DB.
    private String phone;

    // --- Atributo 'discordId' ---
    @Column(name = "discordId", nullable = false)
    private String discordId;

    // --- Atributo 'cla' ---
    @Column(nullable = false) // Coluna no DB também é "cla", então não precisa de name="cla"
    private String cla;

    @ManyToMany(mappedBy = "membros")
    @JsonBackReference
    private Set<Partida> partidas = new HashSet<>();

    public Membro() {}

    // --- Construtor completo com 'memberClass' ---
    public Membro(String name, Integer resonance, String memberClass, String phone, String discordId, String cla) {
        this.name = name;
        this.resonance = resonance;
        this.memberClass = memberClass; // Usando o atributo 'memberClass'
        this.phone = phone;
        this.discordId = discordId;
        this.cla = cla;
    }

    // --- Getters e Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getResonance() {
        return resonance;
    }

    public void setResonance(Integer resonance) {
        this.resonance = resonance;
    }

    // --- Getters e Setters para 'memberClass' ---
    public String getMemberClass() { // Getter para o atributo 'memberClass'
        return memberClass;
    }

    public void setMemberClass(String memberClass) { // Setter para o atributo 'memberClass'
        this.memberClass = memberClass;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDiscordId() {
        return discordId;
    }

    public void setDiscordId(String discordId) {
        this.discordId = discordId;
    }

    public String getCla() {
        return cla;
    }

    public void setCla(String cla) {
        this.cla = cla;
    }

    public Set<Partida> getPartidas() {
        return partidas;
    }

    public void setPartidas(Set<Partida> partidas) {
        this.partidas = partidas;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Membro membro = (Membro) o;
        return id != null && id.equals(membro.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}