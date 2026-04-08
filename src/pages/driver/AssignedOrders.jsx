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

export default function AssignedOrders() {
  const { orders, setOrders } = useOrders();
  const { available } = useDriver();

  const assignedOrders = orders.filter((order) => order.assigned);

  const getStatusChip = (status) => {
    switch (status) {
      case "Processing":
        return <Chip label="In Progress" color="warning" />;
      case "Delivered":
        return <Chip label="Delivered" color="success" />;
      default:
        return <Chip label={status} />;
    }
  };

  const updateStatus = (id, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Assigned Orders
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
                <TableCell>{getStatusChip(order.status)}</TableCell>

                <TableCell align="center">
                  {order.status === "Processing" && (
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() =>
                        updateStatus(order.id, "Delivered")
                      }
                    >
                      Mark Delivered
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}

            {assignedOrders.length === 0 && (
              <TableRow>
                <TableCell colSpan={4}>
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