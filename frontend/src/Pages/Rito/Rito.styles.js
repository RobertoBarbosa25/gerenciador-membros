// src/Pages/Rito/Rito.styles.ts
import styled from "@emotion/styled";
import { Box, TextField } from "@mui/material";
// import chernobylLogo from '../../Assets/chernobyl.jpg'; // Não é usado diretamente aqui, pode ser removido se não houver uso em outros styled components neste arquivo
export const BoxMembros = styled(Box)({
    display: "flex",
    flexDirection: "column", // ⭐️ ALTERAÇÃO: Para que o conteúdo dentro da BoxMembros seja vertical
    width: "550px", // ⭐️ ALTERAÇÃO CHAVE: Largura fixa para a coluna de membros
    flexShrink: 0, // ⭐️ ALTERAÇÃO CHAVE: Impede que esta box encolha
    overflowY: "auto", // Permite rolagem vertical para a lista de membros
    overflowX: "hidden", // Garante que não haja scroll horizontal aqui
    // Remova o zIndex: 10, pois não é necessário com o novo layout
    // zIndex: 10,
    // ⭐️ ADIÇÃO: Padding extra à direita para criar um espaçamento entre a lista de membros e as salas
    paddingRight: 16,
});
export const BoxRito = styled(Box)({
    display: "flex",
    flexDirection: "row", // ⭐️ ADIÇÃO: Garante que as salas dentro do BoxRito fiquem em linha
    flexGrow: 1, // ⭐️ ALTERAÇÃO CHAVE: Ocupa todo o espaço restante
    overflowX: "auto", // ⭐️ ALTERAÇÃO CHAVE: Habilita o scroll horizontal para este contêiner
    overflowY: "hidden", // Esconde scroll vertical aqui, cada sala terá o seu
    // Remova width: "100%" e gap: 16, pois o gap será adicionado diretamente às salas.
    // width: "100%",
    // gap: 16, // O gap será aplicado diretamente no map do Rito.tsx
    // ⭐️ ADIÇÃO: paddingLeft para o alinhamento com o PageWrapperBox e para o início das salas
    paddingLeft: 16,
    // ⭐️ ADIÇÃO: Para que o conteúdo dentro do BoxRito possa rolar, ele precisa ter uma altura definida.
    // Ele vai esticar para preencher a altura do PageWrapperBox.
    height: '100%',
    alignItems: 'stretch', // Garante que as salas estiquem para a altura total disponível
});
// ⭐️ REMOÇÃO: RoomBox não será mais um styled component para gerenciar altura/largura.
// Os estilos de width e height serão aplicados diretamente no Paper no Rito.tsx,
// já que o Paper é o item flexível dentro do BoxRito.
// Isso simplifica a gestão de layouts aninhados.
/*
export const RoomBox = styled(Box)({
  minWidth: 610,
  width: 'calc(50vw - 120px)',
  height: 'calc(100vh - 120px)',
  backgroundImage: `url(${chernobylLogo})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  position: "relative",
  borderRadius: "40px",
  display: "flex",
  flexDirection: "column",
  boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.7)",
  boxSizing: "border-box",
  overflow: 'hidden',
});
*/
export const WhiteTextField = styled(TextField)(({ theme }) => ({
    // ... (mantém seus estilos WhiteTextField)
    '& .MuiInputBase-input': {
        color: 'white',
    },
    '& .MuiInputLabel-root': {
        color: 'white',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'white',
        },
    },
    '& .MuiOutlinedInput-root.Mui-focused': {
        '& fieldset': {
            borderColor: 'white',
        },
    },
}));
// ⭐️ REMOÇÃO: BoxFixed não é mais necessária com o novo layout fixo via flexbox.
/*
export const BoxFixed = styled(Box)({
  position: "fixed",
  width: 610,
  left: 24,
  height: "calc(100vh - 129px)",
  zIndex: 100,
});
*/ 
