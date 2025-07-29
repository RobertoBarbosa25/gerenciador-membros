import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Recycling } from '@mui/icons-material';
import { movePlayer, MAX_ATTACK_PLAYERS, MAX_DEFENSE_PLAYERS, normalizeString } from './Towers.utils';
import { PageWrapper } from '../../Components/PageWrapper';
const CustomDroppable = ({ droppableId, children }) => (_jsx(Droppable, { droppableId: droppableId, children: (provided) => (_jsxs("div", { ref: provided.innerRef, ...provided.droppableProps, children: [children, provided.placeholder] })) }));
export const Towers = () => {
    const [allPlayers, setAllPlayers] = useState([]);
    const [attackTower, setAttackTower] = useState([]);
    const [defenseTower, setDefenseTower] = useState([]);
    const [isAscendingClass, setIsAscendingClass] = useState(true);
    const [isAscendingResonance, setIsAscendingResonance] = useState(true);
    const [isAscendingName, setIsAscendingName] = useState(true);
    useEffect(() => {
        const loadPlayers = () => {
            const savedPlayers = localStorage.getItem('players');
            const playersFromStorage = savedPlayers ? JSON.parse(savedPlayers) : [];
            const savedAttackTower = localStorage.getItem('attackTower');
            const attackFromStorage = savedAttackTower ? JSON.parse(savedAttackTower) : [];
            const savedDefenseTower = localStorage.getItem('defenseTower');
            const defenseFromStorage = savedDefenseTower ? JSON.parse(savedDefenseTower) : [];
            setAttackTower(attackFromStorage);
            setDefenseTower(defenseFromStorage);
            setAllPlayers(playersFromStorage.filter(player => !attackFromStorage.find((p) => p.name === player.name) &&
                !defenseFromStorage.find((d) => d.name === player.name)));
        };
        loadPlayers();
    }, []);
    const onDragEnd = (result) => {
        if (!result.destination)
            return;
        const { source, destination } = result;
        let movedPlayer;
        if (source.droppableId === 'allPlayers') {
            const sourcePlayers = allPlayers ? [...allPlayers] : [];
            movedPlayer = sourcePlayers[source.index];
            movePlayer(source, destination, movedPlayer, sourcePlayers, setAllPlayers, attackTower, setAttackTower, defenseTower, setDefenseTower);
        }
        else if (source.droppableId === 'attackTower') {
            const sourcePlayers = [...attackTower];
            movedPlayer = sourcePlayers[source.index];
            movePlayer(source, destination, movedPlayer, allPlayers, setAllPlayers, sourcePlayers, setAttackTower, defenseTower, setDefenseTower);
        }
        else if (source.droppableId === 'defenseTower') {
            const sourcePlayers = [...defenseTower];
            movedPlayer = sourcePlayers[source.index];
            movePlayer(source, destination, movedPlayer, allPlayers, setAllPlayers, attackTower, setAttackTower, sourcePlayers, setDefenseTower);
        }
    };
    const resetAttackTower = () => {
        const updatedAvailablePlayers = [...allPlayers, ...attackTower];
        setAllPlayers(updatedAvailablePlayers);
        setAttackTower([]);
        localStorage.removeItem('attackTower');
    };
    const resetDefenseTower = () => {
        const updatedAvailablePlayers = [...allPlayers, ...defenseTower];
        setAllPlayers(updatedAvailablePlayers);
        setDefenseTower([]);
        localStorage.removeItem('defenseTower');
    };
    const sortPlayers = (key) => {
        const isAscending = key === 'class' ? isAscendingClass :
            key === 'resonance' ? isAscendingResonance :
                isAscendingName;
        const sortedPlayers = [...allPlayers].sort((a, b) => {
            let aValue = a[key];
            let bValue = b[key];
            if (key === 'resonance') {
                aValue = Number(aValue);
                bValue = Number(bValue);
            }
            if (aValue < bValue)
                return isAscending ? -1 : 1;
            if (aValue > bValue)
                return isAscending ? 1 : -1;
            return 0;
        });
        setAllPlayers(sortedPlayers);
        if (key === 'class') {
            setIsAscendingClass(!isAscendingClass);
        }
        else if (key === 'resonance') {
            setIsAscendingResonance(!isAscendingResonance);
        }
        else if (key === 'name') {
            setIsAscendingName(!isAscendingName);
        }
    };
    return (_jsx(PageWrapper, { children: _jsxs(DragDropContext, { onDragEnd: onDragEnd, children: [_jsx(Box, { display: "flex", flexDirection: "row", width: "100%", children: _jsx(CustomDroppable, { droppableId: "allPlayers", children: _jsxs(TableContainer, { component: Paper, style: { height: '100%', overflowY: 'auto', width: "100%" }, children: [_jsx(Typography, { variant: "h6", style: { padding: '16px' }, children: "Jogadores Dispon\u00EDveis" }), _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: _jsx("a", { href: "javascript:void(0);", onClick: () => sortPlayers("name"), children: "Nome" }) }), _jsx(TableCell, { children: _jsx("a", { href: "javascript:void(0);", onClick: () => sortPlayers("resonance"), children: "Resson\u00E2ncia" }) }), _jsx(TableCell, { children: _jsx("a", { href: "javascript:void(0);", onClick: () => sortPlayers("class"), children: "Classe" }) })] }) }), _jsx(TableBody, { children: allPlayers && allPlayers.map((player, index) => (_jsx(Draggable, { draggableId: player.name, index: index, children: (provided) => (_jsxs(TableRow, { ref: provided.innerRef, ...provided.draggableProps, ...provided.dragHandleProps, className: normalizeString(player.class), children: [_jsx(TableCell, { children: player.name }), _jsx(TableCell, { children: player.resonance }), _jsx(TableCell, { children: player.class })] })) }, player.name))) })] })] }) }) }), _jsx(Box, { display: "flex", flexDirection: "row", width: "100%", children: _jsx(CustomDroppable, { droppableId: "attackTower", children: _jsxs(TableContainer, { component: Paper, style: { height: '100%', overflowY: 'auto', position: "relative", width: "100%" }, children: [_jsx(Button, { variant: "contained", color: "secondary", onClick: resetAttackTower, style: { bottom: 0, right: 0, position: "absolute" }, children: _jsx(Recycling, {}) }), _jsxs(Typography, { variant: "h6", style: { padding: '16px' }, children: ["Torre de Ataque - ", `${attackTower.length} / ${MAX_ATTACK_PLAYERS}`] }), _jsxs(Table, { style: { flex: 1 }, children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Nome" }), _jsx(TableCell, { children: "Resson\u00E2ncia" }), _jsx(TableCell, { children: "Classe" })] }) }), _jsx(TableBody, { children: attackTower && attackTower.map((player, index) => (_jsx(Draggable, { draggableId: player.name, index: index, children: (provided) => (_jsxs(TableRow, { ref: provided.innerRef, ...provided.draggableProps, ...provided.dragHandleProps, className: normalizeString(player.class), children: [_jsx(TableCell, { children: player.name }), _jsx(TableCell, { children: player.resonance }), _jsx(TableCell, { children: player.class })] })) }, player.name))) })] })] }) }) }), _jsx(Box, { display: "flex", flexDirection: "row", width: "100%", children: _jsx(CustomDroppable, { droppableId: "defenseTower", children: _jsxs(TableContainer, { component: Paper, style: { height: '100%', overflowY: 'auto', position: "relative", width: "100%" }, children: [_jsx(Button, { variant: "contained", color: "secondary", onClick: resetDefenseTower, style: { bottom: 0, right: 0, position: "absolute" }, children: _jsx(Recycling, {}) }), _jsxs(Typography, { variant: "h6", style: { padding: '16px' }, children: ["Torre de Defesa - ", `${defenseTower.length} / ${MAX_DEFENSE_PLAYERS}`] }), _jsxs(Table, { style: { width: "100%" }, children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Nome" }), _jsx(TableCell, { children: "Resson\u00E2ncia" }), _jsx(TableCell, { children: "Classe" })] }) }), _jsx(TableBody, { children: defenseTower && defenseTower.map((player, index) => (_jsx(Draggable, { draggableId: player.name, index: index, children: (provided) => (_jsxs(TableRow, { ref: provided.innerRef, ...provided.draggableProps, ...provided.dragHandleProps, className: normalizeString(player.class), children: [_jsx(TableCell, { children: player.name }), _jsx(TableCell, { children: player.resonance }), _jsx(TableCell, { children: player.class })] })) }, player.name))) })] })] }) }) })] }) }));
};
