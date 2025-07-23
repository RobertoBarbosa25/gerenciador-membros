import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button } from '@mui/material';

export const NavigationMenu = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" component={Link} to="/register">Registrar</Button>
        <Button color="inherit" component={Link} to="/members">Membros</Button>
        <Button color="inherit" component={Link} to="/towers">Torres</Button>
        <Button color="inherit" component={Link} to="/rito">Rito</Button>
        <Button color="inherit" component={Link} to="/vigilia">Vigília</Button>
        <Button color="inherit" component={Link} to="/gestao">Gestão</Button>
      </Toolbar>
    </AppBar>
  );
};
