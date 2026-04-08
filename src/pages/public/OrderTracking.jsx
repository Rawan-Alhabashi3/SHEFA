import {
  Box,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
} from "@mui/material";
import Rating from "@mui/material/Rating";
import { useOrders } from "../../context/OrderContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const steps = ["Pending", "Processing", "Delivered"];

export default function OrderTracking() {
  const { orders, setOrders } = useOrders();
  const [ratings, setRatings] = useState({});
  const navigate = useNavigate();

  const getStep = (status) => {
    switch (status) {
      case "Pending":
        return 0;
      case "Processing":
        return 1;
      case "Delivered":
        return 2;
      default:
        return 0;
    }
  };

  const handleSubmitRating = (orderId) => {
    if (!ratings[orderId]) return;

    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, rating: ratings[orderId] }
          : order
      )
    );
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3}>
        My Orders
      </Typography>

      {orders.length === 0 ? (
        <Typography>No orders yet</Typography>
      ) : (
        orders.map((order) => (
          <Paper
            key={order.id}
            sx={{
              p: 3,
              mb: 3,
              cursor: "pointer",
              transition: "0.2s",
              "&:hover": { boxShadow: 4 },
            }}
            onClick={() => navigate(`/order/${order.id}`)}
          >
            <Typography fontWeight={600}>
              Order #{order.id}
            </Typography>

            <Typography mb={1}>
              Total: ${order.total}
            </Typography>

            <Typography mb={2}>
              Status: {order.status}
            </Typography>

            <Stepper
              activeStep={getStep(order.status)}
              sx={{ mb: 2 }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* ⭐ Rating */}
            {order.status === "Delivered" && (
              <Box
                onClick={(e) => e.stopPropagation()} // 🔥 مهم
              >
                {order.rating ? (
                  <>
                    <Typography mb={1}>
                      Your Rating
                    </Typography>
                    <Rating value={order.rating} readOnly />
                  </>
                ) : (
                  <>
                    <Typography mb={1}>
                      Rate your experience
                    </Typography>

                    <Rating
                      value={ratings[order.id] || 0}
                      onChange={(e, newValue) =>
                        setRatings({
                          ...ratings,
                          [order.id]: newValue,
                        })
                      }
                    />

                    <Button
                      variant="contained"
                      sx={{ mt: 1 }}
                      onClick={() =>
                        handleSubmitRating(order.id)
                      }
                    >
                      Submit
                    </Button>
                  </>
                )}
              </Box>
            )}
          </Paper>
        ))
      )}
    </Box>
  );
}