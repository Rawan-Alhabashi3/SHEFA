import { Box, Typography, TextField, Button, Checkbox, FormControlLabel } from "@mui/material";
import { useState } from "react";

export default function PharmacyRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    isSpecialist: false,
    file: null,
  });

  const handleSubmit = () => {
    const requests = JSON.parse(localStorage.getItem("pharmacyRequests")) || [];

    const newRequest = {
      id: Date.now(),
      ...form,
      status: "pending",
    };

    localStorage.setItem("pharmacyRequests", JSON.stringify([...requests, newRequest]));

    alert("Request sent to admin ✅");
  };

  return (
    <Box sx={{ p: 4, maxWidth: 400, mx: "auto" }}>
      <Typography variant="h5" mb={3}>
        Pharmacy Registration 🏥
      </Typography>

      <TextField
        label="Full Name"
        fullWidth
        sx={{ mb: 2 }}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <TextField
        label="Email"
        fullWidth
        sx={{ mb: 2 }}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <TextField
        label="Password"
        type="password"
        fullWidth
        sx={{ mb: 2 }}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
      />

      <FormControlLabel
        control={
          <Checkbox
            onChange={(e) =>
              setForm({ ...form, isSpecialist: e.target.checked })
            }
          />
        }
        label="I am a Specialist Pharmacist"
      />

      <Button variant="contained" fullWidth onClick={handleSubmit}>
        Submit Request
      </Button>
    </Box>
  );
}