import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        p: 5,
        textAlign: "center",
      }}
    >
      <Typography variant="h3" mb={2}>
        ❌ Payment Cancelled
      </Typography>

      <Typography color="text.secondary" mb={4}>
        Your payment was cancelled. You can try again.
      </Typography>

      <Button
        variant="contained"
        sx={{ mr: 2 }}
        onClick={() => navigate("/cart")}
      >
        Back to Cart
      </Button>

      <Button
        variant="outlined"
        onClick={() => navigate("/")}
      >
        Go Home
      </Button>
    </Box>
  );
}