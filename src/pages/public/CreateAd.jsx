import {
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateAd() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    const newAd = {
      id: Date.now(),
      title,
      price,
      status: "Pending",
    };

    const existingAds =
      JSON.parse(localStorage.getItem("ads")) || [];

    localStorage.setItem(
      "ads",
      JSON.stringify([...existingAds, newAd])
    );

    navigate("/");
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3}>
        Create Advertisement
      </Typography>

      <TextField
        label="Medicine Name"
        fullWidth
        sx={{ mb: 2 }}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <TextField
        label="Price"
        fullWidth
        sx={{ mb: 2 }}
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <Button
        variant="contained"
        onClick={handleSubmit}
      >
        Submit Ad
      </Button>
    </Box>
  );
}