import { Box, Typography, Button } from "@mui/material";
import { useCart } from "../../context/CartContext";
import { useOrders } from "../../context/OrderContext";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { addOrder } = useOrders();
  const navigate = useNavigate();

  const handleOrder = () => {
    const order = {
  id: Date.now(),
  items: cart,
  total: cart.reduce((sum, item) => sum + item.price, 0),
  paymentMethod: "Cash",
  pharmacy: cart[0]?.pharmacy,
  address: "Damascus",
  status: "Pending",

  driverId: null, // 🔥 مهم
};

    addOrder(order);
    clearCart();

    navigate("/orders");
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" mb={3}>
        Checkout 🛒
      </Typography>

      <Button variant="contained" onClick={handleOrder}>
        Place Order
      </Button>
    </Box>
  );
}