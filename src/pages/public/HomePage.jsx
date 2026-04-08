import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Button,
  Badge,
  AppBar,
  Toolbar,
  IconButton,
  Dialog,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import Autocomplete from "@mui/material/Autocomplete";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import heroImage from "../../assets/images/hero.jpg";
import Rating from "@mui/material/Rating";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { medicines } from "../../data/medicines";
export default function HomePage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [openSearch, setOpenSearch] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  
const { addToCart, cart, favorites, addToFavorites, removeFromFavorites } = useCart();
  const ads = JSON.parse(localStorage.getItem("ads")) || [];

  const toggleFavorite = (med) => {
  const exists = favorites.find((item) => item.id === med.id);

  if (exists) {
    removeFromFavorites(med.id);
  } else {
    addToFavorites(med);
  }
};
  const filteredMeds = medicines.filter((med) =>
    med.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box  sx={{
  
  }}>

      {/* 🔥 HEADER */}
      <AppBar sx={{ backgroundColor: "white", color: "black" }}>
          <Toolbar>
            <Box
              sx={{
                maxWidth: "1200px",
                width: "100%",
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
                <IconButton
                    sx={{ display: { xs: "block", md: "none" } }}
                    onClick={() => setOpenMenu(true)}
                    >
                    <MenuIcon />
                </IconButton>

                <Drawer open={openMenu} onClose={() => setOpenMenu(false)}>
  <Box sx={{ width: 250, p: 2 }}>
    <Button fullWidth>Home</Button>
    <Button fullWidth>Medicines</Button>
    <Button fullWidth>Services</Button>
    <Button fullWidth>About</Button>
    <Button fullWidth>Sell</Button>
  </Box>
</Drawer>
              {/* 🟢 LEFT */}
              <Box
                sx={{
                display: { xs: "none", md: "flex" },
                gap: 2,
                }}
                >
                  <IconButton
          sx={{ display: { xs: "block", md: "none" } }}
          onClick={() => setOpenMenu(true)}
                  >
                  </IconButton>
                <Button onClick={() => navigate("/")}>Home</Button>
                <Button onClick={() => navigate("/")}>Medicines</Button>
                <Button
                      onClick={() => {
                        document.getElementById("services").scrollIntoView({
                          behavior: "smooth",
                        });
                      }}
                    >
                      Services
                </Button> 
                <Button
                      onClick={() => {
                        document.getElementById("about").scrollIntoView({
                          behavior: "smooth",
                        });
                      }}
                    >
                      About
                </Button>
                <Button onClick={() => navigate("/create-ad")}>Sell</Button>
                <Button onClick={() => navigate("/favorites")}>
                  Favorites
                </Button>
              </Box>

              {/* 🟢 CENTER (LOGO) */}
              <Typography fontWeight={700} fontSize={20}>
                Shifa 💊
              </Typography>

              {/* 🟢 RIGHT */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

                
                
                <IconButton onClick={() => setOpenSearch(true)}>
                  <SearchIcon />
                </IconButton>

                <IconButton onClick={() => navigate("/cart")}>
                  <Badge badgeContent={cart.length} color="error">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>

                <Button onClick={() => navigate("/login")}>
                  Login
                </Button>
              </Box>

            </Box>
          </Toolbar>
    </AppBar>

      {/* 🔍 SEARCH POPUP */}
      <Dialog open={openSearch} onClose={() => setOpenSearch(false)} fullWidth>
        <Box sx={{ p: 3 }}>
          <Autocomplete
            options={medicines}
            getOptionLabel={(option) => option.name}
            onChange={(e, value) => {
              if (value) {
                setSearch(value.name);
                setOpenSearch(false);
              }
            }}
            renderInput={(params) => (
              <TextField {...params} placeholder="Search medicines..." />
            )}
          />
        </Box>
      </Dialog>

      {/* CONTENT */}
      <Box sx={{ p: 4 }}>

        {/* Hero */}
<Box
  sx={{
    position: "relative",
    height: { xs: 300, md: 450 },
    borderRadius: 3,
    overflow: "hidden",
    mb: 5,
  }}
>

  {/* 🖼️ Background Image */}
  <Box
    sx={{
      position: "absolute",
      width: "100%",
      height: "100%",
      backgroundImage: `url(${heroImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  />

  {/* 🎨 Overlay */}
  <Box
    sx={{
      position: "absolute",
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.4)",
    }}
  />

  {/* 📝 Content */}
  <Box
    sx={{
      position: "relative",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      color: "white",
      textAlign: "center",
      px: 2,
    }}
  >
    <Typography variant="h4" fontWeight={700} mb={2}>
      Smart Medical Delivery Platform 💊
    </Typography>

    <Typography mb={3}>
      Order, sell, and receive medicines بسهولة وسرعة
    </Typography>

    <Button
      variant="contained"
      sx={{
        backgroundColor: "white",
        color: "#1976d2",
        fontWeight: 600,
      }}
    >
      Explore Now
    </Button>
  </Box>

</Box>

        {/* About */}
        <Box id="about" sx={{ mb: 6 , scrollMarginTop: "80px" }}>
          <Typography variant="h5" fontWeight={700} mb={2}>
            About Shifa 💊
          </Typography>

          <Typography color="text.secondary" sx={{ maxWidth: 600 }}>
            Shifa is a smart platform that connects people with nearby pharmacies,
            making it easy to order, sell, and receive medicines quickly and safely.
          </Typography>
        </Box>

        {/* Services */}
          <Box id="services" sx={{ mb: 6, scrollMarginTop: "80px" }}>
            <Typography variant="h5" fontWeight={700} mb={3}>
              Our Services 🚀
            </Typography>

            <Grid container spacing={3}>
              {[
                { title: "Order Medicine", desc: "Order medicines بسهولة من أقرب صيدلية" },
                { title: "Sell Medicine", desc: "اعرض أدويتك للبيع بكل سهولة" },
                { title: "Fast Delivery", desc: "توصيل سريع وآمن لبيتك" },
                { title: "Marketplace", desc: "سوق لبيع وشراء الأدوية" },
              ].map((s, i) => (
                <Grid size={{ xs: 12, md: 3 }} key={i}>
                  <Card
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      transition: "0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    <Typography fontWeight={600} mb={1}>
                      {s.title}
                    </Typography>

                    <Typography color="text.secondary">
                      {s.desc}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
        </Box>    

        

        {/* Ads */}
        <Typography variant="h6" mb={2}>
          Marketplace Ads
        </Typography>

        <Grid container spacing={2} mb={4}>
          {ads.map((ad) => (
            <Grid size={{ xs: 12, md: 6 }} key={ad.id}>
              <Card sx={{ p: 2 }}>
                <Typography>{ad.title}</Typography>
                <Typography>${ad.price}</Typography>

                <Button
                  fullWidth
                  sx={{ mt: 2 }}
                  variant="contained"
                  onClick={() =>
                    addToCart({
                      name: ad.title,
                      price: ad.price,
                    })
                  }
                >
                  Buy
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
            
          
          {/* pharmacy */}
          <Box sx={{ mb: 6 }}>
              <Typography variant="h5" fontWeight={700} mb={3}>
                Pharmacies 🏥
              </Typography>

              <Grid container spacing={3}>
                {["Al Shifa", "Care Pharmacy"].map((ph, i) => (
                  <Grid size={{ xs: 12, md: 4 }} key={i}>
                    <Card sx={{ p: 3, borderRadius: 3 }}>
                      <Typography fontWeight={600}>{ph}</Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
          </Box>
        {/* Medicines */}
        <Typography variant="h6" mb={2}>
          Medicines
        </Typography>

        <Grid container spacing={3}>
            {filteredMeds.map((med) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={med.id}>
                <Card
                  sx={{
                    borderRadius: 4,
                    overflow: "hidden",
                    transition: "0.3s",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: 6,
                    },
                  }}
                  onClick={() => navigate(`/medicine/${med.id}`)}
                >
          <Box sx={{ position: "relative" }}>
            <CardMedia
                component="img"
                height="160"
                image="https://picsum.photos/400/200"
              />

              <IconButton
                  onClick={(e) => {
                  e.stopPropagation(); 
                  toggleFavorite(med);
                  }}
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    backgroundColor: "white",
                  }}
                >
                  {favorites.some((item) => item.id === med.id) ? (
                    <FavoriteIcon color="error" />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
              </IconButton>

          </Box>

                 <CardContent>
                    <Typography fontWeight={600}>
                      {med.name}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      {med.pharmacy}
                    </Typography>
                    <Rating
                      value={med.rating}
                      readOnly
                      size="small"
                      sx={{ mt: 1 }}
                    />

                    <Typography fontWeight={700} color="primary" sx={{ mt: 1 }}>
                      ${med.price}
                    </Typography>

                    <Button
                      fullWidth
                      variant="contained"
                      sx={{ mt: 2 }}
                      onClick={(e) => {
                      e.stopPropagation(); 
                      addToCart(med);
                      }}
                    >
                      Add to Cart
                    </Button>
                </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>

      </Box>

      {/* Footer */}
      <Box
        sx={{
          mt: 5,
          p: 3,
          textAlign: "center",
          backgroundColor: "#1976d2",
          color: "white",
        }}
      >
        © 2026 Shifa Platform
      </Box>

    </Box>
  );
}