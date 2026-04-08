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
} from "@mui/material";

export default function Payments() {
  const payments = [
    { id: 1, orderId: 101, amount: 45, status: "Paid" },
    { id: 2, orderId: 102, amount: 120, status: "Pending" },
  ];

  const getStatusChip = (status) => {
    return status === "Paid" ? (
      <Chip label="Paid" color="success" />
    ) : (
      <Chip label="Pending" color="warning" />
    );
  };

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Payments Monitoring
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Payment ID</TableCell>
              <TableCell>Order ID</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {payments.map((p) => (
              <TableRow key={p.id}>
                <TableCell>#{p.id}</TableCell>
                <TableCell>#{p.orderId}</TableCell>
                <TableCell>${p.amount}</TableCell>
                <TableCell>{getStatusChip(p.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}