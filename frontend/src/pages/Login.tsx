import { LockOutlined } from "@mui/icons-material";
import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

export function Login() {
  const [username, setText] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => { };

  return (
    <>
      <Container maxWidth="sm">
        <CssBaseline />
        <Box
          sx={{
            // mt: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "2px solidrgb(255, 255, 255)",
            padding:  { xs: "30px", sm: "50px 40px" },
            borderRadius: "30px",
            boxShadow: "3px 3px 10px rgba(0, 0, 0, 0.1)",
          }}
        >

          <Typography variant="h5">Login</Typography>
          <Box sx={{ mt: 1, }}>
            <TextField
              margin="normal"
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoFocus
              value={username}
              onChange={(e) => setText(e.target.value)}
              sx={{
                "& .MuiInputLabel-root": {
                  color: "gray", // Default label color
                },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />

            <TextField
              margin="normal"
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, padding: "15px", 
                backgroundColor: "#003465", "&:hover": {backgroundColor: "primary.dark"}, 
              }}
              onClick={handleLogin}
            >
              Login
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};