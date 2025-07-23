export const getClassBackgroundColor = (classe: string) => {
  switch (classe.toLowerCase()) {
    case 'arcanista':
      return '#7b1fa2';
    case 'bárbaro':
      return '#d32f2f';
    case 'cavaleiro de sangue':
      return '#880e4f';
    case 'cruzado':
      return '#f57c00';
    case 'caçador de demônios':
      return '#303f9f';
    case 'necromante':
      return '#37474f';
    case 'tempestário':
      return '#0288d1';
    case 'monge':
      return '#388e3c';
    case 'druida':
      return '#00796b'; // nova cor distinta para Druida
    default:
      return '#424242';
  }
};
