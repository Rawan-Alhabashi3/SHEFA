import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";

// Contexts
import { AuthProvider } from "./context/AuthContext";
import { OrderProvider } from "./context/OrderContext";
import { DriverProvider } from "./context/DriverContext";
import { NotificationProvider, useNotification } from "./context/NotificationContext";
import { CartProvider } from "./context/CartContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// MUI
import { ThemeProvider, CssBaseline } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import theme from "./theme/theme";
import MedicineDetails from "./pages/public/MedicineDetails";


// 🔔 Global Snackbar Component
function GlobalSnackbar() {
  const { notifications } = useNotification();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (notifications.length > 0) {
      setOpen(true);
    }
  }, [notifications]);

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      message={notifications[0]?.message}
      onClose={() => setOpen(false)}
    />
  );
}


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <OrderProvider>
          <DriverProvider>
            <NotificationProvider>
              <CartProvider>
                <RouterProvider router={router} />
                <GlobalSnackbar /> {/* 🔥 الحل هون */}
              </CartProvider>
            </NotificationProvider>
          </DriverProvider>
        </OrderProvider>

      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);