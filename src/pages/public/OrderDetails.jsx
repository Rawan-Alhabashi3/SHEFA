import { Box, Typography, Paper } from "@mui/material";
import { useParams } from "react-router-dom";
import { useOrders } from "../../context/OrderContext";

export default function OrderDetails() {
  const { id } = useParams();
  const { orders } = useOrders();

  const order = orders.find(
    (o) => o.id.toString() === id
  );

  if (!order) {
    return <Typography>Order not found</Typography>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3}>
        Order Details
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Typography>Order ID: {order.id}</Typography>
        <Typography>Total: ${order.total}</Typography>
        <Typography>Status: {order.status}</Typography>

        <Typography mt={2}>
          Payment: {order.paymentMethod}
        </Typography>

        <Typography>
          Pharmacy: {order.pharmacy}
        </Typography>
      </Paper>
    </Box>
  );
}