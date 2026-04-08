import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";
import { useState, useEffect } from "react";

export default function AdsReview() {
  const [ads, setAds] = useState([]);

  // 🔥 تحميل الإعلانات عند فتح الصفحة
  useEffect(() => {
    const storedAds =
      JSON.parse(localStorage.getItem("ads")) || [];
    setAds(storedAds);
  }, []);

  const updateAds = (updated) => {
    setAds(updated);
    localStorage.setItem("ads", JSON.stringify(updated));
  };

  const handleApprove = (id) => {
    const updated = ads.map((ad) =>
      ad.id === id ? { ...ad, status: "Approved" } : ad
    );
    updateAds(updated);
  };

  const handleReject = (id) => {
    const updated = ads.map((ad) =>
      ad.id === id ? { ...ad, status: "Rejected" } : ad
    );
    updateAds(updated);
  };

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Ads Review
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Medicine</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {ads.map((ad) => (
              <TableRow key={ad.id}>
                <TableCell>#{ad.id}</TableCell>
                <TableCell>{ad.title}</TableCell>
                <TableCell>${ad.price}</TableCell>
                <TableCell>{ad.status}</TableCell>

                <TableCell>
                  <Button
                    variant="contained"
                    sx={{ mr: 1 }}
                    onClick={() => handleApprove(ad.id)}
                  >
                    Approve
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleReject(ad.id)}
                  >
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}