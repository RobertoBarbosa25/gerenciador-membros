// src/Components/PageWrapper/index.tsx
import styled from "@emotion/styled";
import { Box } from "@mui/material";
import background from "../../Assets/background.jpg"

export const PageWrapperBox = styled(Box)({
  display: "flex",
  backgroundImage: `url(${background})`,
  backgroundPosition: "center center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  // ⭐️ ALTERAÇÃO: Remover justifyContent: "space-between" e gap: 24 aqui.
  // Esses serão gerenciados pelos componentes filhos ou pelo BoxRito.
  // flexDirection: "row" já é o padrão para display: "flex", mas é bom explicitar
  flexDirection: "row", // Garante que os filhos (Membros e Rito) fiquem lado a lado
  height: "calc(100vh - 64px)", // Mantém a altura total da viewport menos o header
  padding: 24, // Mantém o padding geral da página
  overflow: "hidden", // ⭐️ ALTERAÇÃO CHAVE: Oculta o scroll principal para que os filhos rolem
  width: "100%",
  // Remove essa regra genérica, pois pode interferir no layout dos filhos
  // "& > div > div": {
  //   width: "100%"
  // }
});