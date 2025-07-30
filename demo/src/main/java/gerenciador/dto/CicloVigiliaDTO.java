package gerenciador.dto;

public class CicloVigiliaDTO {
    private Long id;
    private Long gestaoVigiliaId;
    private String gestaoVigiliaNome;
    private int ordem;

    public CicloVigiliaDTO() {}

    public CicloVigiliaDTO(Long id, Long gestaoVigiliaId, String gestaoVigiliaNome, int ordem) {
        this.id = id;
        this.gestaoVigiliaId = gestaoVigiliaId;
        this.gestaoVigiliaNome = gestaoVigiliaNome;
        this.ordem = ordem;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getGestaoVigiliaId() { return gestaoVigiliaId; }
    public void setGestaoVigiliaId(Long gestaoVigiliaId) { this.gestaoVigiliaId = gestaoVigiliaId; }

    public String getGestaoVigiliaNome() { return gestaoVigiliaNome; }
    public void setGestaoVigiliaNome(String gestaoVigiliaNome) { this.gestaoVigiliaNome = gestaoVigiliaNome; }

    public int getOrdem() { return ordem; }
    public void setOrdem(int ordem) { this.ordem = ordem; }
} 