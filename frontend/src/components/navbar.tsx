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
            <span style={{ color: '#408DFF', marginRight: '5px', fontWeight: 'bold', fontSize: "1.5rem", fontFamily: 'Maehongson' }}>AWAT</span>
            <span style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: "1.5rem", fontFamily: 'Maehongson' }}>FORM</span>
          </Link>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              <Typography variant="h6" sx={{ color: 'white', marginRight: 2, fontSize: "1.2rem", fontFamily: 'Maehongson' }}>
                {user?.employee_fullname}
              </Typography>
              <Button color="inherit" component={Link} to="/vite-app/" sx={{ fontFamily: 'Maehongson', fontSize: "1.2rem" }}>Home</Button>
              <Button color="inherit" component={Link} to="/vite-app/contact"  sx={{ fontFamily: 'Maehongson', fontSize: "1.2rem" }}>Contact</Button>
              <Button color="inherit" onClick={logout} sx={{ '&:hover': { color: '#535bf2' }, fontFamily: 'Maehongson', fontSize: "1.2rem" }}>Logout</Button>
            </>
          ) : (<Button color="inherit" component={Link} to="/vite-app/login">Login</Button>)}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
