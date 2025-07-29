import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Box, Typography, Paper, } from '@mui/material';
import { MAX_ATTACK_PLAYERS, MAX_DEFENSE_PLAYERS } from '../Towers/Towers.utils';
import { PageWrapper } from '../../Components/PageWrapper';
export const MAX_USERS_PER_CLA = 300;
export const HomePage = () => {
    const [playersCount, setPlayersCount] = useState(0);
    const [attackTowerCount, setAttackTowerCount] = useState(0);
    const [defenseTowerCount, setDefenseTowerCount] = useState(0);
    useEffect(() => {
        const loadCounts = () => {
            const savedPlayers = localStorage.getItem('players');
            const playersFromStorage = savedPlayers ? JSON.parse(savedPlayers) : [];
            setPlayersCount(playersFromStorage.length);
            const savedAttackTower = localStorage.getItem('attackTower');
            const attackFromStorage = savedAttackTower ? JSON.parse(savedAttackTower) : [];
            setAttackTowerCount(attackFromStorage.length);
            const savedDefenseTower = localStorage.getItem('defenseTower');
            const defenseFromStorage = savedDefenseTower ? JSON.parse(savedDefenseTower) : [];
            setDefenseTowerCount(defenseFromStorage.length);
        };
        loadCounts();
    }, []);
    return (_jsx(PageWrapper, { children: _jsxs(Box, { display: "flex", justifyContent: "flex-start", alignItems: "flex-start", width: "100%", gap: 3, children: [_jsx(Paper, { elevation: 3, style: { padding: '20px', maxWidth: '450px', width: '100%' }, children: _jsxs(Typography, { variant: "h6", children: ["Membros no cl\u00E3: ", playersCount, " / ", MAX_USERS_PER_CLA] }) }), _jsx(Paper, { elevation: 3, style: { padding: '20px', maxWidth: '450px', width: '100%' }, children: _jsxs(Typography, { variant: "h6", children: ["Escalados Torre de Ataque: ", attackTowerCount, " / ", MAX_ATTACK_PLAYERS] }) }), _jsx(Paper, { elevation: 3, style: { padding: '20px', maxWidth: '450px', width: '100%' }, children: _jsxs(Typography, { variant: "h6", children: ["Escalados Torre de Defesa: ", defenseTowerCount, " / ", MAX_DEFENSE_PLAYERS] }) })] }) }));
};
