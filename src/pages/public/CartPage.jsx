import {
  Box,
  Typography,
  Paper,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useCart } from "../../context/CartContext";
import { useOrders } from "../../context/OrderContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const { setOrders } = useOrders();
  const navigate = useNavigate();
const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
    // 💳 Stripe (جاهز لاحقاً)
    if (paymentMethod === "card") {
          setLoading(true);

           // محاكاة Stripe (مؤقت)
        setTimeout(() => {
          setLoading(false);
          navigate("/payment-success");
          }, 2000);

        return;
      }

    // 💵 Cash
    const newOrder = {
      id: Date.now(),
      customer: "Guest",
      total,
      status: "Pending",
      assigned: false,
      pharmacy: cart[0]?.pharmacy,
      paymentMethod,
    };

    setOrders((prev) => [...prev, newOrder]);
    clearCart();

    navigate("/order-success");
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3}>
        Cart
      </Typography>

      {cart.length === 0 ? (
        <Typography>No items in cart</Typography>
      ) : (
        <Paper sx={{ p: 3 }}>
          {cart.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography>{item.name}</Typography>
              <Typography>${item.price}</Typography>

              <Button
                color="error"
                onClick={() => removeFromCart(index)}
              >
                Remove
              </Button>
            </Box>
          ))}

          {/* Total */}
          <Typography mt={2}>Total: ${total}</Typography>

          {/* Payment */}
          <Typography mt={2} mb={1}>
            Select Payment Method
          </Typography>

          <RadioGroup
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <FormControlLabel
              value="cash"
              control={<Radio />}
              label="Cash on Delivery"
            />
            <FormControlLabel
              value="card"
              control={<Radio />}
              label="Credit Card (Stripe)"
            />
          </RadioGroup>

          {/* Checkout */}
          <Button
  fullWidth
  variant="contained"
  sx={{ mt: 2 }}
  onClick={() => navigate("/checkout")}
>
  Checkout
</Button>
        </Paper>
      )}
    </Box>
  );
}