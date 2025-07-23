// import { useState, useEffect } from 'react';
// import {
//   Box,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
//   Typography,
// } from '@mui/material';
// import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided } from 'react-beautiful-dnd';
// import { Player } from '../../Types/Rank';
// import { Recycling } from '@mui/icons-material';
// import { BoxTowers } from './Towers.styles';

// const CustomDroppable = ({ droppableId, children }: { droppableId: string; children: React.ReactNode }) => (
//   <Droppable droppableId={droppableId}>
//     {(provided: DroppableProvided) => (
//       <div ref={provided.innerRef} {...provided.droppableProps}>
//         {children}
//         {provided.placeholder}
//       </div>
//     )}
//   </Droppable>
// );

// export const Towers = () => {
//   const [allPlayers, setAllPlayers] = useState<Player[]>([]);
//   const [attackTower, setAttackTower] = useState<Player[]>([]);
//   const [defenseTower, setDefenseTower] = useState<Player[]>([]);

//   useEffect(() => {
//     const loadPlayers = () => {
//       const savedPlayers = localStorage.getItem('players');
//       const playersFromStorage: Player[] = savedPlayers ? JSON.parse(savedPlayers) : [];

//       const savedAttackTower = localStorage.getItem('attackTower');
//       const attackFromStorage: Player[] = savedAttackTower ? JSON.parse(savedAttackTower) : [];

//       const savedDefenseTower = localStorage.getItem('defenseTower');
//       const defenseFromStorage: Player[] = savedDefenseTower ? JSON.parse(savedDefenseTower) : [];

//       setAttackTower(attackFromStorage);
//       setDefenseTower(defenseFromStorage);
//       setAllPlayers(playersFromStorage.filter(player =>
//         !attackFromStorage.find((p: Player) => p.name === player.name) &&
//         !defenseFromStorage.find((d: Player) => d.name === player.name)
//       ));
//     };

//     loadPlayers();
//   }, []);

//   const onDragEnd = (result: DropResult) => {
//     if (!result.destination) return;

//     const { source, destination } = result;
//     let movedPlayer: Player;

//     if (source.droppableId === 'allPlayers') {
//       const sourcePlayers: Player[] = allPlayers ? [...allPlayers] : [];
//       movedPlayer = sourcePlayers.splice(source.index, 1)[0];
//       setAllPlayers(sourcePlayers);

//       if (movedPlayer) {
//         if (destination.droppableId === 'allPlayers') {
//           setAllPlayers((prev) => {
//             const newAllPlayers = [...prev, movedPlayer];
//             return newAllPlayers;
//           });
//         }
//         if (destination.droppableId === 'attackTower') {
//           setAttackTower((prev) => {
//             const newAttackTower = [...prev, movedPlayer];
//             localStorage.setItem('attackTower', JSON.stringify(newAttackTower));
//             return newAttackTower;
//           });
//         } else if (destination.droppableId === 'defenseTower') {
//           setDefenseTower((prev) => {
//             const newDefenseTower = [...prev, movedPlayer];
//             localStorage.setItem('defenseTower', JSON.stringify(newDefenseTower));
//             return newDefenseTower;
//           });
//         }
//       }
//     } else if (source.droppableId === 'attackTower') {
//       const sourcePlayers = [...attackTower];
//       movedPlayer = sourcePlayers.splice(source.index, 1)[0];
//       localStorage.setItem('attackTower', JSON.stringify(sourcePlayers));
//       setAttackTower(sourcePlayers);

//       if (movedPlayer) {
//         if (destination.droppableId === 'attackTower') {
//           setAttackTower(prev => {
//             const newAttackTower = [...prev, movedPlayer];
//             localStorage.setItem('attackTower', JSON.stringify(newAttackTower));
//             return newAttackTower;
//           });
//         }
//         if (destination.droppableId === 'allPlayers') {
//           setAllPlayers(prev => {
//             const newAllPlayers = [...prev, movedPlayer];
//             return newAllPlayers;
//           });
//         } else if (destination.droppableId === 'defenseTower') {
//           setDefenseTower(prev => {
//             const newDefenseTower = [...prev, movedPlayer];
//             localStorage.setItem('defenseTower', JSON.stringify(newDefenseTower));
//             return newDefenseTower;
//           });
//         }
//       }
//     } else if (source.droppableId === 'defenseTower') {
//       const sourcePlayers = [...defenseTower];
//       movedPlayer = sourcePlayers.splice(source.index, 1)[0];
//       localStorage.setItem('defenseTower', JSON.stringify(sourcePlayers));
//       setDefenseTower(sourcePlayers);

//       if (movedPlayer) {
//         if (destination.droppableId === 'defenseTower') {
//           setAttackTower(prev => {
//             const newDefenseTower = [...prev, movedPlayer];
//             localStorage.setItem('defenseTower', JSON.stringify(newDefenseTower));
//             return newDefenseTower;
//           });
//         }
//         if (destination.droppableId === 'allPlayers') {
//           setAllPlayers(prev => {
//             const newAllPlayers = [...prev, movedPlayer];
//             return newAllPlayers;
//           });
//         } else if (destination.droppableId === 'attackTower') {
//           setAttackTower(prev => {
//             const newAttackTower = [...prev, movedPlayer];
//             localStorage.setItem('attackTower', JSON.stringify(newAttackTower));
//             return newAttackTower;
//           });
//         }
//       }
//     }
//   };

//   const resetAttackTower = () => {
//     const updatedAvailablePlayers = [...allPlayers, ...attackTower];
//     setAllPlayers(updatedAvailablePlayers);
//     setAttackTower([]);
//     localStorage.removeItem('attackTower');
//   };

//   const resetDefenseTower = () => {
//     const updatedAvailablePlayers = [...allPlayers, ...defenseTower];
//     setAllPlayers(updatedAvailablePlayers);
//     setDefenseTower([]);
//     localStorage.removeItem('defenseTower');
//   };

//   return (
//     <BoxTowers>
//       <DragDropContext onDragEnd={onDragEnd}>
//         <Box display="flex" flexDirection="row" width="100%">
//           <CustomDroppable droppableId="allPlayers">
//             <TableContainer component={Paper} style={{ height: '100%', overflowY: 'auto', width: "100%" }}>
//               <Typography variant="h6" style={{ padding: '16px' }}>Jogadores Disponíveis</Typography>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Nome</TableCell>
//                     <TableCell>Ressonância</TableCell>
//                     <TableCell>Classe</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {allPlayers && allPlayers.map((player, index) => (
//                     <Draggable key={player.name} draggableId={player.name} index={index}>
//                       {(provided: DraggableProvided) => (
//                         <TableRow ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
//                           <TableCell>{player.name}</TableCell>
//                           <TableCell>{player.resonance}</TableCell>
//                           <TableCell>{player.class}</TableCell>
//                         </TableRow>
//                       )}
//                     </Draggable>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </CustomDroppable>
//         </Box>

//         <Box display="flex" flexDirection="row" width="100%">
//           <CustomDroppable droppableId="attackTower">
//             <TableContainer component={Paper} style={{ height: '100%', overflowY: 'auto', position: "relative", width: "100%" }}>
//               <Button variant="contained" color="secondary" onClick={resetAttackTower} style={{ bottom: 0, right: 0, position: "absolute" }}>
//                 <Recycling />
//               </Button>
//               <Typography variant="h6" style={{ padding: '16px' }}>Torre de Ataque</Typography>
//               <Table style={{ flex: 1 }}>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Nome</TableCell>
//                     <TableCell>Ressonância</TableCell>
//                     <TableCell>Classe</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {attackTower && attackTower.map((player, index) => (
//                     <Draggable key={player.name} draggableId={player.name} index={index}>
//                       {(provided: DraggableProvided) => (
//                         <TableRow ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
//                           <TableCell>{player.name}</TableCell>
//                           <TableCell>{player.resonance}</TableCell>
//                           <TableCell>{player.class}</TableCell>
//                         </TableRow>
//                       )}
//                     </Draggable>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </CustomDroppable>
//         </Box>

//         <Box display="flex" flexDirection="row" width="100%">
//           <CustomDroppable droppableId="defenseTower">
//             <TableContainer component={Paper} style={{ height: '100%', overflowY: 'auto', position: "relative", width: "100%" }}>
//               <Button variant="contained" color="secondary" onClick={resetDefenseTower} style={{ bottom: 0, right: 0, position: "absolute" }}>
//                 <Recycling />
//               </Button>
//               <Typography variant="h6" style={{ padding: '16px' }}>Torre de Defesa</Typography>
//               <Table style={{ width: "100%" }}>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Nome</TableCell>
//                     <TableCell>Ressonância</TableCell>
//                     <TableCell>Classe</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {defenseTower && defenseTower.map((player, index) => (
//                     <Draggable key={player.name} draggableId={player.name} index={index}>
//                       {(provided: DraggableProvided) => (
//                         <TableRow ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
//                           <TableCell>{player.name}</TableCell>
//                           <TableCell>{player.resonance}</TableCell>
//                           <TableCell>{player.class}</TableCell>
//                         </TableRow>
//                       )}
//                     </Draggable>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </CustomDroppable>
//         </Box>
//       </DragDropContext>
//     </BoxTowers>
//   );
// };
