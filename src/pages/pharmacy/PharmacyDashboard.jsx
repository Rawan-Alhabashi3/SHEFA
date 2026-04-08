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
} from "@mui/material";
import StatsCard from "../../components/StatsCard";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import AssignmentIcon from "@mui/icons-material/Assignment";
import InventoryIcon from "@mui/icons-material/Inventory";
import PaidIcon from "@mui/icons-material/Paid";

export default function PharmacyDashboard() {
  const recentOrders = [
    { id: 101, customer: "Ahmad", status: "Processing" },
    { id: 102, customer: "Sara", status: "Delivered" },
    { id: 103, customer: "Omar", status: "Cancelled" },
  ];

  const getStatusChip = (status) => {
    switch (status) {
      case "Delivered":
        return <Chip label="Delivered" color="success" />;
      case "Processing":
        return <Chip label="Processing" color="warning" />;
      case "Cancelled":
        return <Chip label="Cancelled" color="error" />;
      default:
        return <Chip label={status} />;
    }
  };

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Pharmacy Dashboard
      </Typography>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={3}>
          <StatsCard
            title="Total Orders"
            value="128"
            icon={<AssignmentIcon color="primary" fontSize="large" />}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <StatsCard
            title="Total Medicines"
            value="54"
            icon={<LocalPharmacyIcon color="primary" fontSize="large" />}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <StatsCard
            title="Low Stock"
            value="6"
            icon={<InventoryIcon color="warning" fontSize="large" />}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <StatsCard
            title="Total Revenue"
            value="$4,320"
            icon={<PaidIcon color="success" fontSize="large" />}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" mb={2}>
              Recent Orders
            </Typography>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{getStatusChip(order.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}