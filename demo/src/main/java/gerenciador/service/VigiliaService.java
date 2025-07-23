package gerenciador.service;

import gerenciador.model.Membro;
import gerenciador.model.Partida;
import gerenciador.repository.MembroRepository;
import gerenciador.repository.PartidaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class VigiliaService {
    private final PartidaRepository partidaRepository;
    private final MembroRepository membroRepository;
    private static final String TIPO_VIGILIA = "VIGILIA";

    @Autowired
    private PartidaService partidaService;

    @Autowired
    public VigiliaService(PartidaRepository partidaRepository, MembroRepository membroRepository) {
        this.partidaRepository = partidaRepository;
        this.membroRepository = membroRepository;
    }

    public List<Partida> listarTodasSalas() {
        return partidaRepository.findAll().stream().filter(p -> TIPO_VIGILIA.equals(p.getTipo())).toList();
    }

    @Transactional
    public void resetarTodasSalas() {
        List<Partida> salas = partidaRepository.findAll().stream().filter(p -> TIPO_VIGILIA.equals(p.getTipo())).toList();
        for (Partida sala : salas) {
            sala.getMembros().clear();
            partidaRepository.save(sala);
        }
    }

    @Transactional
    public Optional<Partida> adicionarMembroASala(Long salaId, Long membroId) {
        Optional<Partida> salaOpt = partidaRepository.findById(salaId).filter(s -> TIPO_VIGILIA.equals(s.getTipo()));
        Optional<Membro> membroOpt = membroRepository.findById(membroId);
        if (salaOpt.isPresent() && membroOpt.isPresent()) {
            Partida sala = salaOpt.get();
            Membro membro = membroOpt.get();
            if (sala.getMembros().size() >= sala.getCapacidadeMaximaJogadores()) {
                throw new IllegalStateException("Sala já atingiu sua capacidade máxima.");
            }
            sala.adicionarMembro(membro);
            return Optional.of(partidaRepository.save(sala));
        }
        return Optional.empty();
    }

    @Transactional
    public Optional<Partida> removerMembroDaSala(Long salaId, Long membroId) {
        Optional<Partida> salaOpt = partidaRepository.findById(salaId).filter(s -> TIPO_VIGILIA.equals(s.getTipo()));
        Optional<Membro> membroOpt = membroRepository.findById(membroId);
        if (salaOpt.isPresent() && membroOpt.isPresent()) {
            Partida sala = salaOpt.get();
            Membro membro = membroOpt.get();
            sala.removerMembro(membro);
            return Optional.of(partidaRepository.save(sala));
        }
        return Optional.empty();
    }

    @Transactional
    public void resetarSala(Long salaId) {
        Optional<Partida> salaOpt = partidaRepository.findById(salaId).filter(s -> TIPO_VIGILIA.equals(s.getTipo()));
        if (salaOpt.isPresent()) {
            Partida sala = salaOpt.get();
            sala.getMembros().clear();
            partidaRepository.save(sala);
        }
    }

    public void inicializarSalasVigilia() {
        partidaService.inicializarPartidasVigilia();
    }
} 