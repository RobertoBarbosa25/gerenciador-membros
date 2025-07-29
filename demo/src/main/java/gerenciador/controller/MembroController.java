package gerenciador.controller;

import gerenciador.model.Membro;
import gerenciador.repository.MembroRepository;
import gerenciador.service.MembroService; // <--- IMPORTANTE: Importe o MembroService
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/membros")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "https://chernobyldiablo.netlify.app"})
@Tag(name = "Membros", description = "Endpoints para gerenciamento de membros do sistema")
public class MembroController {

    // --- MUDANÇAS AQUI ---
    // Injete o MembroRepository (se ainda precisar diretamente, mas o serviço é melhor)
    // Injete o MembroService
    private final MembroService membroService; // <--- DECLARAÇÃO DO CAMPO DO SERVIÇO

    @Autowired // <--- ANOTAÇÃO PARA INJEÇÃO DE DEPENDÊNCIA VIA CONSTRUTOR
    public MembroController(MembroService membroService, MembroRepository membroRepository) {
        this.membroService = membroService;
    }
    // --- FIM DAS MUDANÇAS ---

    // Endpoint para LISTAR todos os membros (mantido para compatibilidade)
    @GetMapping
    public List<Membro> getAllMembros() {
        return membroService.getAllMembros();
    }

    // NOVO: Endpoint paginado para melhor performance
    @GetMapping("/paginated")
    @Operation(summary = "Listar membros com paginação", description = "Retorna membros paginados para melhor performance")
    public ResponseEntity<Page<Membro>> getMembrosPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? 
            Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        
        Page<Membro> membros = membroService.getMembrosPaginated(pageable);
        return ResponseEntity.ok(membros);
    }

    // Endpoint para OBTER um membro por ID
    @GetMapping("/{id}")
    public ResponseEntity<Membro> getMembroById(@PathVariable Long id) {
        Optional<Membro> membro = membroService.getMembroById(id); // <--- CHAME O SERVIÇO
        return membro.map(ResponseEntity::ok)
                     .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Endpoint para CRIAR um novo membro
    @PostMapping
    public ResponseEntity<Membro> createMembro(@RequestBody Membro membro) {
        Membro savedMembro = membroService.saveMembro(membro); // <--- CHAME O SERVIÇO
        return ResponseEntity.status(HttpStatus.CREATED).body(savedMembro);
    }

    // Endpoint para ATUALIZAR um membro existente
    @PutMapping("/{id}")
    public ResponseEntity<Membro> updateMembro(@PathVariable Long id, @RequestBody Membro membroDetails) {
        try {
            Membro updatedMembro = membroService.updateMembro(id, membroDetails); // <--- CHAME O SERVIÇO
            return ResponseEntity.ok(updatedMembro);
        } catch (RuntimeException e) { 
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoint para DELETAR um membro
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMembro(@PathVariable Long id) {
        try {
            membroService.deleteMembro(id); 
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) { 
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Buscar membros com filtros", description = "Busca membros por nome, classe e clã. Todos os parâmetros são opcionais e podem ser combinados.")
    @GetMapping("/buscar")
    public List<Membro> searchMembros(@RequestParam(required = false) String name,
                                      @RequestParam(required = false) String memberClass,
                                      @RequestParam(required = false) String cla) {
        return membroService.searchMembros(name, memberClass, cla);
    }

    // NOVO: Busca paginada com filtros
    @GetMapping("/buscar/paginated")
    @Operation(summary = "Buscar membros com filtros e paginação", description = "Busca paginada de membros com filtros")
    public ResponseEntity<Page<Membro>> searchMembrosPaginated(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String memberClass,
            @RequestParam(required = false) String cla,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "name"));
        Page<Membro> membros = membroService.searchMembrosPaginated(name, memberClass, cla, pageable);
        return ResponseEntity.ok(membros);
    }

    // Endpoint para importação em lote (já implementado)
    @PostMapping("/batch")
    public ResponseEntity<MembroService.BatchImportResult> importMembrosBatch(@RequestBody List<Membro> membros) {
        MembroService.BatchImportResult result = membroService.importMembrosBatch(membros);
        return ResponseEntity.ok(result);
    }

    // NOVO: Endpoint para exportar membros em CSV
    @GetMapping("/export/csv")
    @Operation(summary = "Exportar membros em CSV", description = "Exporta todos os membros em formato CSV")
    public ResponseEntity<String> exportMembrosCSV() {
        try {
            String csvContent = membroService.exportMembrosToCSV();
            return ResponseEntity.ok()
                .header("Content-Type", "text/csv")
                .header("Content-Disposition", "attachment; filename=\"membros.csv\"")
                .body(csvContent);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erro ao exportar CSV: " + e.getMessage());
        }
    }

    @DeleteMapping("/all")
    public ResponseEntity<Void> deleteAllMembros() {
        try {
            membroService.deleteAllMembros(); 
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            System.err.println("Erro ao tentar deletar todos os membros: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .header("X-Error-Message", e.getMessage())
                .build();
        }
    }
}