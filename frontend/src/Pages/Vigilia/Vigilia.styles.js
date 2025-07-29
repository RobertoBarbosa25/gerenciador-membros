import styled from "@emotion/styled";
import { Box, TableRow, TableCell, Table } from "@mui/material";
import chernobylLogo from '../../Assets/chernobyl.jpg';
// Box que envolve as salas
export const BoxVigilia = styled(Box)({
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)", // 3 colunas para um layout 4x3
    gap: "8px", // Espaço entre as salas
    width: "100%",
    maxWidth: "1900px", // Define uma largura máxima para o bloco de salas
    margin: "0 auto", // Centraliza as salas
    padding: "16px",
    overflowX: "auto",
});
// Cartão do jogador
export const PlayerCard = styled(Box)({
    display: "flex",
    flexDirection: "column-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    height: "500px",
    minWidth: "160px",
    backgroundColor: "#f0f0f0",
    backgroundImage: `url(${chernobylLogo})`, // Aqui usamos a importação da imagem
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "8px",
    overflowY: "auto",
    boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.7), 0 0 15px rgba(0, 0, 0, 0.3)", // Sombra interna e externa
    boxSizing: "border-box",
});
// Ajustando os elementos de texto e botões dentro de cada sala
export const RoomTitle = styled(Box)({
    display: "flex",
    justifyContent: "overflow-position",
    alignItems: "stretch",
    width: "100%",
    padding: "1px 0",
    fontSize: "1px",
});
// Box para os membros
export const BoxMembros = styled(Box)({
    display: "flex",
    flexDirection: "row",
    width: "600px",
    zIndex: 10,
});
// Estilos para a tabela
export const StyledTable = styled(Table)({
    width: "100%",
    borderCollapse: "collapse",
});
// Estilos para as células da tabela
export const TableCellMod = styled(TableCell)({
    padding: "10px", // Padding das células
    textAlign: "left", // Alinhamento do texto
    border: "1px solid #ddd", // Cor da borda das células
    fontSize: "14px", // Tamanho da fonte
    color: "inherit", // Manter a cor padrão
});
// Estilos para as linhas da tabela
export const TableRowMod = styled(TableRow)({
    "&:nth-of-type(even)": {
        backgroundColor: "#f2f2f2", // Cor de fundo para linhas pares
    },
    "& td": {
        padding: "10px 15px", // Padding específico para as células
    },
    "& th": {
        padding: "10px 15px", // Padding específico para cabeçalhos
        fontWeight: "bold", // Negrito nos cabeçalhos
    },
});
