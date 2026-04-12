import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Button,
} from "@mui/material";
import { useOrders } from "../../context/OrderContext";

export default function AssignedOrders() {
  const { orders, setOrders } = useOrders();

  // 🟢 الطلبات المنتظرة للدرايفر
 const driverId = "driver_1";

const assignedOrders = orders.filter(
  (order) =>
    (order.status === "Ready for Pickup" && order.driverId === null) || // 🔥 الكل يشوف
    order.driverId === driverId // 🔥 فقط طلباته
);

  const getStatusChip = (status) => {
    switch (status) {
      case "Pending Driver":
        return <Chip label="Waiting Driver" color="info" />;
      case "Processing":
        return <Chip label="In Progress" color="warning" />;
      case "Delivered":
        return <Chip label="Delivered" color="success" />;
      default:
        return <Chip label={status} />;
    }
  };

  // ✅ قبول الطلب
  const acceptOrder = (id) => {
  const driverId = "driver_1"; // مؤقت

  setOrders((prev) =>
    prev.map((order) =>
      order.id === id
        ? {
            ...order,
            status: "Processing",
            driverId: driverId, // 🔥 هون السر
          }
        : order
    )
  );
};

  // ❌ رفض الطلب
  const rejectOrder = (id) => {
  setOrders((prev) =>
    prev.map((order) =>
      order.id === id
        ? { ...order, status: "Pending Driver" } // 🔥 يرجع لباقي الدرايفرز
        : order
    )
  );
};

  // 🚚 تسليم الطلب
  const deliverOrder = (id) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id
          ? { ...order, status: "Delivered" }
          : order
      )
    );
  };

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Assigned Orders 🚚
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {assignedOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>#{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>
                  {getStatusChip(order.status)}
                </TableCell>

                <TableCell align="center">
                  {/* 🟡 بانتظار قبول الدرايفر */}
                  {order.status === "Ready for Pickup" && (
  <Button
    variant="contained"
    size="small"
    onClick={() => acceptOrder(order.id)}
  >
    Accept
  </Button>
)}

{order.status === "Ready for Pickup" && (
  <Button
    variant="contained"
    size="small"
    onClick={() => acceptOrder(order.id)}
  >
    Accept
  </Button>
)}

{order.status === "Processing" &&
  order.driverId === driverId && (
    <Button
      variant="contained"
      color="success"
      size="small"
      onClick={() => deliverOrder(order.id)}
    >
      Mark Delivered
    </Button>
)}
                </TableCell>
              </TableRow>
            ))}

            {assignedOrders.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No assigned orders
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}