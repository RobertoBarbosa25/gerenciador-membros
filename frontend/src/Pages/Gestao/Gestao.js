import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Select, MenuItem, FormControl, InputLabel, TextField, } from '@mui/material';
import { PageWrapper } from '../../Components/PageWrapper';
const getPlayersFromLocalStorage = () => {
    const savedPlayers = localStorage.getItem('players');
    return savedPlayers ? JSON.parse(savedPlayers) : [];
};
const getAttendanceFromLocalStorage = () => {
    const savedAttendance = localStorage.getItem('attendance');
    return savedAttendance ? JSON.parse(savedAttendance) : {};
};
const exportToCSV = (attendanceData) => {
    const csvRows = [];
    // Cabeçalhos do CSV
    csvRows.push(['Vigília', 'Jogador', 'Status', 'Faltas', 'Presenças'].join(','));
    // Obter todos os jogadores
    const allPlayers = getPlayersFromLocalStorage();
    // Iterar sobre todos os jogadores e suas presenças
    allPlayers.forEach((player) => {
        for (const vigil in attendanceData) {
            const attendance = attendanceData[vigil][player.name];
            const faltas = getFaltasCount(player.name, attendanceData); // Chame a função para contar faltas
            const presencas = getPresencasCount(player.name, attendanceData); // Chame a função para contar presenças
            const status = attendance && attendance.escalado ? 'Escalado' : 'Não escalado'; // Atualizado para refletir o novo status
            csvRows.push([vigil, player.name, status, faltas, presencas].join(','));
        }
    });
    // Criar um blob para o arquivo CSV
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    // Criar um link para download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'historico_presenca.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};
// Funções para contar faltas e presenças
const getFaltasCount = (playerName, attendanceData) => {
    return Object.values(attendanceData).reduce((count, vigil) => {
        if (vigil[playerName]?.status === 'faltou') {
            return count + 1;
        }
        return count;
    }, 0);
};
const getPresencasCount = (playerName, attendanceData) => {
    return Object.values(attendanceData).reduce((count, vigil) => {
        if (vigil[playerName]?.status === 'presente') {
            return count + 1;
        }
        return count;
    }, 0);
};
export const Gestao = () => {
    const [currentVigil, setCurrentVigil] = useState('Vigília 1');
    const [attendanceData, setAttendanceData] = useState(getAttendanceFromLocalStorage());
    const [isSaved, setIsSaved] = useState(true);
    const allPlayers = getPlayersFromLocalStorage();
    const [searchQuery, setSearchQuery] = useState(''); // Estado para o campo de pesquisa
    const handleAttendance = (playerName, attended) => {
        setAttendanceData((prev) => {
            const updatedVigil = { ...(prev[currentVigil] || {}) };
            updatedVigil[playerName] = {
                status: attended ? 'presente' : 'faltou',
                escalado: true,
            };
            return { ...prev, [currentVigil]: updatedVigil };
        });
        setIsSaved(false);
    };
    const handleSaveAttendance = () => {
        localStorage.setItem('attendance', JSON.stringify(attendanceData));
        setIsSaved(true);
        alert(`Presenças salvas para ${currentVigil}!`);
    };
    const handleResetAttendance = () => {
        const confirmReset = window.confirm("Tem certeza que deseja resetar todas as presenças?");
        if (confirmReset) {
            setAttendanceData({});
            localStorage.setItem('attendance', JSON.stringify({}));
            alert('Todas as presenças foram resetadas!');
        }
    };
    // Filtrando jogadores com base na pesquisa
    const filteredPlayers = allPlayers.filter((player) => player.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return (_jsx(PageWrapper, { children: _jsxs(Box, { component: Paper, p: 3, width: "100%", height: "100%", overflow: "auto", sx: { backgroundColor: 'rgba(0, 0, 0, 0.5)' }, children: [_jsxs(Typography, { variant: "h6", gutterBottom: true, sx: { color: 'white' }, children: ["Hist\u00F3rico de Presen\u00E7a - ", currentVigil] }), _jsx(Button, { onClick: () => exportToCSV(attendanceData), variant: "contained", color: "info", sx: { marginBottom: 2 }, children: "Exportar Hist\u00F3rico em CSV" }), _jsxs(Box, { sx: { display: 'flex', gap: 1, marginBottom: 2 }, children: [_jsx(TextField, { variant: "outlined", placeholder: "Pesquisar por nome", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), sx: {
                                width: '250px', // Ajustando a largura do campo de pesquisa
                                backgroundColor: 'white', // Fundo branco
                                boxShadow: 1, // Sombra para destaque
                                borderRadius: 1, // Bordas arredondadas
                            } }), _jsxs(FormControl, { sx: { width: '115px' }, children: [" ", _jsx(InputLabel, { id: "vigil-select-label", children: "Vig\u00EDlia" }), _jsxs(Select, { labelId: "vigil-select-label", value: currentVigil, onChange: (e) => {
                                        const newVigil = e.target.value;
                                        if (!isSaved) {
                                            const confirmReset = window.confirm("Você não salvou as alterações. Deseja resetar a Vigília 1?");
                                            if (!confirmReset)
                                                return;
                                            setAttendanceData((prev) => {
                                                const updatedData = { ...prev };
                                                delete updatedData["Vigília 1"];
                                                localStorage.setItem('attendance', JSON.stringify(updatedData));
                                                return updatedData;
                                            });
                                        }
                                        setIsSaved(true);
                                        setCurrentVigil(newVigil);
                                    }, children: [_jsx(MenuItem, { value: "Vig\u00EDlia 1", children: "Vig\u00EDlia 1" }), _jsx(MenuItem, { value: "Vig\u00EDlia 2", children: "Vig\u00EDlia 2" }), _jsx(MenuItem, { value: "Vig\u00EDlia 3", children: "Vig\u00EDlia 3" })] })] })] }), _jsxs(Box, { sx: { marginBottom: 2 }, children: [_jsx(Button, { onClick: handleSaveAttendance, variant: "contained", color: "success", sx: { marginRight: 1 }, children: "Salvar" }), _jsx(Button, { onClick: handleResetAttendance, variant: "contained", color: "error", children: "Resetar" })] }), _jsx(TableContainer, { children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { sx: { color: 'white', fontWeight: 'bold' }, children: "Nome" }), _jsx(TableCell, { sx: { color: 'white', fontWeight: 'bold' }, children: "Status" }), _jsx(TableCell, { sx: { color: 'white', fontWeight: 'bold' }, children: "Faltas" }), _jsx(TableCell, { sx: { color: 'white', fontWeight: 'bold' }, children: "Presen\u00E7as" }), _jsx(TableCell, { sx: { color: 'white', fontWeight: 'bold' }, children: "A\u00E7\u00F5es" })] }) }), _jsx(TableBody, { children: filteredPlayers.map((player) => (_jsxs(TableRow, { children: [_jsx(TableCell, { sx: { color: 'white' }, children: player.name }), _jsx(TableCell, { sx: { color: attendanceData[currentVigil]?.[player.name]?.escalado ? '#66ff66' : 'white' }, children: attendanceData[currentVigil]?.[player.name]?.escalado ? 'Escalado' : 'Não escalado' }), _jsx(TableCell, { sx: { color: 'white' }, children: getFaltasCount(player.name, attendanceData) }), _jsx(TableCell, { sx: { color: 'white' }, children: getPresencasCount(player.name, attendanceData) }), _jsxs(TableCell, { children: [_jsx(Button, { variant: "contained", color: "primary", onClick: () => handleAttendance(player.name, true), sx: { marginRight: 1 }, children: "Presente" }), _jsx(Button, { variant: "contained", color: "secondary", onClick: () => handleAttendance(player.name, false), children: "Faltou" })] })] }, player.name))) })] }) })] }) }));
};
