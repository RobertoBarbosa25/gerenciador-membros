import { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
} from '@mui/material';
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided } from 'react-beautiful-dnd';
import { Player } from '../../Types/Rank';
import { Recycling } from '@mui/icons-material';
import { movePlayer, MAX_ATTACK_PLAYERS, MAX_DEFENSE_PLAYERS, normalizeString } from './Towers.utils';
import { PageWrapper } from '../../Components/PageWrapper';

const CustomDroppable = ({ droppableId, children }: { droppableId: string; children: React.ReactNode }) => (
  <Droppable droppableId={droppableId}>
    {(provided: DroppableProvided) => (
      <div ref={provided.innerRef} {...provided.droppableProps}>
        {children}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
);

export const Towers = () => {
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [attackTower, setAttackTower] = useState<Player[]>([]);
  const [defenseTower, setDefenseTower] = useState<Player[]>([]);
  const [isAscendingClass, setIsAscendingClass] = useState(true);
  const [isAscendingResonance, setIsAscendingResonance] = useState(true);
  const [isAscendingName, setIsAscendingName] = useState(true);

  useEffect(() => {
    const loadPlayers = () => {
      const savedPlayers = localStorage.getItem('players');
      const playersFromStorage: Player[] = savedPlayers ? JSON.parse(savedPlayers) : [];

      const savedAttackTower = localStorage.getItem('attackTower');
      const attackFromStorage: Player[] = savedAttackTower ? JSON.parse(savedAttackTower) : [];

      const savedDefenseTower = localStorage.getItem('defenseTower');
      const defenseFromStorage: Player[] = savedDefenseTower ? JSON.parse(savedDefenseTower) : [];

      setAttackTower(attackFromStorage);
      setDefenseTower(defenseFromStorage);
      setAllPlayers(playersFromStorage.filter(player =>
        !attackFromStorage.find((p: Player) => p.name === player.name) &&
        !defenseFromStorage.find((d: Player) => d.name === player.name)
      ));
    };

    loadPlayers();
  }, []);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    let movedPlayer: Player;

    if (source.droppableId === 'allPlayers') {
      const sourcePlayers = allPlayers ? [...allPlayers] : [];
      movedPlayer = sourcePlayers[source.index];
      movePlayer(source, destination, movedPlayer, sourcePlayers, setAllPlayers, attackTower, setAttackTower, defenseTower, setDefenseTower);
    } else if (source.droppableId === 'attackTower') {
      const sourcePlayers = [...attackTower];
      movedPlayer = sourcePlayers[source.index];
      movePlayer(source, destination, movedPlayer, allPlayers, setAllPlayers, sourcePlayers, setAttackTower, defenseTower, setDefenseTower);
    } else if (source.droppableId === 'defenseTower') {
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

  const sortPlayers = (key: 'class' | 'resonance' | 'name') => {
    const isAscending =
      key === 'class' ? isAscendingClass :
      key === 'resonance' ? isAscendingResonance :
      isAscendingName;

    const sortedPlayers = [...allPlayers].sort((a, b) => {
      let aValue: string | number = a[key];
      let bValue: string | number = b[key];

      if (key === 'resonance') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }

      if (aValue < bValue) return isAscending ? -1 : 1;
      if (aValue > bValue) return isAscending ? 1 : -1;
      return 0;
    });

    setAllPlayers(sortedPlayers);

    if (key === 'class') {
      setIsAscendingClass(!isAscendingClass);
    } else if (key === 'resonance') {
      setIsAscendingResonance(!isAscendingResonance);
    } else if (key === 'name') {
      setIsAscendingName(!isAscendingName);
    }
  };

  return (
    <PageWrapper>
      <DragDropContext onDragEnd={onDragEnd}>
        <Box display="flex" flexDirection="row" width="100%">
          <CustomDroppable droppableId="allPlayers">
            <TableContainer component={Paper} style={{ height: '100%', overflowY: 'auto', width: "100%" }}>
              <Typography variant="h6" style={{ padding: '16px' }}>Jogadores Disponíveis</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><a href="javascript:void(0);" onClick={()=>sortPlayers("name")}>Nome</a></TableCell>
                    <TableCell><a href="javascript:void(0);" onClick={()=>sortPlayers("resonance")}>Ressonância</a></TableCell>
                    <TableCell><a href="javascript:void(0);" onClick={()=>sortPlayers("class")}>Classe</a></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allPlayers && allPlayers.map((player, index) => (
                    <Draggable key={player.name} draggableId={player.name} index={index}>
                      {(provided: DraggableProvided) => (
                        <TableRow ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={normalizeString(player.class)}>
                          <TableCell>{player.name}</TableCell>
                          <TableCell>{player.resonance}</TableCell>
                          <TableCell>{player.class}</TableCell>
                        </TableRow>
                      )}
                    </Draggable>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CustomDroppable>
        </Box>

        <Box display="flex" flexDirection="row" width="100%">
          <CustomDroppable droppableId="attackTower">
            <TableContainer component={Paper} style={{ height: '100%', overflowY: 'auto', position: "relative", width: "100%" }}>
              <Button variant="contained" color="secondary" onClick={resetAttackTower} style={{ bottom: 0, right: 0, position: "absolute" }}>
                <Recycling />
              </Button>
              <Typography variant="h6" style={{ padding: '16px' }}>Torre de Ataque - {`${attackTower.length} / ${MAX_ATTACK_PLAYERS}`}</Typography>
              <Table style={{ flex: 1 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell>Ressonância</TableCell>
                    <TableCell>Classe</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attackTower && attackTower.map((player, index) => (
                    <Draggable key={player.name} draggableId={player.name} index={index}>
                      {(provided: DraggableProvided) => (
                        <TableRow ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={normalizeString(player.class)}>
                          <TableCell>{player.name}</TableCell>
                          <TableCell>{player.resonance}</TableCell>
                          <TableCell>{player.class}</TableCell>
                        </TableRow>
                      )}
                    </Draggable>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CustomDroppable>
        </Box>

        <Box display="flex" flexDirection="row" width="100%">
          <CustomDroppable droppableId="defenseTower">
            <TableContainer component={Paper} style={{ height: '100%', overflowY: 'auto', position: "relative", width: "100%" }}>
              <Button variant="contained" color="secondary" onClick={resetDefenseTower} style={{ bottom: 0, right: 0, position: "absolute" }}>
                <Recycling />
              </Button>
              <Typography variant="h6" style={{ padding: '16px' }}>Torre de Defesa - {`${defenseTower.length} / ${MAX_DEFENSE_PLAYERS}`}</Typography>
              <Table style={{ width: "100%" }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell>Ressonância</TableCell>
                    <TableCell>Classe</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {defenseTower && defenseTower.map((player, index) => (
                    <Draggable key={player.name} draggableId={player.name} index={index}>
                      {(provided: DraggableProvided) => (
                        <TableRow ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={normalizeString(player.class)}>
                          <TableCell>{player.name}</TableCell>
                          <TableCell>{player.resonance}</TableCell>
                          <TableCell>{player.class}</TableCell>
                        </TableRow>
                      )}
                    </Draggable>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CustomDroppable>
        </Box>
      </DragDropContext>
    </PageWrapper>
  );
};
