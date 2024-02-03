import React from "react";
import {
  AppBar,
  Box,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useParams } from "react-router-dom";

function ViewMoreNav() {
  const navigate = useNavigate();

  const hanldeBackButton = () => {
    navigate("/user/home");
  };

  const { category } = useParams();

  const caps = category.charAt(0).toUpperCase() + category.slice(1);
  console.log(category);
  return (
    <Grid md={12}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          elevation={0}
          position="static"
          sx={{
            position: "fixed",
            top: "0px",
            zIndex: "1",
            bgcolor: "#fff",
          }}
        >
          <Toolbar variant="dense">
            <IconButton
              onClick={hanldeBackButton}
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 ,color:'#7E30E1'}}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" component="div" sx={{color:"black",fontFamily:"montserrat",fontWeight:800}}>
              {caps}
            </Typography>
            <Grid position={"absolute"} right={30}>
              <IconButton
                sx={{ color: "black" }}
                onClick={() => navigate("/user/wishlist")}
              >
                <FavoriteIcon />
              </IconButton>
              <IconButton sx={{ color: "black" }}>
                <ShoppingCartOutlinedIcon />
              </IconButton>
            </Grid>
          </Toolbar>
        </AppBar>
      </Box>
    </Grid>
  );
}

export default ViewMoreNav;
