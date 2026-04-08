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

export default function Users() {
  const users =
  JSON.parse(localStorage.getItem("users")) || [];

  const getRoleChip = (role) => {
    switch (role) {
      case "admin":
        return <Chip label="Admin" color="error" />;
      case "pharmacy":
        return <Chip label="Pharmacy" color="primary" />;
      case "driver":
        return <Chip label="Driver" color="success" />;
      default:
        return <Chip label={role} />;
    }
  };

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Users Management
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>#{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{getRoleChip(user.role)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}