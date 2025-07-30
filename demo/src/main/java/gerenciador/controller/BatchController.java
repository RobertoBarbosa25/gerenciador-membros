package gerenciador.controller;

import gerenciador.service.GestaoVigiliaService;
import gerenciador.service.CicloService;
import gerenciador.service.GestaoPresencaService;
import gerenciador.service.MembroService;
import gerenciador.repository.CicloRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.stream.Collectors;
import gerenciador.model.GestaoPresenca;
import gerenciador.model.Membro;
import gerenciador.model.GestaoVigilia;
import gerenciador.model.Ciclo;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/batch")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "https://chernobyldiablo.netlify.app", "https://gerenciador-membros.onrender.com"})
public class BatchController {

    private final GestaoVigiliaService gestaoVigiliaService;
    private final CicloService cicloService;
    private final GestaoPresencaService gestaoPresencaService;
    private final MembroService membroService;
    private final CicloRepository cicloRepository;

    @Autowired
    public BatchController(GestaoVigiliaService gestaoVigiliaService, 
                          CicloService cicloService, 
                          GestaoPresencaService gestaoPresencaService,
                          MembroService membroService,
                          CicloRepository cicloRepository) {
        this.gestaoVigiliaService = gestaoVigiliaService;
        this.cicloService = cicloService;
        this.gestaoPresencaService = gestaoPresencaService;
        this.membroService = membroService;
        this.cicloRepository = cicloRepository;
    }

    // GET /api/batch/dados-iniciais - busca todos os dados necessários para inicializar a página
    @GetMapping("/dados-iniciais")
    public ResponseEntity<?> buscarDadosIniciais() {
        try {
            Map<String, Object> dadosCompletos = new HashMap<>();
            
            // Buscar vigílias
            dadosCompletos.put("vigilias", gestaoVigiliaService.listarTodas());
            
            // Buscar membros escalados nas salas da vigília
            dadosCompletos.put("membrosEscalados", gestaoVigiliaService.buscarMembrosEscaladosNasSalas());
            
            // Buscar ciclos ativos
            dadosCompletos.put("ciclos", cicloService.listarAtivos());
            
            System.out.println("✅ Batch request executado com sucesso!");
            System.out.println("📊 Vigílias: " + gestaoVigiliaService.listarTodas().size());
            System.out.println("👥 Membros escalados: " + gestaoVigiliaService.buscarMembrosEscaladosNasSalas().size());
            System.out.println("🔄 Ciclos: " + cicloService.listarAtivos().size());
            
            return ResponseEntity.ok(dadosCompletos);
        } catch (Exception e) {
            System.err.println("❌ Erro no batch request: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erro ao buscar dados iniciais: " + e.getMessage());
        }
    }

    // GET /api/batch/teste - endpoint de teste simples
    @GetMapping("/teste")
    public ResponseEntity<?> teste() {
        return ResponseEntity.ok("✅ Batch controller funcionando!");
    }

    // GET /api/batch/dados-vigilia/{cicloId}/{vigiliaId} - busca dados específicos de uma vigília
    @GetMapping("/dados-vigilia/{cicloId}/{vigiliaId}")
    public ResponseEntity<?> buscarDadosVigilia(@PathVariable Long cicloId, @PathVariable Long vigiliaId) {
        try {
            Map<String, Object> dadosVigilia = new HashMap<>();
            
            // Buscar presenças da vigília específica
            // Por enquanto, retornar lista vazia - será implementado no frontend
            dadosVigilia.put("presencas", new java.util.ArrayList<>());
            
            // Buscar membros escalados
            dadosVigilia.put("membrosEscalados", gestaoVigiliaService.buscarMembrosEscaladosNasSalas());
            
            return ResponseEntity.ok(dadosVigilia);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao buscar dados da vigília: " + e.getMessage());
        }
    }

    // GET /api/batch/presencas-ciclo/{cicloId} - busca todas as presenças de um ciclo
    @GetMapping("/presencas-ciclo/{cicloId}")
    public ResponseEntity<?> buscarPresencasCiclo(@PathVariable Long cicloId) {
        try {
            System.out.println("🔍 Iniciando busca de presenças para o ciclo: " + cicloId);
            
            Map<String, Object> dadosPresencas = new HashMap<>();
            
            // Verificar se o ciclo existe
            try {
                var cicloOpt = cicloService.buscarPorId(cicloId);
                if (cicloOpt.isEmpty()) {
                    System.err.println("❌ Ciclo com ID " + cicloId + " não encontrado!");
                    return ResponseEntity.badRequest().body("Ciclo com ID " + cicloId + " não encontrado!");
                }
                var ciclo = cicloOpt.get();
                System.out.println("✅ Ciclo encontrado: " + ciclo.getNome());
            } catch (Exception e) {
                System.err.println("❌ Erro ao buscar ciclo: " + e.getMessage());
                return ResponseEntity.badRequest().body("Erro ao buscar ciclo: " + e.getMessage());
            }
            
            // Buscar todas as presenças do ciclo usando o service
            System.out.println("🔍 Buscando presenças do ciclo...");
            List<GestaoPresenca> presencas = gestaoPresencaService.buscarPresencasPorCiclo(cicloId);
            dadosPresencas.put("presencas", presencas);
            
            // Agrupar presenças por membro para facilitar o frontend
            Map<Long, List<GestaoPresenca>> presencasPorMembro = presencas.stream()
                .collect(Collectors.groupingBy(p -> p.getMembro().getId()));
            dadosPresencas.put("presencasPorMembro", presencasPorMembro);
            
            System.out.println("✅ Batch presenças do ciclo " + cicloId + ": " + presencas.size() + " presenças");
            
            return ResponseEntity.ok(dadosPresencas);
        } catch (Exception e) {
            System.err.println("❌ Erro ao buscar presenças do ciclo " + cicloId + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erro ao buscar presenças do ciclo: " + e.getMessage());
        }
    }

    @PostMapping("/salvar-presencas")
    public ResponseEntity<?> salvarPresencasEmLote(@RequestBody List<Map<String, Object>> presencasData) {
        try {
            System.out.println("🚀 Iniciando salvamento em lote de " + presencasData.size() + " presenças");
            
            List<GestaoPresenca> presencasSalvas = new ArrayList<>();
            
            for (Map<String, Object> presencaData : presencasData) {
                try {
                    Long membroId = Long.valueOf(presencaData.get("membroId").toString());
                    Long gestaoVigiliaId = Long.valueOf(presencaData.get("gestaoVigiliaId").toString());
                    Long cicloId = Long.valueOf(presencaData.get("cicloId").toString());
                    String status = (String) presencaData.get("status");
                    Boolean escalado = (Boolean) presencaData.get("escalado");
                    
                    System.out.println("💾 Salvando presença - Membro: " + membroId + 
                                     ", Vigília: " + gestaoVigiliaId + 
                                     ", Ciclo: " + cicloId + 
                                     ", Status: " + status + 
                                     ", Escalado: " + escalado);
                    
                    // Buscar entidades necessárias
                    Membro membro = membroService.getMembroById(membroId)
                        .orElseThrow(() -> new RuntimeException("Membro não encontrado: " + membroId));
                    GestaoVigilia gestaoVigilia = gestaoVigiliaService.buscarPorId(gestaoVigiliaId)
                        .orElseThrow(() -> new RuntimeException("Vigília não encontrada: " + gestaoVigiliaId));
                    
                    // Buscar ciclo e converter para entidade
                    var cicloDTO = cicloService.buscarPorId(cicloId)
                        .orElseThrow(() -> new RuntimeException("Ciclo não encontrado: " + cicloId));
                    Ciclo ciclo = cicloRepository.findById(cicloId)
                        .orElseThrow(() -> new RuntimeException("Ciclo não encontrado: " + cicloId));
                    
                    GestaoPresenca presenca = gestaoPresencaService.salvarOuAtualizarPresenca(
                        membro, gestaoVigilia, status, escalado, ciclo
                    );
                    presencasSalvas.add(presenca);
                    
                } catch (Exception e) {
                    System.err.println("❌ Erro ao salvar presença individual: " + e.getMessage());
                    return ResponseEntity.badRequest().body("Erro ao salvar presença: " + e.getMessage());
                }
            }
            
            System.out.println("✅ Salvamento em lote concluído! " + presencasSalvas.size() + " presenças salvas");
            return ResponseEntity.ok(Map.of(
                "message", "Presenças salvas com sucesso",
                "presencasSalvas", presencasSalvas.size(),
                "detalhes", presencasSalvas
            ));
            
        } catch (Exception e) {
            System.err.println("❌ Erro no salvamento em lote: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erro no salvamento em lote: " + e.getMessage());
        }
    }
} 