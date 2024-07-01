import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  AppBar,
  Badge,
  Box,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import "../../styles/ViewProduct.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getHeaders } from "../../utils/auth";
import ShoppingCartOutlined from "@mui/icons-material/ShoppingCartOutlined";
import { ToastContainer } from "react-toastify";
import { notify, notifyAddToWishlist, notifyErr } from "../../utils/toastify";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import { BASE_URL } from "../../utils/helpers";
function ViewProduct() {
  const navigate = useNavigate();

  const handleBackButton = () => {
    navigate(-1);
  };
  const [product, setProduct] = useState(null);
  const [cartItemCount, setCartItemCount] = useState([]);
  const { id } = useParams();

  const fetchCartItemCount = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/cart`, {
        headers: getHeaders(),
      });
      setCartItemCount(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchCartItemCount();
  }, [cartItemCount]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/get-product/${id}`, {
          headers: getHeaders(),
        });

        setProduct(response.data.data);
        // console.log(response.data.message);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProductDetails();
  }, []);

  const handleAddToCartButton = async (productId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/user/cart/${productId}`,
        {},
        {
          headers: getHeaders(),
        }
      );
      if (response.status == 200) {
        notify();
      }
    } catch (error) {
      console.log(error);
      notifyErr();
    }
  };

  const handleAddToWishlist = async (productId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/user/wishlist/${productId}`,
        {},
        {
          headers: getHeaders(),
        }
      );
      notifyAddToWishlist();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {product ? (
        <>
          {/* navbar */}
          <Grid md={12}>
            <Box sx={{ flexGrow: 1 }}>
              <AppBar
                elevation={0}
                position="static"
                sx={{
                  position: "fixed",
                  width: "100%",
                  top: "0px",
                  zIndex: "1",
                  bgcolor: "#fff",
                }}
              >
                <Toolbar
                  variant="dense"
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <IconButton
                    onClick={() => handleBackButton()}
                    edge="start"
                    style={{ color: "#7E30E1" }}
                    aria-label="menu"
                    sx={{ mr: 2 }}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                  <Grid md={12}>
                    <Link to={"/user/wishlist"}>
                      <IconButton sx={{ color: "black", marginRight: "10px" }}>
                        <FavoriteBorder />
                      </IconButton>
                    </Link>
                    <Link to={"/user/cart"}>
                      <Badge
                        badgeContent={cartItemCount.length}
                        color="primary"
                      >
                        <ShoppingCartOutlined sx={{ color: "black" }} />
                      </Badge>
                    </Link>
                  </Grid>
                </Toolbar>
              </AppBar>
            </Box>
          </Grid>
          {/* navbar ends */}
          <Grid
            md={12}
            width={"100%"}
            height={"90svh"}
            display={"flex"}
            sx={{
              flexDirection: {
                md: "row",
                sm: "column",
                xs: "column",
              },
              justifyContent: {
                md: "space-between",
                sm: "center",
                xs: "center",
              },
              marginTop: {
                sm: "45px",
                xs: "45px",
              },
            }}
            alignItems={"center"}
          >
            <Grid
              md={6}
              sm={12}
              xs={12}
              sx={{
                width: {
                  md: "50%",
                  sm: "100vw",
                  xs: "100vw",
                },
              }}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              {/* product image */}
              <Grid className="product-image" mb={1}>
                <img
                  style={{ width: "300px", height: "300px" }}
                  src={`${BASE_URL}/uploads/${product.image.filename}`}
                  alt="product-img"
                />
              </Grid>
            </Grid>
            {/* product texts */}
            <Grid
              md={6}
            // p={8}
            pl={5}
            pr={5}
              sx={{
                width: {
                  md: "50%",
                  sm:"100%",
                  xs:"100%"
                },
              }}
              display={"flex"}
              flexDirection={"column"}
              alignItems={"space-between"}
              justifyContent={"center"}
            >
              <Typography
                sx={{
                  fontFamily: "montserrat",
                  fontWeight: 800,
                  paddingBottom: "20px",
                  fontSize: "30px",
                }}
              >
                {product.title}
              </Typography>

              <label
                style={{
                  color: "grey",
                }}
              >
                Brand
              </label>
              <Typography
                sx={{
                  fontFamily: "poppins",
                  fontWeight: 400,
                  paddingBottom: "20px",
                }}
              >
                {product.brand}
              </Typography>
              <label
                style={{
                  color: "grey",
                }}
              >
                Product Description
              </label>
              <Typography
                sx={{
                  fontFamily: "poppins",
                  fontWeight: 400,
                  paddingBottom: "20px",
                }}
              >
                {product.description}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "poppins",
                  fontWeight: 600,
                  paddingBottom: "20px",
                }}
              >
                ₹{product.price}
              </Typography>

              <Grid
                md={12}
                pt={5}
                width={"100%"}
                display={"flex"}
                flexDirection={"row"}
                justifyContent={"flex-start"}
              >
                <button
                  className="custom-btn"
                  onClick={() => handleAddToCartButton(product._id)}
                >
                  Add to cart
                </button>

                <ToastContainer
                  position="top-center"
                  autoClose={3000}
                  hideProgressBar={true}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  theme="light"
                />
                <button
                style={{marginLeft:"10px"}}
                  className="custom-btn"
                  onClick={() => handleAddToWishlist(product._id)}
                >
                  Add to wishlist
                </button>
              </Grid>
            </Grid>
          </Grid>
        </>
      ) : (
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
      )}
    </>
  );
}

export default ViewProduct;
