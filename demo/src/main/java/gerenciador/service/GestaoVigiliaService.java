package gerenciador.service;

import gerenciador.model.GestaoVigilia;
import gerenciador.model.Membro;
import gerenciador.model.Partida;
import gerenciador.repository.GestaoVigiliaRepository;
import gerenciador.repository.PartidaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;

@Service
public class GestaoVigiliaService {
    private final GestaoVigiliaRepository repository;
    private final PartidaRepository partidaRepository;

    @Autowired
    public GestaoVigiliaService(GestaoVigiliaRepository repository, PartidaRepository partidaRepository) {
        this.repository = repository;
        this.partidaRepository = partidaRepository;
    }

    public List<GestaoVigilia> listarTodas() {
        return repository.findAll();
    }

    public Optional<GestaoVigilia> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public GestaoVigilia salvar(GestaoVigilia vigilia) {
        return repository.save(vigilia);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }

    // Buscar membros escalados nas salas da vigília
    public List<Membro> buscarMembrosEscaladosNasSalas() {
        // Buscar todas as partidas do tipo VIGILIA
        List<Partida> salasVigilia = partidaRepository.findAll().stream()
            .filter(partida -> "VIGILIA".equals(partida.getTipo()))
            .collect(Collectors.toList());
        
        // Coletar todos os membros únicos das salas
        Set<Membro> membrosEscalados = salasVigilia.stream()
            .flatMap(sala -> sala.getMembros().stream())
            .collect(Collectors.toSet());
        
        // Converter para lista e ordenar por nome
        return membrosEscalados.stream()
            .sorted((m1, m2) -> m1.getName().compareToIgnoreCase(m2.getName()))
            .collect(Collectors.toList());
    }

    // Buscar todos os dados necessários de uma vez (batch request)
    public Map<String, Object> buscarDadosCompletos() {
        Map<String, Object> dadosCompletos = new HashMap<>();
        
        // Buscar vigílias
        List<GestaoVigilia> vigilias = listarTodas();
        dadosCompletos.put("vigilias", vigilias);
        
        // Buscar membros escalados nas salas da vigília
        List<Membro> membrosEscalados = buscarMembrosEscaladosNasSalas();
        dadosCompletos.put("membrosEscalados", membrosEscalados);
        
        return dadosCompletos;
    }
} 