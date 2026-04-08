import { useMemo } from "react";
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

export default function Inventory() {
  const medicines = [
    { id: 1, name: "Panadol", quantity: 10, expiry: "2026-05-01" },
    { id: 2, name: "Amoxicillin", quantity: 2, expiry: "2025-04-10" },
    { id: 3, name: "Vitamin C", quantity: 1, expiry: "2024-04-01" },
    { id: 4, name: "Ibuprofen", quantity: 15, expiry: "2026-08-15" },
  ];

  const today = new Date();

  const lowStock = useMemo(
    () => medicines.filter((med) => med.quantity <= 3),
    []
  );

  const expiringSoon = useMemo(
    () =>
      medicines.filter((med) => {
        const expiryDate = new Date(med.expiry);
        const diff = (expiryDate - today) / (1000 * 60 * 60 * 24);
        return diff <= 30;
      }),
    []
  );

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Inventory Monitoring
      </Typography>

      <Grid container spacing={3}>
        {/* Low Stock Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" mb={2}>
              Low Stock Medicines
            </Typography>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {lowStock.map((med) => (
                  <TableRow key={med.id}>
                    <TableCell>{med.name}</TableCell>
                    <TableCell>{med.quantity}</TableCell>
                    <TableCell>
                      <Chip label="Low Stock" color="warning" />
                    </TableCell>
                  </TableRow>
                ))}

                {lowStock.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3}>
                      No low stock medicines
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        {/* Expiring Soon Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" mb={2}>
              Expiring Soon (≤ 30 Days)
            </Typography>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Expiry Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {expiringSoon.map((med) => (
                  <TableRow key={med.id}>
                    <TableCell>{med.name}</TableCell>
                    <TableCell>{med.expiry}</TableCell>
                    <TableCell>
                      <Chip label="Expiring Soon" color="error" />
                    </TableCell>
                  </TableRow>
                ))}

                {expiringSoon.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3}>
                      No medicines expiring soon
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}