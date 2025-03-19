import { LockOutlined } from "@mui/icons-material";
import { Container, CssBaseline, Box, Typography, TextField, Button } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuth } from "../authen/AuthContext.tsx";

export function Login() {
  const [username, setText] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // Use login from AuthContext

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });
      if (response.data.success) {
        login(); // Set user as logged in
        navigate("/vite-app/");
        Swal.fire("สำเร็จ!", "เข้าสู่ระบบสำเร็จแล้ว", "success");
      } else {
        setError("Invalid username or password");
        Swal.fire("ผิดพลาด!", "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง", "error");
      }
    } catch (error) {
      setError("An error occurred while logging in");
      Swal.fire("ผิดพลาด!", "เกิดข้อผิดพลาดในการเข้าสู่ระบบ", "error");
    }
  };

  return (
    <Container maxWidth="sm">
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          border: "2px solid rgb(255, 255, 255)",
          padding: { xs: "30px", sm: "50px 40px" },
          borderRadius: "30px",
          boxShadow: "3px 3px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h5">Login</Typography>
        <Box sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoFocus
            value={username}
            onChange={(e) => setText(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleLogin}
          >
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
