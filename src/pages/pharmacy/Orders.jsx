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
import { useDriver } from "../../context/DriverContext";
import { useNotification } from "../../context/NotificationContext";

export default function Orders() {
  const { orders, setOrders } = useOrders();
  const { available } = useDriver();
  const { addNotification } = useNotification();

  const getStatusChip = (status) => {
    switch (status) {
      case "Pending":
        return <Chip label="Pending" color="warning" />;
      case "Processing":
        return <Chip label="Processing" color="info" />;
      case "Delivered":
        return <Chip label="Delivered" color="success" />;
      case "Cancelled":
        return <Chip label="Cancelled" color="error" />;
      case "Pending Assignment":
        return <Chip label="Pending Assignment" />;
      default:
        return <Chip label={status} />;
    }
  };

  const updateStatus = (id, newStatus) => {
    setOrders(
      orders.map((order) => {
        if (order.id === id) {
          if (newStatus === "Processing") {
            if (available) {
              addNotification("Order assigned to driver 🚚");
              return { ...order, status: "Processing", assigned: true };
            } else {
              addNotification("No driver available, waiting...");
              return { ...order, status: "Pending Assignment", assigned: false };
            }
          }

          if (newStatus === "Cancelled") {
            addNotification("Order cancelled ❌");
            return { ...order, status: "Cancelled", assigned: false };
          }

          return { ...order, status: newStatus };
        }
        return order;
      })
    );
  };

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Orders Management
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Total ($)</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>#{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.total}</TableCell>
                <TableCell>{getStatusChip(order.status)}</TableCell>

                <TableCell align="center">
                  {order.status === "Pending" && (
                    <>
                      <Button
                        size="small"
                        variant="contained"
                        sx={{ mr: 1 }}
                        onClick={() =>
                          updateStatus(order.id, "Processing")
                        }
                      >
                        Accept
                      </Button>

                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() =>
                          updateStatus(order.id, "Cancelled")
                        }
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}