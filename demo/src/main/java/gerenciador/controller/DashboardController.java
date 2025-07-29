package gerenciador.controller;

import gerenciador.service.MembroService;
import gerenciador.service.PartidaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "https://chernobyldiablo.netlify.app"})
public class DashboardController {

    private final MembroService membroService;
    private final PartidaService partidaService;

    @Autowired
    public DashboardController(MembroService membroService, PartidaService partidaService) {
        this.membroService = membroService;
        this.partidaService = partidaService;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        try {
            // Estatísticas de membros
            stats.put("totalMembros", membroService.getTotalMembros());
            stats.put("membrosPorClasse", membroService.getMembrosPorClasse());
            stats.put("membrosPorCla", membroService.getMembrosPorCla());
            stats.put("resonanciaMedia", membroService.getResonanciaMedia());
            stats.put("resonanciaMaxima", membroService.getResonanciaMaxima());
            
            // Estatísticas de partidas
            stats.put("totalPartidasRito", partidaService.getTotalPartidasRito());
            stats.put("totalPartidasVigilia", partidaService.getTotalPartidasVigilia());
            stats.put("partidasOcupadas", partidaService.getPartidasOcupadas());
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            stats.put("error", "Erro ao carregar estatísticas: " + e.getMessage());
            return ResponseEntity.status(500).body(stats);
        }
    }
} 