export function getAverageResonance(players: { resonance?: number }[]): number {
  if (!players.length) return 0;
  const total = players.reduce((sum, p) => sum + (p.resonance || 0), 0);
  return parseFloat((total / players.length).toFixed(0));
}

export function getClaData(players: { cla: string }[]): { name: string; value: number }[] {
  const counts: { [key: string]: number } = {};
  players.forEach(p => {
    counts[p.cla] = (counts[p.cla] || 0) + 1;
  });
  return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
} 