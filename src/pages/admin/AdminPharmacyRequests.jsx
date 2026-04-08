import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import { useState, useEffect } from "react";

export default function AdminPharmacyRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // نجيب فقط الصيدليات pending
    const pending = users.filter(
      (u) => u.role === "pharmacy" && u.status === "pending"
    );

    setRequests(pending);
  }, []);

  // ✅ الموافقة
  const handleApprove = (id) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const updated = users.map((u) => {
      if (u.id === id) {
        return { ...u, status: "approved" };
      }
      return u;
    });

    localStorage.setItem("users", JSON.stringify(updated));

    // تحديث الواجهة
    setRequests((prev) => prev.filter((u) => u.id !== id));
  };

  // ❌ الرفض (اختياري)
  const handleReject = (id) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const updated = users.filter((u) => u.id !== id);

    localStorage.setItem("users", JSON.stringify(updated));

    setRequests((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3}>
        Pharmacy Requests 👑
      </Typography>

      {requests.length === 0 ? (
        <Typography>No pending requests</Typography>
      ) : (
        requests.map((u) => (
          <Card key={u.id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography fontWeight={600}>{u.name}</Typography>
              <Typography>{u.email}</Typography>

              <Typography>
                Pharmacy: {u.pharmacyName}
              </Typography>

              <Typography>
                Location: {u.location}
              </Typography>

              <Typography>
                Specialist: {u.isSpecialist ? "Yes" : "No"}
              </Typography>

              {/* 📄 PDF */}
              {u.pdf && (
                <Typography sx={{ mt: 1 }}>
                  File: {u.pdf}
                </Typography>
              )}

              <Button
                variant="contained"
                sx={{ mt: 2, mr: 1 }}
                onClick={() => handleApprove(u.id)}
              >
                Approve
              </Button>

              <Button
                color="error"
                sx={{ mt: 2 }}
                onClick={() => handleReject(u.id)}
              >
                Reject
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
}