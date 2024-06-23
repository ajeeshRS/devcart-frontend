import {
  AppBar,
  Box,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useNavigate } from "react-router-dom";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import axios from "axios";
import { getHeaders } from "../../utils/auth";
import "../../styles/ViewProduct.css";
import { BASE_URL } from "../../utils/helpers";

function WishList() {
  const [wishList, setWishList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/wishlist`, {
        headers: getHeaders(),
      });
      setWishList(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [wishList]);

  const removeFromWishList = async (itemId) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/user/wishlist/delete/${itemId}`,
        {
          headers: getHeaders(),
        }
      );
      setWishList((prevWishList) =>
        prevWishList.filter((item) => item._id !== itemId)
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Grid md={12}>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar
           elevation={0}
           position="static"
           sx={{
             position: "fixed",
             top: "0px",
             paddingTop:"5px",
             paddingBottom:"5px",
             zIndex: "1",
             bgcolor: "#fff",
             height: "50px",
           }}
          >
            <Toolbar variant="dense">
              <IconButton
                onClick={() => navigate(-1)}
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2, color: "#7E30E1" }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography
                variant="h6"
                color="inherit"
                component="div"
                sx={{
                  color: "black",
                  fontFamily: "montserrat",
                  fontWeight: 800,
                }}
              >
                Wishlist
              </Typography>
              <Grid position={"absolute"} right={30}>
                <IconButton
                  sx={{ color: "black" }}
                  onClick={() => navigate("/user/cart")}
                >
                  <ShoppingCartOutlinedIcon />
                </IconButton>
              </Grid>
            </Toolbar>
          </AppBar>
        </Box>
      </Grid>
      {loading ? (
        <Grid
          md={12}
          pt={10}
          width={"100%"}
          height={"90svh"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Typography sx={{ color: "grey", fontFamily: "montserrat" }}>
            Loading...
          </Typography>
        </Grid>
      ) : (
        wishList.map((product) => (
          <Grid
            md={12}
            sx={{ cursor: "pointer"}}
            padding={4}
            pt={10}
            border={"1px solid #F8FAE5"}
            display={"flex"}
            flexDirection={"row"}
            width={"100%"}
          >
            <Grid md={4} xs={2}  width={150} sx={{
              paddingLeft:{
                md:"40px"
              }
            }}>
              <img
                className="product-img"
                src={`${BASE_URL}/uploads/${product.image.filename}`}
                alt="product-image"
              />
            </Grid>
            <Grid
            md={6}
              sx={{
                display: "flex",
                flexDirection: {
                  md: "row",
                  sm: "column",
                  xs: "column",
                },
                paddingLeft:{
                  md:"200px",
                  sm:"150px",
                  xs:0
                }
              }}
            >
              <Grid
                md={4}
                pl={2}
                display={"flex"}
                height={"150px"}
                sx={{
                  width:{
                    md:"500px"
                  }
                }}
                flexDirection={"column"}
                justifyContent={"space-between"}
                color={"black"}
              >
                <Link to={`/user/view-product/${product._id}`}>
                  <Typography
                    fontFamily={"poppins"}
                    color={"#607274"}
                    fontWeight={500}
                  >
                    {product.title}
                  </Typography>
                  <Typography
                    fontFamily={"poppins"}
                    fontWeight={500}
                    pt={1}
                    color={"#000"}
                  >
                    {product.brand}
                  </Typography>
                  <Typography
                    fontFamily={"poppins"}
                    fontWeight={500}
                    color={"#000"}
                    pt={1}
                    fontSize={13}
                    width={"200px"}
                  >
                    {product.description}
                  </Typography>
                  <Typography
                    fontFamily={"montserrat"}
                    fontWeight={600}
                    color={"#000"}
                    pt={1}
                  >
                    ₹{product.price}
                  </Typography>
                </Link>
              </Grid>
              <Grid
                md={4}
                display={"flex"}
                height={"150px"}
                alignItems={"center"}
                justifyContent={"flex-start"}
                pl={3}
              >
                <button
                  className="custom-btn"
                  onClick={() => removeFromWishList(product._id)}
                >
                  Remove
                </button>
              </Grid>
            </Grid>
          </Grid>
        ))
      )}
      {wishList.length === 0 && loading === false && (
        <Grid
          md={12}
          pt={10}
          width={"100%"}
          height={"90svh"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Typography sx={{ color: "grey", fontFamily: "montserrat" }}>
            Your wishlist is currently empty. Add some products you love!
          </Typography>
        </Grid>
      )}
    </>
  );
}

export default WishList;
