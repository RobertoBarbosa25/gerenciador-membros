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
public class PartidaService {

    private final PartidaRepository partidaRepository;
    private final MembroRepository membroRepository;

    // NOVO: Definir o limite máximo de partidas
    private static final int LIMITE_MAXIMO_PARTIDAS_RITO = 10;
    private static final int LIMITE_MAXIMO_PARTIDAS_VIGILIA = 12;
    private static final String TIPO_RITO = "RITO";
    private static final String TIPO_VIGILIA = "VIGILIA";

    @Autowired
    public PartidaService(PartidaRepository partidaRepository, MembroRepository membroRepository) {
        this.partidaRepository = partidaRepository;
        this.membroRepository = membroRepository;
    }

    // --- Métodos de CRUD Básico para Partidas ---

    public List<Partida> listarTodasPartidas() {
        return partidaRepository.findAll();
    }

    public Optional<Partida> buscarPartidaPorId(Long id) {
        return partidaRepository.findById(id);
    }

    public List<Partida> listarTodasPartidasRito() {
        return partidaRepository.findAll().stream().filter(p -> TIPO_RITO.equals(p.getTipo())).toList();
    }
    public List<Partida> listarTodasPartidasVigilia() {
        return partidaRepository.findAll().stream().filter(p -> TIPO_VIGILIA.equals(p.getTipo())).toList();
    }

    @Transactional
    public Partida criarPartida(Partida partida) {
        long contagemPartidas = partidaRepository.findAll().stream().filter(p -> TIPO_RITO.equals(partida.getTipo()) ? TIPO_RITO.equals(p.getTipo()) : TIPO_VIGILIA.equals(p.getTipo())).count();
        int limite = TIPO_RITO.equals(partida.getTipo()) ? LIMITE_MAXIMO_PARTIDAS_RITO : LIMITE_MAXIMO_PARTIDAS_VIGILIA;
        if (contagemPartidas >= limite) {
            throw new IllegalStateException("O número máximo de partidas do tipo " + partida.getTipo() + " (" + limite + ") foi atingido. Não é possível criar mais partidas.");
        }
        return partidaRepository.save(partida);
    }

    @Transactional
    public void deletarPartida(Long id) {
        partidaRepository.deleteById(id);
    }

    // --- Lógica de Formação de Elenco ---

    @Transactional
    public void inicializarPartidasRito() {
        long contagemAtual = partidaRepository.findAll().stream().filter(p -> TIPO_RITO.equals(p.getTipo())).count();
        if (contagemAtual == 0) {
            for (int i = 1; i <= LIMITE_MAXIMO_PARTIDAS_RITO; i++) {
                Partida partida = new Partida("Partida " + i, TIPO_RITO);
                partidaRepository.save(partida);
            }
        } else if (contagemAtual < LIMITE_MAXIMO_PARTIDAS_RITO) {
            for (long i = contagemAtual + 1; i <= LIMITE_MAXIMO_PARTIDAS_RITO; i++) {
                Partida partida = new Partida("Partida " + i, TIPO_RITO);
                partidaRepository.save(partida);
            }
        }
    }
    @Transactional
    public void inicializarPartidasVigilia() {
        String[] nomesVigilia = {"A1","A2","A3","B1","B2","B3","C1","C2","C3","D1","D2","D3"};
        long contagemAtual = partidaRepository.findAll().stream().filter(p -> TIPO_VIGILIA.equals(p.getTipo())).count();
        if (contagemAtual == 0) {
            for (int i = 0; i < LIMITE_MAXIMO_PARTIDAS_VIGILIA; i++) {
                Partida partida = new Partida(nomesVigilia[i], TIPO_VIGILIA);
                partidaRepository.save(partida);
            }
        } else if (contagemAtual < LIMITE_MAXIMO_PARTIDAS_VIGILIA) {
            for (long i = contagemAtual; i < LIMITE_MAXIMO_PARTIDAS_VIGILIA; i++) {
                Partida partida = new Partida(nomesVigilia[(int)i], TIPO_VIGILIA);
                partidaRepository.save(partida);
            }
        }
    }


    @Transactional
    public Optional<Partida> adicionarMembroAPartida(Long partidaId, Long membroId) {
        Optional<Partida> partidaOpt = partidaRepository.findById(partidaId);
        Optional<Membro> membroOpt = membroRepository.findById(membroId);

        if (partidaOpt.isPresent() && membroOpt.isPresent()) {
            Partida partida = partidaOpt.get();
            Membro membro = membroOpt.get();

            if (partida.getMembros().size() >= partida.getCapacidadeMaximaJogadores()) {
                throw new IllegalStateException("Partida " + partida.getNome() + " já atingiu sua capacidade máxima de " + partida.getCapacidadeMaximaJogadores() + " jogadores.");
            }

            partida.adicionarMembro(membro);
            return Optional.of(partidaRepository.save(partida));
        }
        return Optional.empty();
    }

    @Transactional
    public Optional<Partida> removerMembroDaPartida(Long partidaId, Long membroId) {
        Optional<Partida> partidaOpt = partidaRepository.findById(partidaId);
        Optional<Membro> membroOpt = membroRepository.findById(membroId);

        if (partidaOpt.isPresent() && membroOpt.isPresent()) {
            Partida partida = partidaOpt.get();
            Membro membro = membroOpt.get();

            partida.removerMembro(membro);
            return Optional.of(partidaRepository.save(partida));
        }
        return Optional.empty();
    }
    @Transactional
    public Optional<Partida> atualizarNomePartida(Long id, String novoNome) {
        Optional<Partida> partidaOpt = partidaRepository.findById(id);
        if (partidaOpt.isPresent()) {
            Partida partida = partidaOpt.get();
            // Só bloqueia se já existir OUTRA partida com o mesmo nome (ignorando case)
            boolean exists = partidaRepository.findAll().stream()
                .anyMatch(p -> p.getNome().equalsIgnoreCase(novoNome) && !p.getId().equals(id));
            if (exists) {
                throw new IllegalStateException("Já existe uma partida com esse nome (ignorando maiúsculas/minúsculas).");
            }
            partida.setNome(novoNome);
            return Optional.of(partidaRepository.save(partida));
        }
        return Optional.empty();
    }
}