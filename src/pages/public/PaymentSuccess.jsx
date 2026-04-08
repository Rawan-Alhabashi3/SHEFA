import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        p: 5,
        textAlign: "center",
      }}
    >
      <Typography variant="h3" mb={2}>
        💳 Payment Successful!
      </Typography>

      <Typography color="text.secondary" mb={4}>
        Your payment has been completed successfully.
      </Typography>

      <Button
        variant="contained"
        sx={{ mr: 2 }}
        onClick={() => navigate("/orders-tracking")}
      >
        Track Order
      </Button>

      <Button
        variant="outlined"
        onClick={() => navigate("/")}
      >
        Back to Home
      </Button>
    </Box>
  );
}