import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom'; // for navigation

const Navbar = () => {
  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#003465', width: '100%' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Logo or Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <Link to="/vite-app/">
              <span style={{ color: '#408DFF', marginRight: '5px', fontWeight: 'bold'}}>AWAT</span> 
              <span style={{ color: '#FFFFFF', fontWeight: 'bold'}}>FORM</span>
            </Link>
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button color="inherit" component={Link} to="/vite-app/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/vite-app/contact">
            Contact
          </Button>
          <Button color="inherit" component={Link} to="/vite-app/login">
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
