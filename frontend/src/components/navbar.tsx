import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import logoImage from '../assets/react.svg';

const Navbar = () => {
  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#003465', width: '100%' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <a href="https://react.dev" target="_blank">
                <img src={logoImage} className="logo react" alt="React logo" style={{ padding: "1rem" }}/>
            </a>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button color="inherit" component={Link} to="/vite-app/">Home</Button>
          <Button color="inherit" component={Link} to="/vite-app/contact">Contact</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
