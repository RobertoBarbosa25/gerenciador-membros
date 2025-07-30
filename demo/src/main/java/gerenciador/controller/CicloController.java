package gerenciador.controller;

import gerenciador.dto.CicloDTO;
import gerenciador.dto.CicloVigiliaDTO;
import gerenciador.model.CicloVigilia;
import gerenciador.service.CicloService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ciclos")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "https://chernobyldiablo.netlify.app", "https://gerenciador-membros.onrender.com"})
public class CicloController {
    private final CicloService service;

    @Autowired
    public CicloController(CicloService service) {
        this.service = service;
    }

    @GetMapping
    public List<CicloDTO> listarTodos() {
        List<CicloDTO> ciclos = service.listarTodos();
        System.out.println("Retornando " + ciclos.size() + " ciclos");
        return ciclos;
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("CicloController está funcionando!");
    }

    @GetMapping("/ativos")
    public List<CicloDTO> listarAtivos() {
        return service.listarAtivos();
    }

    @GetMapping("/ativo")
    public ResponseEntity<CicloDTO> buscarCicloAtivo() {
        return service.buscarCicloAtivo()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CicloDTO> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/vigilias")
    public List<CicloVigilia> buscarVigiliasDoCiclo(@PathVariable Long id) {
        return service.buscarVigiliasDoCiclo(id);
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Map<String, Object> request) {
        try {
            String nome = (String) request.get("nome");
            if (nome == null || nome.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Nome do ciclo é obrigatório");
            }
            
            Object vigiliaIdsObj = request.get("vigiliaIds");
            if (vigiliaIdsObj == null) {
                return ResponseEntity.badRequest().body("Lista de vigílias é obrigatória");
            }
            
            List<Long> vigiliaIds;
            if (vigiliaIdsObj instanceof List) {
                @SuppressWarnings("unchecked")
                List<Object> rawList = (List<Object>) vigiliaIdsObj;
                vigiliaIds = rawList.stream()
                    .map(item -> {
                        if (item instanceof Number) {
                            return ((Number) item).longValue();
                        } else if (item instanceof String) {
                            return Long.parseLong((String) item);
                        }
                        throw new IllegalArgumentException("Tipo inválido para ID de vigília: " + item.getClass());
                    })
                    .toList();
            } else {
                return ResponseEntity.badRequest().body("vigiliaIds deve ser uma lista");
            }
            
            if (vigiliaIds.isEmpty()) {
                return ResponseEntity.badRequest().body("Pelo menos uma vigília deve ser selecionada");
            }
            
            if (vigiliaIds.size() > 3) {
                return ResponseEntity.badRequest().body("Máximo de 3 vigílias por ciclo");
            }
            
            CicloDTO ciclo = service.criarCiclo(nome, vigiliaIds);
            return ResponseEntity.ok(ciclo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao criar ciclo: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        try {
            service.deletarCiclo(id);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Erro: " + e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body("Erro: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Erro inesperado ao deletar ciclo " + id + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erro interno ao deletar ciclo: " + e.getMessage());
        }
    }
} 