export const translateClass = (classe: string): string => {
    if (classe === 'Tempestário') return 'TP';
    if (classe === 'Necromante') return 'NM';
    if (classe === 'Cavaleiro de Sangue') return 'BK';
    if (classe === 'Bárbaro') return 'BB';
    if (classe === 'Arcanista') return 'AR';
    if (classe === 'Caçador de Demônios') return 'DH';
    if (classe === 'Monge') return 'MK';
    if (classe === 'Cruzado') return 'CR';
    if (classe === 'Druida') return 'DR';
    return classe;
};