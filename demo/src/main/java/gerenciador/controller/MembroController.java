package gerenciador.controller;

import gerenciador.model.Membro;
import gerenciador.repository.MembroRepository;
import gerenciador.service.MembroService; // <--- IMPORTANTE: Importe o MembroService
import org.springframework.beans.factory.annotation.Autowired;
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


    // Endpoint para LISTAR todos os membros
    @GetMapping
    public List<Membro> getAllMembros() {
        return membroService.getAllMembros(); // <--- CHAME O SERVIÇO AQUI TAMBÉM
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