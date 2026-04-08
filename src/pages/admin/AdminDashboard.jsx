import {
  Box,
  Typography,
  Grid,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from "@mui/material";
import { useOrders } from "../../context/OrderContext";
import StatsCard from "../../components/StatsCard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";

export default function AdminDashboard() {
  const { orders } = useOrders();

  // 🟢 pending pharmacies
  const [pendingPharmacies, setPendingPharmacies] = useState([]);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const pending = users.filter(
      (u) => u.role === "pharmacy" && u.status === "pending"
    );

    setPendingPharmacies(pending);
  }, []);

  // ✅ approve
  const handleApprove = (id) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const updated = users.map((u) =>
      u.id === id ? { ...u, status: "approved" } : u
    );

    localStorage.setItem("users", JSON.stringify(updated));

    setPendingPharmacies((prev) =>
      prev.filter((u) => u.id !== id)
    );
  };

  // ❌ reject
  const handleReject = (id) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

   const updated = users.map((u) =>
  u.id === id ? { ...u, status: "rejected" } : u
);

    localStorage.setItem("users", JSON.stringify(updated));

    setPendingPharmacies((prev) =>
      prev.filter((u) => u.id !== id)
    );
  };

  // 📊 stats
  const totalOrders = orders.length;
  const delivered = orders.filter((o) => o.status === "Delivered").length;
  const cancelled = orders.filter((o) => o.status === "Cancelled").length;

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

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Admin Dashboard
      </Typography>

      {/* Stats */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <StatsCard
            title="Total Orders"
            value={totalOrders}
            icon={<AssignmentIcon color="primary" fontSize="large" />}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <StatsCard
            title="Delivered"
            value={delivered}
            icon={<CheckCircleIcon color="success" fontSize="large" />}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <StatsCard
            title="Cancelled"
            value={cancelled}
            icon={<CancelIcon color="error" fontSize="large" />}
          />
        </Grid>
      </Grid>

      {/* 🏥 Pharmacy Requests */}
      <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Typography variant="h6" mb={2}>
          Pharmacy Requests 🏥
        </Typography>

        {pendingPharmacies.length === 0 ? (
          <Typography>No pending requests</Typography>
        ) : (
          pendingPharmacies.map((u) => (
            <Box
              key={u.id}
              sx={{
                mb: 2,
                p: 2,
                borderRadius: 2,
                backgroundColor: "#f5f5f5",
              }}
            >
              <Typography fontWeight={600}>{u.name}</Typography>
              <Typography>{u.email}</Typography>
              <Typography>Pharmacy: {u.pharmacyName}</Typography>
              <Typography>Location: {u.location}</Typography>
              <Typography>
                Specialist: {u.isSpecialist ? "Yes" : "No"}
              </Typography>

              <Typography>File: {u.pdf}</Typography>

              <Button
                variant="contained"
                sx={{ mt: 1, mr: 1 }}
                onClick={() => handleApprove(u.id)}
              >
                Approve
              </Button>

              <Button
                color="error"
                sx={{ mt: 1 }}
                onClick={() => handleReject(u.id)}
              >
                Reject
              </Button>
            </Box>
          ))
        )}
      </Paper>

      {/* Orders Table */}
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" mb={2}>
          All Orders
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>#{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.total}</TableCell>
                <TableCell>{getStatusChip(order.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}