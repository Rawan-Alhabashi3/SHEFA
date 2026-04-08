import { Box, Typography, Paper, Divider } from "@mui/material";
import { useParams } from "react-router-dom";
import { useOrders } from "../../context/OrderContext";

export default function OrderDetails() {
  const { id } = useParams();
  const { orders } = useOrders();

  // 🔍 نجيب الطلب
  const order = orders.find((o) => o.id.toString() === id);

  // ❌ إذا ما موجود
  if (!order) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Order not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3} fontWeight={700}>
        Order Details 📦
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 3 }}>

        {/* 🧾 معلومات الطلب */}
        <Typography mb={1}>
          <b>Order ID:</b> {order.id}
        </Typography>

        <Typography mb={1}>
          <b>Status:</b> {order.status}
        </Typography>

        <Typography mb={1}>
          <b>Total:</b> ${order.total}
        </Typography>

        <Typography mb={1}>
          <b>Payment:</b> {order.paymentMethod}
        </Typography>

        <Typography mb={1}>
          <b>Pharmacy:</b> {order.pharmacy}
        </Typography>

        <Typography mb={1}>
          <b>Driver:</b>{" "}
          {order.driver ? order.driver : "Not assigned yet"}
        </Typography>

        <Typography mb={2}>
          <b>Address:</b> {order.address}
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* 🛒 المنتجات */}
        <Typography variant="h6" mb={2}>
          Items:
        </Typography>

        {order.items && order.items.length > 0 ? (
          order.items.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
                p: 1,
                borderRadius: 2,
                backgroundColor: "#f5f5f5",
              }}
            >
              <Typography>{item.name}</Typography>
              <Typography>${item.price}</Typography>
            </Box>
          ))
        ) : (
          <Typography>No items found</Typography>
        )}

      </Paper>
    </Box>
  );
}