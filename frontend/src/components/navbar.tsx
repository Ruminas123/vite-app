import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from "../authen/AuthContext.tsx";

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const { user } = useAuth();

  return (
    <AppBar position="relative" sx={{ backgroundColor: '#003465', width: '100%' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <Link to="/vite-app/">
            <span style={{ color: '#408DFF', marginRight: '5px', fontWeight: 'bold' }}>AWAT</span>
            <span style={{ color: '#FFFFFF', fontWeight: 'bold' }}>FORM</span>
          </Link>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              <Typography variant="h6" sx={{ color: 'white', marginRight: 2, fontSize: "1rem" }}>
                {user?.employee_fullname}
              </Typography>
              <Button color="inherit" component={Link} to="/vite-app/">Home</Button>
              <Button color="inherit" component={Link} to="/vite-app/contact">Contact</Button>
              <Button color="inherit" onClick={logout} sx={{ '&:hover': { color: '#535bf2' } }}>Logout</Button>
            </>
          ) : (<Button color="inherit" component={Link} to="/vite-app/login">Login</Button>)}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
