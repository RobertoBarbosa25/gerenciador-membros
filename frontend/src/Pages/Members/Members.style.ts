// src/Pages/Members/Members.style.ts

export const classColors: { [key: string]: string } = {
    // Cores de classe atualizadas. Sinta-se à vontade para ajustar!
    "Arcanista": "#9E2A89", // Roxo vibrante
    "Bárbaro": "#DA2929",   // Vermelho forte
    "Cavaleiro de Sangue": "#8B0000", // Marrom avermelhado escuro
    "Cruzado": "#DAA520",   // Dourado
    "Caçador de Demônios": "#32CD32", // Verde Limão
    "Necromante": "#008080", // Verde Azulado
    "Tempestário": "#00CED1", // Azul Turquesa
    "Monge": "#FFA500",     // Laranja
    "Druida": "#8B4513",     // Marrom
};

export const textFieldDarkStyle = {
    '& .MuiOutlinedInput-root': {
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        color: 'white',
        '& fieldset': {
            borderColor: '#61dafb',
        },
        '&:hover fieldset': {
            borderColor: '#61dafb',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#61dafb',
        },
    },
    '& .MuiInputLabel-root': {
        color: '#aaa',
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: '#61dafb',
    },
    input: {
        color: 'white',
        padding: '8.5px 14px', // Ajusta o padding interno para small size
        textAlign: 'center', // Adicionado para centralizar o texto no input
    },
    minWidth: '100px', // Um valor base
    maxWidth: '200px', // Um valor máximo para não esticar demais
};

export const selectDarkStyle = {
    '& .MuiOutlinedInput-root': {
        backgroundColor: 'rgba(20, 22, 25, 0.98)',
        color: 'white',
        '& fieldset': {
            borderColor: '#61dafb',
        },
        '&:hover fieldset': {
            borderColor: '#61dafb',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#61dafb',
        },
    },
    '& .MuiSelect-icon': {
        color: 'white',
    },
    '& .MuiSelect-select': {
        paddingTop: '8.5px !important',
        paddingBottom: '8.5px !important',
        minHeight: 'unset',
        backgroundColor: 'rgba(20, 22, 25, 0.98)',
        color: 'white',
    },
    '& .MuiPaper-root': {
        backgroundColor: 'rgba(20, 22, 25, 0.98)',
        color: 'white',
    },
    minWidth: '110px',
};

export const classSelectFormControlStyle = (memberClass: string | undefined) => ({
    backgroundColor: memberClass ? classColors[memberClass] || 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.4)',
    borderRadius: '4px',
    minWidth: '110px',
    maxWidth: '150px',
});

export const claSelectFormControlStyle = {
    backgroundColor: '#555',
    borderRadius: '4px',
    minWidth: '110px',
    maxWidth: '150px',
};

export const buttonStyle = {
    color: 'white',
    borderColor: '#61dafb',
    '&:hover': {
        backgroundColor: 'rgba(97, 218, 251, 0.1)',
        borderColor: '#61dafb',
    },
};

export const baseTableCellSx = {
    backgroundColor: '#424242',
    color: 'white',
    fontWeight: 'bold',
    paddingLeft: '20px',
    paddingRight: '10px',
};

export const classHeaderCellStyle = {
    ...baseTableCellSx,
    textAlign: 'center',
};

export const classCellStyles = {
    ...baseTableCellSx,
    textAlign: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    minWidth: '130px',
    maxWidth: '150px',
};

// --- NOVOS ESTILOS PARA CENTRALIZAR A COLUNA DE RESSONÂNCIA ---
export const resonanceHeaderCellStyle = {
    ...baseTableCellSx,
    textAlign: 'center', // Centraliza o texto do cabeçalho de Ressonância
};

export const resonanceCellStyles = {
    ...baseTableCellSx,
    textAlign: 'center', // Centraliza o texto da célula de dados de Ressonância
    fontWeight: 'normal', // Remove o negrito das células de dados
    backgroundColor: 'transparent', // Garante que o background seja transparente
};
// --- FIM DOS NOVOS ESTILOS ---

export const searchTextFieldStyle = {
    '& .MuiInputLabel-root': { color: 'white' },
    '& .MuiInputBase-input': { color: 'white' },
    '& .MuiOutlinedInput-root': {
        '& fieldset': { borderColor: '#61dafb' },
        '&:hover fieldset': { borderColor: '#61dafb' },
        '&.Mui-focused fieldset': { borderColor: '#61dafb' },
    },
};

export const clearButtonStyle = {
    backgroundColor: '#f44336',
    color: 'white',
    '&:hover': {
        backgroundColor: '#d32f2f',
    },
};

export const memberListBoxStyle = {
    backgroundColor: '#333',
    padding: 4,
    borderRadius: 2,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
    width: '100%',
    minHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
};

export const memberListTitleStyle = {
    color: '#61dafb',
    textAlign: 'center',
    marginBottom: 3,
};

export const saveButtonStyle = {
    backgroundColor: '#4CAF50',
    color: 'white',
    marginRight: 1,
    '&:hover': {
        backgroundColor: '#45a049',
    },
};

export const cancelButtonStyle = {
    backgroundColor: '#f44336',
    color: 'white',
    '&:hover': {
        backgroundColor: '#d32f2f',
    },
};

export const editButtonStyle = {
    backgroundColor: '#2196F3',
    color: 'white',
    marginRight: 1,
    '&:hover': {
        backgroundColor: '#1976D2',
    },
};

export const removeButtonStyle = {
    backgroundColor: '#f44336',
    color: 'white',
    '&:hover': {
        backgroundColor: '#d32f2f',
    },
};

export const clearAllButtonStyle = {
    backgroundColor: '#D32F2F',
    color: 'white',
    '&:hover': {
        backgroundColor: '#B71C1C',
    },
};