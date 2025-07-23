import React, { useState } from 'react';
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    TextField,
} from '@mui/material';
import { Player } from '../../Types/Rank';
import { PageWrapper } from '../../Components/PageWrapper';

// Definindo os tipos para os dados de presença
type Attendance = {
    status: 'presente' | 'faltou' | undefined;
    escalado: boolean;
};

type AttendanceData = {
    [vigil: string]: {
        [playerName: string]: Attendance;
    };
};

const getPlayersFromLocalStorage = (): Player[] => {
    const savedPlayers = localStorage.getItem('players');
    return savedPlayers ? JSON.parse(savedPlayers) : [];
};

const getAttendanceFromLocalStorage = (): AttendanceData => {
    const savedAttendance = localStorage.getItem('attendance');
    return savedAttendance ? JSON.parse(savedAttendance) : {};
};

const exportToCSV = (attendanceData: AttendanceData) => {
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
const getFaltasCount = (playerName: string, attendanceData: AttendanceData) => {
    return Object.values(attendanceData).reduce((count, vigil) => {
        if (vigil[playerName]?.status === 'faltou') {
            return count + 1;
        }
        return count;
    }, 0);
};

const getPresencasCount = (playerName: string, attendanceData: AttendanceData) => {
    return Object.values(attendanceData).reduce((count, vigil) => {
        if (vigil[playerName]?.status === 'presente') {
            return count + 1;
        }
        return count;
    }, 0);
};

export const Gestao = () => {
    const [currentVigil, setCurrentVigil] = useState<string>('Vigília 1');
    const [attendanceData, setAttendanceData] = useState<AttendanceData>(getAttendanceFromLocalStorage());
    const [isSaved, setIsSaved] = useState(true);
    const allPlayers = getPlayersFromLocalStorage();
    const [searchQuery, setSearchQuery] = useState<string>(''); // Estado para o campo de pesquisa

    const handleAttendance = (playerName: string, attended: boolean) => {
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
    const filteredPlayers = allPlayers.filter((player) =>
        player.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <PageWrapper>
            <Box component={Paper} p={3} width="100%" height="100%" overflow="auto" sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                    Histórico de Presença - {currentVigil}
                </Typography>

                {/* Botão para exportar histórico em CSV */}
                <Button
                    onClick={() => exportToCSV(attendanceData)}
                    variant="contained"
                    color="info"
                    sx={{ marginBottom: 2 }}
                >
                    Exportar Histórico em CSV
                </Button>

                {/* Container para o campo de pesquisa e select */}
                <Box sx={{ display: 'flex', gap: 1, marginBottom: 2 }}>
                    {/* Campo de pesquisa adicionado */}
                    <TextField
                        variant="outlined"
                        placeholder="Pesquisar por nome"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{
                            width: '250px', // Ajustando a largura do campo de pesquisa
                            backgroundColor: 'white', // Fundo branco
                            boxShadow: 1, // Sombra para destaque
                            borderRadius: 1, // Bordas arredondadas
                        }}
                    />

                    {/* Seletor de vigília */}
                    <FormControl sx={{ width: '115px' }}> {/* Ajustando a largura do select de vigília */}
                        <InputLabel id="vigil-select-label">Vigília</InputLabel>
                        <Select
                            labelId="vigil-select-label"
                            value={currentVigil}
                            onChange={(e) => {
                                const newVigil = e.target.value as string;

                                if (!isSaved) {
                                    const confirmReset = window.confirm("Você não salvou as alterações. Deseja resetar a Vigília 1?");
                                    if (!confirmReset) return;
                                    setAttendanceData((prev) => {
                                        const updatedData = { ...prev };
                                        delete updatedData["Vigília 1"];
                                        localStorage.setItem('attendance', JSON.stringify(updatedData));
                                        return updatedData;
                                    });
                                }

                                setIsSaved(true);
                                setCurrentVigil(newVigil);
                            }}
                        >
                            <MenuItem value="Vigília 1">Vigília 1</MenuItem>
                            <MenuItem value="Vigília 2">Vigília 2</MenuItem>
                            <MenuItem value="Vigília 3">Vigília 3</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {/* Botões */}
                <Box sx={{ marginBottom: 2 }}>
                    <Button onClick={handleSaveAttendance} variant="contained" color="success" sx={{ marginRight: 1 }}>
                        Salvar
                    </Button>
                    <Button onClick={handleResetAttendance} variant="contained" color="error">
                        Resetar
                    </Button>
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nome</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Faltas</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Presenças</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredPlayers.map((player) => (
                                <TableRow key={player.name}>
                                    <TableCell sx={{ color: 'white' }}>{player.name}</TableCell>
                                    <TableCell sx={{ color: attendanceData[currentVigil]?.[player.name]?.escalado ? '#66ff66' : 'white' }}>
                                        {attendanceData[currentVigil]?.[player.name]?.escalado ? 'Escalado' : 'Não escalado'}
                                    </TableCell>
                                    <TableCell sx={{ color: 'white' }}>{getFaltasCount(player.name, attendanceData)}</TableCell>
                                    <TableCell sx={{ color: 'white' }}>{getPresencasCount(player.name, attendanceData)}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleAttendance(player.name, true)}
                                            sx={{ marginRight: 1 }}
                                        >
                                            Presente
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleAttendance(player.name, false)}
                                        >
                                            Faltou
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </PageWrapper>
    );
};
