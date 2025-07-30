package gerenciador.controller;

import gerenciador.model.Ciclo;
import gerenciador.model.GestaoPresenca;
import gerenciador.model.GestaoVigilia;
import gerenciador.model.Membro;
import gerenciador.repository.CicloRepository;
import gerenciador.repository.GestaoPresencaRepository;
import gerenciador.repository.GestaoVigiliaRepository;
import gerenciador.repository.MembroRepository;
import gerenciador.service.GestaoPresencaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/gestao/presenca")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "https://gerenciador-membros.netlify.app", "https://gerenciador-membros.onrender.com"})
public class GestaoPresencaController {
    private final GestaoPresencaService service;
    private final MembroRepository membroRepository;
    private final GestaoVigiliaRepository gestaoVigiliaRepository;
    private final CicloRepository cicloRepository;
    private final GestaoPresencaRepository repository;

    @Autowired
    public GestaoPresencaController(GestaoPresencaService service, MembroRepository membroRepository, GestaoVigiliaRepository gestaoVigiliaRepository, CicloRepository cicloRepository, GestaoPresencaRepository repository) {
        this.service = service;
        this.membroRepository = membroRepository;
        this.gestaoVigiliaRepository = gestaoVigiliaRepository;
        this.cicloRepository = cicloRepository;
        this.repository = repository;
    }

    // POST /api/gestao/presenca
    @PostMapping
    public ResponseEntity<GestaoPresenca> salvarOuAtualizarPresenca(@RequestBody PresencaRequest request) {
        Optional<Membro> membroOpt = membroRepository.findById(request.getMembroId());
        Optional<GestaoVigilia> vigiliaOpt = gestaoVigiliaRepository.findById(request.getGestaoVigiliaId());
        Optional<Ciclo> cicloOpt = cicloRepository.findById(request.getCicloId());
        
        if (membroOpt.isEmpty() || vigiliaOpt.isEmpty() || cicloOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        GestaoPresenca presenca = service.salvarOuAtualizarPresenca(
            membroOpt.get(),
            vigiliaOpt.get(),
            request.getStatus(),
            request.isEscalado(),
            cicloOpt.get()
        );
        return ResponseEntity.ok(presenca);
    }

    // GET /api/gestao/presenca/vigilia/{gestaoVigiliaId}
    @GetMapping("/vigilia/{gestaoVigiliaId}")
    public ResponseEntity<List<GestaoPresenca>> buscarPorVigilia(@PathVariable Long gestaoVigiliaId) {
        Optional<GestaoVigilia> vigiliaOpt = gestaoVigiliaRepository.findById(gestaoVigiliaId);
        if (vigiliaOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(service.buscarPorVigilia(vigiliaOpt.get()));
    }

    // GET /api/gestao/presenca/membro/{membroId}
    @GetMapping("/membro/{membroId}")
    public ResponseEntity<List<GestaoPresenca>> buscarPorMembro(@PathVariable Long membroId) {
        Optional<Membro> membroOpt = membroRepository.findById(membroId);
        if (membroOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(service.buscarPorMembro(membroOpt.get()));
    }

    // GET /api/gestao/presenca/{membroId}/{gestaoVigiliaId}
    @GetMapping("/{membroId}/{gestaoVigiliaId}")
    public ResponseEntity<GestaoPresenca> buscarPorMembroEVigilia(@PathVariable Long membroId, @PathVariable Long gestaoVigiliaId) {
        Optional<Membro> membroOpt = membroRepository.findById(membroId);
        Optional<GestaoVigilia> vigiliaOpt = gestaoVigiliaRepository.findById(gestaoVigiliaId);
        if (membroOpt.isEmpty() || vigiliaOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Optional<GestaoPresenca> presencaOpt = service.buscarPorMembroEVigilia(membroOpt.get(), vigiliaOpt.get());
        return presencaOpt.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // GET /api/gestao/presenca/ciclo/{cicloId}
    @GetMapping("/ciclo/{cicloId}")
    public ResponseEntity<List<GestaoPresenca>> buscarPorCiclo(@PathVariable Long cicloId) {
        Optional<Ciclo> cicloOpt = cicloRepository.findById(cicloId);
        if (cicloOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(service.buscarPorCiclo(cicloOpt.get()));
    }

    // GET /api/gestao/presenca/ciclo/{cicloId}/vigilia/{gestaoVigiliaId}
    @GetMapping("/ciclo/{cicloId}/vigilia/{gestaoVigiliaId}")
    public ResponseEntity<List<GestaoPresenca>> buscarPorCicloEVigilia(@PathVariable Long cicloId, @PathVariable Long gestaoVigiliaId) {
        Optional<Ciclo> cicloOpt = cicloRepository.findById(cicloId);
        Optional<GestaoVigilia> vigiliaOpt = gestaoVigiliaRepository.findById(gestaoVigiliaId);
        if (cicloOpt.isEmpty() || vigiliaOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(service.buscarPorCicloEVigilia(cicloOpt.get(), vigiliaOpt.get()));
    }

    // GET /api/gestao/presenca/ciclo/{cicloId}/membro/{membroId}
    @GetMapping("/ciclo/{cicloId}/membro/{membroId}")
    public ResponseEntity<List<GestaoPresenca>> buscarPorCicloEMembro(@PathVariable Long cicloId, @PathVariable Long membroId) {
        try {
            Optional<Ciclo> cicloOpt = cicloRepository.findById(cicloId);
            Optional<Membro> membroOpt = membroRepository.findById(membroId);
            
            if (cicloOpt.isEmpty()) {
                System.out.println("Ciclo não encontrado: " + cicloId);
                return ResponseEntity.badRequest().build();
            }
            
            if (membroOpt.isEmpty()) {
                System.out.println("Membro não encontrado: " + membroId);
                return ResponseEntity.badRequest().build();
            }
            
            List<GestaoPresenca> presencas = service.buscarPorCicloEMembro(cicloOpt.get(), membroOpt.get());
            return ResponseEntity.ok(presencas);
        } catch (Exception e) {
            System.err.println("Erro ao buscar presenças por ciclo e membro: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // GET /api/gestao/presenca/ciclo/{cicloId}/historico
    @GetMapping("/ciclo/{cicloId}/historico")
    public ResponseEntity<Map<String, Object>> buscarHistoricoCompletoDoCiclo(@PathVariable Long cicloId) {
        try {
            System.out.println("Buscando histórico para ciclo ID: " + cicloId);
            
            Optional<Ciclo> cicloOpt = cicloRepository.findById(cicloId);
            if (cicloOpt.isEmpty()) {
                System.out.println("Ciclo não encontrado: " + cicloId);
                return ResponseEntity.notFound().build();
            }
            
            Ciclo ciclo = cicloOpt.get();
            System.out.println("Ciclo encontrado: " + ciclo.getNome());
            
            // Buscar todas as presenças do ciclo com fetch join para evitar lazy loading
            List<GestaoPresenca> todasPresencas = repository.findByCicloIdWithFetch(cicloId);
            
            // Fallback: buscar todas e filtrar se a query não funcionar
            if (todasPresencas.isEmpty()) {
                List<GestaoPresenca> todasPresencasBanco = repository.findAll();
                todasPresencas = todasPresencasBanco.stream()
                    .filter(p -> p.getCiclo() != null && p.getCiclo().getId().equals(cicloId))
                    .collect(Collectors.toList());
            }
            
            // Filtrar apenas jogadores escalados
            List<GestaoPresenca> presencasEscalados = todasPresencas.stream()
                .filter(p -> p.isEscalado())
                .collect(Collectors.toList());
            
            // Agrupar presenças por membro (jogador escalado)
            Map<Long, List<GestaoPresenca>> presencasPorMembro = presencasEscalados.stream()
                .collect(Collectors.groupingBy(p -> p.getMembro().getId()));
            

            
            // Calcular estatísticas por jogador escalado
            List<Map<String, Object>> estatisticasPorJogador = new ArrayList<>();
            for (Map.Entry<Long, List<GestaoPresenca>> entry : presencasPorMembro.entrySet()) {
                Long membroId = entry.getKey();
                List<GestaoPresenca> presencas = entry.getValue();
                
                // Pegar dados do primeiro registro para obter informações do membro
                GestaoPresenca primeiraPresenca = presencas.get(0);
                Membro membro = primeiraPresenca.getMembro();
                
                                   // Calcular estatísticas
                   long totalEscalacoes = presencas.size();
                   long presentes = presencas.stream().filter(p -> "presente".equals(p.getStatus())).count();
                   long faltaram = presencas.stream().filter(p -> "faltou".equals(p.getStatus())).count();
                
                // Calcular percentual de presença
                double percentualPresenca = totalEscalacoes > 0 ? (double) presentes / totalEscalacoes * 100 : 0;
                
                                   Map<String, Object> statsJogador = new HashMap<>();
                   statsJogador.put("membroId", membroId);
                   statsJogador.put("membroNome", membro.getName());
                   statsJogador.put("membroClasse", membro.getMemberClass());
                   statsJogador.put("totalEscalacoes", totalEscalacoes);
                   statsJogador.put("presentes", presentes);
                   statsJogador.put("faltaram", faltaram);
                   statsJogador.put("percentualPresenca", Math.round(percentualPresenca * 100.0) / 100.0);
                
                estatisticasPorJogador.add(statsJogador);
            }
            
            // Ordenar por percentual de presença (maior para menor)
            estatisticasPorJogador.sort((a, b) -> {
                Number percentualA = (Number) a.get("percentualPresenca");
                Number percentualB = (Number) b.get("percentualPresenca");
                return Double.compare(percentualB.doubleValue(), percentualA.doubleValue());
            });
            
            // Calcular estatísticas gerais do ciclo
            Map<String, Object> estatisticasGerais = new HashMap<>();
            estatisticasGerais.put("totalJogadoresEscalados", estatisticasPorJogador.size());
            estatisticasGerais.put("totalEscalacoes", presencasEscalados.size());
            estatisticasGerais.put("totalPresentes", presencasEscalados.stream().filter(p -> "presente".equals(p.getStatus())).count());
            estatisticasGerais.put("totalFaltaram", presencasEscalados.stream().filter(p -> "faltou".equals(p.getStatus())).count());
            
            // Calcular percentual geral de presença
            long totalPresentes = presencasEscalados.stream().filter(p -> "presente".equals(p.getStatus())).count();
            double percentualGeral = presencasEscalados.size() > 0 ? 
                (double) totalPresentes / presencasEscalados.size() * 100 : 0;
            estatisticasGerais.put("percentualGeralPresenca", Math.round(percentualGeral * 100.0) / 100.0);
            
            // Montar resposta
            Map<String, Object> resposta = new HashMap<>();
            
            // Criar DTO do ciclo para evitar loops infinitos
            Map<String, Object> cicloDTO = new HashMap<>();
            cicloDTO.put("id", ciclo.getId());
            cicloDTO.put("nome", ciclo.getNome());
            cicloDTO.put("ativo", ciclo.isAtivo());
            
            resposta.put("ciclo", cicloDTO);
            resposta.put("estatisticasPorJogador", estatisticasPorJogador);
            resposta.put("estatisticasGerais", estatisticasGerais);
            
            return ResponseEntity.ok(resposta);
        } catch (Exception e) {
            System.err.println("Erro ao buscar histórico do ciclo: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }



    // Classe auxiliar para receber o JSON do POST
    public static class PresencaRequest {
        private Long membroId;
        private Long gestaoVigiliaId;
        private Long cicloId;
        private String status;
        private boolean escalado;

        public Long getMembroId() { return membroId; }
        public void setMembroId(Long membroId) { this.membroId = membroId; }
        public Long getGestaoVigiliaId() { return gestaoVigiliaId; }
        public void setGestaoVigiliaId(Long gestaoVigiliaId) { this.gestaoVigiliaId = gestaoVigiliaId; }
        public Long getCicloId() { return cicloId; }
        public void setCicloId(Long cicloId) { this.cicloId = cicloId; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public boolean isEscalado() { return escalado; }
        public void setEscalado(boolean escalado) { this.escalado = escalado; }
    }
} 