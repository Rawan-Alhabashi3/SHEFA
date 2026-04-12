import {
  Grid,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Box,
  Button,
} from "@mui/material";
import StatsCard from "../../components/StatsCard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useOrders } from "../../context/OrderContext";

export default function DriverDashboard() {
  const { orders, setOrders } = useOrders();

  // 🟢 الطلبات يلي جاهزة للدرايفر
  const driverOrders = orders.filter(
    (o) => o.status === "Processing"
  );

  const handleDeliver = (id) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id
          ? { ...order, status: "Delivered" }
          : order
      )
    );
  };

  const getStatusChip = (status) => {
    switch (status) {
      case "Processing":
        return <Chip label="Processing" color="warning" />;
      case "Delivered":
        return <Chip label="Delivered" color="success" />;
      default:
        return <Chip label={status} />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <StatsCard
            title="Assigned Orders"
            value={driverOrders.length}
            icon={<AssignmentIcon color="primary" fontSize="large" />}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <StatsCard
            title="In Progress"
            value={driverOrders.length}
            icon={<LocalShippingIcon color="warning" fontSize="large" />}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <StatsCard
            title="Delivered Today"
            value={
              orders.filter((o) => o.status === "Delivered").length
            }
            icon={<CheckCircleIcon color="success" fontSize="large" />}
          />
        </Grid>
      </Grid>

      {/* 🚚 Orders Table */}
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" mb={2}>
          Assigned Orders
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {driverOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>#{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>
                  {getStatusChip(order.status)}
                </TableCell>

                <TableCell>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => handleDeliver(order.id)}
                  >
                    Mark as Delivered
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}