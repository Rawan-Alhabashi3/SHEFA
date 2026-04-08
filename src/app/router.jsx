import { createBrowserRouter } from "react-router-dom";

// Auth
import Login from "../pages/auth/Login";

// Public
import HomePage from "../pages/public/HomePage";

// Layout + Protection
import ProtectedRoute from "../components/ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";

// Role-based dashboard
import RoleBasedDashboard from "../pages/RoleBasedDashboard";

// Pharmacy
import Orders from "../pages/pharmacy/Orders";
import Medicines from "../pages/pharmacy/Medicines";
import Inventory from "../pages/pharmacy/Inventory";

// Driver
import AssignedOrders from "../pages/driver/AssignedOrders";

// Admin
import Users from "../pages/admin/Users";
import Payments from "../pages/admin/Payments";
import AdsReview from "../pages/admin/AdsReview";

// Profile
import Profile from "../pages/Profile";
import CartPage from "../pages/public/CartPage";
import OrderTracking from "../pages/public/OrderTracking";
import OrderSuccess from "../pages/public/OrderSuccess";
import PaymentSuccess from "../pages/public/PaymentSuccess";
import PaymentCancel from "../pages/public/PaymentCancel";
import CreateAd from "../pages/public/CreateAd";
import OrderDetails from "../pages/public/OrderDetails";
import Register from "../pages/auth/Register";
import Favorites from "../pages/public/Favorites";
import MedicineDetails from "../pages/public/MedicineDetails";

import Checkout from "../pages/public/Checkout";

import PharmacyRegister from "../pages/public/PharmacyRegister";

import AdminPharmacyRequests from "../pages/admin/AdminPharmacyRequests";



export const router = createBrowserRouter([
  // 🌐 Public
  {
    path: "/",
    element: <HomePage />,
  },

  // 🔐 Login
  {
    path: "/login",
    element: <Login />,
  },

  // 🛡 Protected Routes
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <RoleBasedDashboard />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },

  // Pharmacy Routes
  {
    path: "/orders",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <Orders />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/medicines",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <Medicines />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/inventory",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <Inventory />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },

  // Driver
  {
    path: "/assigned-orders",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <AssignedOrders />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },

  // Admin
  {
    path: "/users",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <Users />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/payments",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <Payments />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/ads",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <AdsReview />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },

  // Profile
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <Profile />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
  path: "/cart",
  element: <CartPage />,
},
{
  path: "/orders-tracking",
  element: <OrderTracking />,
},
{
  path: "/order-success",
  element: <OrderSuccess />,
},
{
  path: "/payment-success",
  element: <PaymentSuccess />,
},
{
  path: "/payment-cancel",
  element: <PaymentCancel />,
},
{
  path: "/create-ad",
  element: <CreateAd />,
},
{
  path: "/order/:id",
  element: <OrderDetails />,
},

{
  path: "/register",
  element: <Register />,
},
{
  path: "/favorites",
  element: <Favorites />,
},
{
    path: "/medicine/:id",
    element: <MedicineDetails />, 
  },
  {
  path: "/checkout",
  element: <Checkout />,
},
{
  path: "/pharmacy-register",
  element: <PharmacyRegister />,
},
{
  path: "/admin/requests",
  element: <AdminPharmacyRequests />,
},
]);
