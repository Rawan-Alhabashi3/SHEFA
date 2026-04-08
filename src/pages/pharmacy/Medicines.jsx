import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Medicines() {
  const [medicines, setMedicines] = useState([
    { id: 1, name: "Panadol", price: 5, quantity: 10, expiry: "2026-05-01" },
    { id: 2, name: "Amoxicillin", price: 12, quantity: 2, expiry: "2025-04-10" },
  ]);

  const [open, setOpen] = useState(false);
  const [editingMed, setEditingMed] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
    expiry: "",
  });

  const getStatus = (quantity) => {
    if (quantity <= 0)
      return <Chip label="Out of Stock" color="error" />;
    if (quantity <= 3)
      return <Chip label="Low Stock" color="warning" />;
    return <Chip label="In Stock" color="success" />;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = () => {
    if (!form.name || !form.price || !form.quantity || !form.expiry) return;

    if (editingMed) {
      setMedicines(
        medicines.map((med) =>
          med.id === editingMed.id
            ? {
                ...med,
                ...form,
                price: Number(form.price),
                quantity: Number(form.quantity),
              }
            : med
        )
      );
    } else {
      setMedicines([
        ...medicines,
        {
          ...form,
          id: Date.now(),
          price: Number(form.price),
          quantity: Number(form.quantity),
        },
      ]);
    }

    setForm({ name: "", price: "", quantity: "", expiry: "" });
    setEditingMed(null);
    setOpen(false);
  };

  const handleEdit = (med) => {
    setEditingMed(med);
    setForm(med);
    setOpen(true);
  };

  const handleDelete = (id) => {
    setMedicines(medicines.filter((med) => med.id !== id));
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Medicines Management
      </Typography>

      <Button
        variant="contained"
        sx={{ mb: 3 }}
        onClick={() => setOpen(true)}
      >
        Add Medicine
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Price ($)</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Expiry Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {medicines.map((med) => (
              <TableRow key={med.id}>
                <TableCell>{med.name}</TableCell>
                <TableCell>{med.price}</TableCell>
                <TableCell>{med.quantity}</TableCell>
                <TableCell>{med.expiry}</TableCell>
                <TableCell>{getStatus(med.quantity)}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleEdit(med)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(med.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          {editingMed ? "Edit Medicine" : "Add New Medicine"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            name="name"
            fullWidth
            value={form.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Price"
            type="number"
            name="price"
            fullWidth
            value={form.price}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Quantity"
            type="number"
            name="quantity"
            fullWidth
            value={form.quantity}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            type="date"
            name="expiry"
            fullWidth
            value={form.expiry}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddOrUpdate}>
            {editingMed ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}