# Página de Gestão de Membros

Este módulo permite visualizar, filtrar, editar e remover membros do sistema.

## Funcionalidades

- **Listagem de membros** com paginação, ordenação e filtros por nome, classe e clã.
- **Edição inline** dos dados do membro (nome, classe, ressonância, telefone, Discord, clã).
- **Remoção de membros** com confirmação.
- **Limpeza total** da base de membros.
- **Feedback visual** para todas as ações (sucesso, erro, loading).
- **Acessibilidade**: navegação por teclado, labels e feedbacks para leitores de tela.

## Estrutura dos Componentes

- `Members.tsx`: Componente principal, gerencia estado, busca, filtros e renderização.
- `MembersFilters.tsx`: Filtros de busca, classe e clã.
- `MembersTable` (sugestão): Tabela de membros, cabeçalho e corpo.
- `ConfirmDialog`: Diálogo de confirmação para remoção/limpeza.
- `Members.style.ts`: Estilos customizados e centralizados.

## Principais Hooks e Lógica

- **useEffect**: Carrega membros ao montar o componente.
- **useMemo**: Otimiza filtragem, ordenação e paginação.
- **useCallback**: Evita recriação de funções em cada render.
- **useAnimatedCounter**: Animação para média de ressonância.

## Como adicionar um novo membro?

A adição de membros é feita via página de registro. Esta página é focada em gestão e manutenção dos membros já cadastrados.

## Como alterar as opções de classe ou clã?

Edite os arrays `CLASS_OPTIONS` e `CLA_OPTIONS` em `src/Types/Rank.constants.ts`. Os tipos associados estão em `src/Types/Rank.types.ts`.

## Observações

- O componente está preparado para integração com API RESTful.
- Mensagens de erro e sucesso são exibidas via Snackbar.
- O layout é responsivo e adaptado para diferentes tamanhos de tela.

---

> Para dúvidas ou sugestões, abra uma issue ou entre em contato com o time de desenvolvimento.
