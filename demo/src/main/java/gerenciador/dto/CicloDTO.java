package gerenciador.dto;

import java.time.LocalDateTime;
import java.util.List;

public class CicloDTO {
    private Long id;
    private String nome;
    private LocalDateTime dataInicio;
    private LocalDateTime dataFim;
    private boolean ativo;
    private List<CicloVigiliaDTO> cicloVigilias;

    public CicloDTO() {}

    public CicloDTO(Long id, String nome, LocalDateTime dataInicio, LocalDateTime dataFim, boolean ativo) {
        this.id = id;
        this.nome = nome;
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
        this.ativo = ativo;
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

    public List<CicloVigiliaDTO> getCicloVigilias() { return cicloVigilias; }
    public void setCicloVigilias(List<CicloVigiliaDTO> cicloVigilias) { this.cicloVigilias = cicloVigilias; }
} 