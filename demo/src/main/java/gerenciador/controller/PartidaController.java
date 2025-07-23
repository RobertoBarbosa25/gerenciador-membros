package gerenciador.controller;

import gerenciador.model.Partida;
import gerenciador.service.PartidaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/partidas")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Partidas (Rito)", description = "Endpoints para gerenciamento de partidas do Rito")
public class PartidaController {

    private final PartidaService partidaService;

    @Autowired
    public PartidaController(PartidaService partidaService) {
        this.partidaService = partidaService;
    }

    @Operation(summary = "Listar todas as partidas do Rito", description = "Retorna todas as partidas cadastradas do Rito.")
    @GetMapping
    public ResponseEntity<List<Partida>> listarTodasPartidas() {
        List<Partida> partidas = partidaService.listarTodasPartidas();
        return ResponseEntity.ok(partidas);
    }

    @Operation(summary = "Buscar partida por ID", description = "Retorna uma partida do Rito pelo ID.")
    @GetMapping("/{id}")
    public ResponseEntity<Partida> buscarPartidaPorId(@PathVariable Long id) {
        Optional<Partida> partida = partidaService.buscarPartidaPorId(id);
        return partida.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Atualizar nome da partida", description = "Atualiza o nome de uma partida do Rito pelo ID.")
    @PutMapping("/{id}/nome") // Use um endpoint mais específico para atualização de nome
    public ResponseEntity<Partida> atualizarNomePartida(@PathVariable Long id, @RequestBody String novoNome) {
        Optional<Partida> partidaAtualizada = partidaService.atualizarNomePartida(id, novoNome);
        return partidaAtualizada.map(ResponseEntity::ok)
                                .orElse(ResponseEntity.notFound().build());
    }

    // --- Endpoints para Gestão de Elencos ---

    @Operation(summary = "Inicializar partidas do Rito", description = "Cria as 10 partidas iniciais do Rito, se não existirem.")
    // Endpoint para inicializar as 10 partidas (chamar apenas uma vez)
    @PostMapping("/inicializar")
    public ResponseEntity<String> inicializarPartidas() {
        partidaService.inicializarPartidasRito();
        return ResponseEntity.ok("Partidas iniciais verificadas/criadas com sucesso!");
    }

    @Operation(summary = "Adicionar membro à partida", description = "Adiciona um membro a uma partida do Rito.")
    // Endpoint para adicionar um membro a uma partida
    @PutMapping("/{partidaId}/membros/{membroId}")
    public ResponseEntity<Partida> adicionarMembroAPartida(@PathVariable Long partidaId, @PathVariable Long membroId) {
        try {
            Optional<Partida> partidaAtualizada = partidaService.adicionarMembroAPartida(partidaId, membroId);
            return partidaAtualizada.map(ResponseEntity::ok)
                                    .orElse(ResponseEntity.notFound().build());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @Operation(summary = "Remover membro da partida", description = "Remove um membro de uma partida do Rito.")
    // Endpoint para remover um membro de uma partida
    @DeleteMapping("/{partidaId}/membros/{membroId}")
    public ResponseEntity<Partida> removerMembroDaPartida(@PathVariable Long partidaId, @PathVariable Long membroId) {
        Optional<Partida> partidaAtualizada = partidaService.removerMembroDaPartida(partidaId, membroId);
        return partidaAtualizada.map(ResponseEntity::ok)
                                .orElse(ResponseEntity.notFound().build());
    }
}