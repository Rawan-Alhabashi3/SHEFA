import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Select,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState("user");

  // 🟢 states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🏥 pharmacy
  const [pharmacyName, setPharmacyName] = useState("");
  const [location, setLocation] = useState("");

  // 🚚 driver
  const [vehicle, setVehicle] = useState("");
  const [phone, setPhone] = useState("");
  const [isSpecialist, setIsSpecialist] = useState(false);
  const [file, setFile] = useState(null);
  const handleRegister = () => {
    if (!name || !email || !password) {
      alert("Please fill all required fields");
      return;
    }

    const newUser = {
  id: Date.now(),
  name,
  email,
  password,
  role,

  // 🏥 pharmacy
  pharmacyName: role === "pharmacy" ? pharmacyName : null,
  location: role === "pharmacy" ? location : null,
  isSpecialist: role === "pharmacy" ? isSpecialist : false,
  pdf: role === "pharmacy" ? file?.name : null,

  // 🚚 driver
  vehicle: role === "driver" ? vehicle : null,
  phone: role === "driver" ? phone : null,

  // 🔥 مهم
  status: role === "pharmacy" ? "pending" : "approved",
};

    const users =
      JSON.parse(localStorage.getItem("users")) || [];

    localStorage.setItem(
      "users",
      JSON.stringify([...users, newUser])
    );

    alert("Account created successfully ✅");

    navigate("/login");
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
      <Paper sx={{ p: 4, width: 400, borderRadius: 3 }}>
        <Typography variant="h5" mb={3} textAlign="center">
          Create Account
        </Typography>

        {/* Basic Info */}
        <TextField
          label="Name"
          fullWidth
          sx={{ mb: 2 }}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          label="Email"
          fullWidth
          sx={{ mb: 2 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          sx={{ mb: 2 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Role */}
        <Select
          fullWidth
          value={role}
          onChange={(e) => setRole(e.target.value)}
          sx={{ mb: 2 }}
        >
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="pharmacy">Pharmacy</MenuItem>
          <MenuItem value="driver">Driver</MenuItem>
        </Select>

        {/* 🏥 Pharmacy Fields */}
        {role === "pharmacy" && (
          <>
  <TextField
    label="Pharmacy Name"
    fullWidth
    sx={{ mb: 2 }}
    value={pharmacyName}
    onChange={(e) => setPharmacyName(e.target.value)}
  />

  <TextField
    label="Location"
    fullWidth
    sx={{ mb: 2 }}
    value={location}
    onChange={(e) => setLocation(e.target.value)}
  />

  {/* 📄 Upload PDF */}
  <input
    type="file"
    accept="application/pdf"
    onChange={(e) => setFile(e.target.files[0])}
    style={{ marginBottom: "10px" }}
  />

  {/* ⭐ Specialist */}
  <label>
    <input
      type="checkbox"
      onChange={(e) => setIsSpecialist(e.target.checked)}
    />
    I am a Specialist Pharmacist
  </label>
</>
        )}

        {/* 🚚 Driver Fields */}
        {role === "driver" && (
          <>
            <TextField
              label="Vehicle Type"
              fullWidth
              sx={{ mb: 2 }}
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
            />

            <TextField
              label="Phone Number"
              fullWidth
              sx={{ mb: 2 }}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </>
        )}

        {/* Register Button */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleRegister}
        >
          Register
        </Button>
      </Paper>
    </Box>
  );
}