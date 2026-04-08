import { Grid } from "@mui/material";
import StatsCard from "../components/StatsCard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function DriverDashboard() {
  return (
    <Grid container spacing={3}>
      
      <Grid size={{ xs: 12, md: 4 }}>
        <StatsCard
          title="Assigned Orders"
          value="8"
          icon={<AssignmentIcon color="primary" fontSize="large" />}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <StatsCard
          title="In Progress"
          value="3"
          icon={<LocalShippingIcon color="warning" fontSize="large" />}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <StatsCard
          title="Delivered Today"
          value="12"
          icon={<CheckCircleIcon color="success" fontSize="large" />}
        />
      </Grid>

    </Grid>
  );
}