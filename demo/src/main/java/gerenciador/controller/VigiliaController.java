package gerenciador.controller;

import gerenciador.model.Partida;
import gerenciador.service.VigiliaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/vigilia")
@CrossOrigin(origins = "http://localhost:3000")
public class VigiliaController {
    private final VigiliaService vigiliaService;

    @Autowired
    public VigiliaController(VigiliaService vigiliaService) {
        this.vigiliaService = vigiliaService;
    }

    // GET /api/vigilia - lista todas as salas
    @GetMapping
    public ResponseEntity<List<Partida>> listarTodasSalas() {
        return ResponseEntity.ok(vigiliaService.listarTodasSalas());
    }

    // POST /api/vigilia/reset - reseta todas as salas
    @PostMapping("/reset")
    public ResponseEntity<Void> resetarTodasSalas() {
        vigiliaService.resetarTodasSalas();
        return ResponseEntity.ok().build();
    }

    // PUT /api/vigilia/{salaId}/add/{membroId} - adiciona membro à sala
    @PutMapping("/{salaId}/add/{membroId}")
    public ResponseEntity<Partida> adicionarMembroASala(@PathVariable Long salaId, @PathVariable Long membroId) {
        Optional<Partida> sala = vigiliaService.adicionarMembroASala(salaId, membroId);
        return sala.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/vigilia/{salaId}/remove/{membroId} - remove membro da sala
    @DeleteMapping("/{salaId}/remove/{membroId}")
    public ResponseEntity<Partida> removerMembroDaSala(@PathVariable Long salaId, @PathVariable Long membroId) {
        Optional<Partida> sala = vigiliaService.removerMembroDaSala(salaId, membroId);
        return sala.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // POST /api/vigilia/{salaId}/reset - reseta uma sala individual
    @PostMapping("/{salaId}/reset")
    public ResponseEntity<Void> resetarSala(@PathVariable Long salaId) {
        vigiliaService.resetarSala(salaId);
        return ResponseEntity.ok().build();
    }

    // POST /api/vigilia/inicializar - inicializa as salas da Vigilia
    @PostMapping("/inicializar")
    public ResponseEntity<String> inicializarSalasVigilia() {
        vigiliaService.inicializarSalasVigilia();
        return ResponseEntity.ok("Salas da Vigilia inicializadas com sucesso!");
    }
} 