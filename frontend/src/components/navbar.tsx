import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom'; // for navigation
import { useAuth } from "../authen/AuthContext.tsx";  // ใช้ useAuth เพื่อดึงสถานะการล็อกอิน

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth(); 

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
          {/* เมนูที่แสดงเมื่อผู้ใช้ล็อกอินแล้ว */}
          {isAuthenticated ? (
            <>
              <Button color="inherit" component={Link} to="/vite-app/">
                Home
              </Button>
              <Button color="inherit" component={Link} to="/vite-app/contact">
                Contact
              </Button>
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            // เมนูที่แสดงเมื่อผู้ใช้ยังไม่ได้ล็อกอิน
            <Button color="inherit" component={Link} to="/vite-app/login">
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
