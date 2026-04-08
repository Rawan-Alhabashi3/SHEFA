import { Box, Typography, Paper, Avatar } from "@mui/material";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Profile
      </Typography>

      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Avatar sx={{ width: 80, height: 80, mb: 2 }}>
          {user?.role?.charAt(0).toUpperCase()}
        </Avatar>

        <Typography variant="h6">
          Role: {user?.role}
        </Typography>
      </Paper>
    </Box>
  );
}