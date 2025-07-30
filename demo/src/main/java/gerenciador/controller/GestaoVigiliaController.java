package gerenciador.controller;

import gerenciador.model.GestaoVigilia;
import gerenciador.service.GestaoVigiliaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/gestao/vigilias")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "https://chernobyldiablo.netlify.app", "https://gerenciador-membros.onrender.com"})
public class GestaoVigiliaController {
    private final GestaoVigiliaService service;

    @Autowired
    public GestaoVigiliaController(GestaoVigiliaService service) {
        this.service = service;
    }

    @GetMapping
    public List<GestaoVigilia> listarTodas() {
        return service.listarTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<GestaoVigilia> buscarPorId(@PathVariable Long id) {
        Optional<GestaoVigilia> vigilia = service.buscarPorId(id);
        return vigilia.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public GestaoVigilia criar(@RequestBody GestaoVigilia vigilia) {
        return service.salvar(vigilia);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.ok().build();
    }

    // GET /api/gestao/vigilias/membros-escalados - busca membros escalados nas salas da vigília
    @GetMapping("/membros-escalados")
    public ResponseEntity<?> buscarMembrosEscalados() {
        try {
            return ResponseEntity.ok(service.buscarMembrosEscaladosNasSalas());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao buscar membros escalados: " + e.getMessage());
        }
    }

    // GET /api/gestao/vigilias/dados-completos - busca todos os dados necessários de uma vez
    @GetMapping("/dados-completos")
    public ResponseEntity<?> buscarDadosCompletos() {
        try {
            return ResponseEntity.ok(service.buscarDadosCompletos());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao buscar dados completos: " + e.getMessage());
        }
    }
} 