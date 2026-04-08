import { useAuth } from "../../context/AuthContext";
import PharmacyDashboard from "../pharmacy/PharmacyDashboard";
import DriverDashboard from "../driver/DriverDashboard";
import AdminDashboard from "../admin/AdminDashboard";

export default function RoleBasedDashboard() {
  const { user } = useAuth();

  if (user?.role === "driver") return <DriverDashboard />;
  if (user?.role === "admin") return <AdminDashboard />;

  return <PharmacyDashboard />;
}