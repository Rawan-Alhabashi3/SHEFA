import {
  Box,
  Typography,
  Grid,
  CardMedia,
  Button,
} from "@mui/material";

import Rating from "@mui/material/Rating";
import { useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { medicines } from "../../data/medicines";
export default function MedicineDetails() {
  const { id } = useParams();
  const {
  addToCart,
  favorites,
  addToFavorites,
  removeFromFavorites,
} = useCart();

  // نفس البيانات مؤقتاً
  

  const med = medicines.find((m) => m.id === Number(id));
  const isFavorite = favorites.some((item) => item.id === med.id);

const handleFavorite = () => {
  if (isFavorite) {
    removeFromFavorites(med.id);
  } else {
    addToFavorites(med);
  }
};
  if (!med) return <Typography>Medicine not found</Typography>;

  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={4}>

        {/* 🖼️ Image */}
        <Grid size={{ xs: 12, md: 6 }}>
          <CardMedia
  component="img"
  image={med.image}
  sx={{
    width: "100%",
    height: { xs: 250, md: 350 },
    objectFit: "cover",
    borderRadius: 3,
  }}
/>
        </Grid>

        {/* 📄 Info */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h4" fontWeight={700} mb={2}>
            {med.name}
          </Typography>

          <Typography color="text.secondary" mb={1}>
            {med.pharmacy}
          </Typography>

          <Rating value={med.rating} readOnly sx={{ mb: 2 }} />

          <Typography mb={2}>
            {med.description}
          </Typography>

          <Typography variant="h5" color="primary" fontWeight={700} mb={3}>
            ${med.price}
          </Typography>

        <Button
            variant="contained"
            sx={{ mr: 2 }}
            onClick={() => addToCart(med)}
        >
            Add to Cart
        </Button>

        <Button
                variant="outlined"
                startIcon={
                    isFavorite ? (
                    <FavoriteIcon color="error" />
                    ) : (
                    <FavoriteBorderIcon />
                    )
                }
                onClick={handleFavorite}
                >
                {isFavorite ? "Remove Favorite" : "Add to Favorites"}
        </Button>
        </Grid>

      </Grid>
    </Box>
  );
}