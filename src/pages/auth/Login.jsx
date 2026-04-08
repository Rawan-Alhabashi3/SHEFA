import {
  Box,
  Button,
  Typography,
  Paper,
  TextField,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";


export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();


const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
  const users =
    JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find((u) => u.email === email);
  if (user.role === "pharmacy" && user.status === "pending") {
  alert("Your account is waiting for admin approval ⏳");
  return;
}
if (user.role === "pharmacy" && user.status === "rejected") {
  alert("❌ Your request has been rejected by admin");
  return;
}

  if (!user) {
    alert("User not found");
    return;
  }

  login(user);

  navigate("/dashboard");
};

  const handleRoleLogin = (role) => {
    login({ role });
    navigate("/dashboard");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Paper sx={{ p: 4, width: 360, borderRadius: 3 }}>
        <Typography variant="h5" mb={3} textAlign="center">
          Login
        </Typography>

        {/* Email */}
        <TextField
          label="Email"
          fullWidth
          sx={{ mb: 2 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <TextField
  label="Password"
  type={showPassword ? "text" : "password"}
  fullWidth
  sx={{ mb: 3 }}
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    ),
  }}
/>
        {/* Login Button */}
        <Button
          fullWidth
          variant="contained"
          sx={{ mb: 2 }}
          onClick={handleLogin}
        >
          Login
        </Button>

        {/* Demo Roles */}
        <Typography textAlign="center" mb={1}>
          Demo Roles
        </Typography>

        <Button
          fullWidth
          sx={{ mb: 1 }}
          onClick={() => handleRoleLogin("pharmacy")}
        >
          Pharmacy
        </Button>

        <Button
          fullWidth
          sx={{ mb: 1 }}
          onClick={() => handleRoleLogin("driver")}
        >
          Driver
        </Button>

        <Button
          fullWidth
          color="secondary"
          onClick={() => handleRoleLogin("admin")}
        >
          Admin
        </Button>

        {/* Register */}
        <Typography mt={2} textAlign="center">
          Don't have an account?
        </Typography>

        <Button
          fullWidth
          onClick={() => navigate("/register")}
        >
          Create Account
        </Button>
      </Paper>
    </Box>
  );
}