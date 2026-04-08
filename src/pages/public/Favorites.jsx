import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import { useCart } from "../../context/CartContext";
import { Grid } from "@mui/material";
export default function Favorites() {
  const { favorites, addToCart, removeFromFavorites } = useCart();

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" mb={3}>
        My Favorites ❤️
      </Typography>

      {!favorites?.length ? (
        <Typography>No favorites yet</Typography>
      ) : (
        <Grid container spacing={3}>
            {favorites.map((item) => (
        <Grid size={{ xs: 12, md: 4 }} key={item.id}>
          <Card key={item.id} sx={{ mb: 2 }}>
            
            <CardContent>
                <Typography fontWeight={600}>{item.name}</Typography>

                <Typography color="text.secondary">
                    {item.pharmacy}
                </Typography>

                {item.price && (
                    <Typography color="text.secondary">
                    ${item.price}
                    </Typography>
                )}

                <Button
                    variant="contained"
                    sx={{ mt: 2, mr: 1 }}
                    onClick={() => addToCart(item)}
                >
                    Add to Cart
                </Button>

                <Button
                    variant="outlined"
                    color="error"
                    sx={{ mt: 2 }}
                    onClick={() => removeFromFavorites(item.id)}
                    >
                 Remove
                </Button>
            </CardContent>
          </Card>
          </Grid>
        ))}
        </Grid>
      )}
    </Box>
  );
}