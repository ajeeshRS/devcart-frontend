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
import { FavoriteBorderOutlined } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getHeaders } from "../../utils/auth";
import AddIcon from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
import { BASE_URL } from "../../utils/helpers";
import Loader from "../../components/Loader/Loader";
function UserCartPage() {
  const navigate = useNavigate();

  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const removeFromCart = async (itemId) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/user/cart/delete/${itemId}`,
        {
          headers: getHeaders(),
        }
      );
      setCartProducts((prevCart) =>
        prevCart.filter((item) => item._id !== itemId)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const totalAmount = cartProducts.reduce(
    (accumulator, product) => accumulator + product.price * product.quantity,
    0
  );

  const fetchCartProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/user/cart`, {
        headers: getHeaders(),
      });
      setLoading(false);
      setCartProducts(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      if (quantity > 0) {
        const response = await axios.put(
          `${BASE_URL}/user/cart/update/quantity/${itemId}`,
          {
            quantity: quantity,
          },
          {
            headers: getHeaders(),
          }
        );
        if (response.data.success) {
          setCartProducts((prevCart) =>
            prevCart.map((item) =>
              item._id === itemId ? { ...item, quantity: quantity } : item
            )
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCartProducts();
  }, []);
  return (
    <>
      {/* navbar */}
      <Grid md={12}>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar
            elevation={0}
            position="static"
            sx={{
              position: "fixed",
              top: "0px",
              paddingTop: "5px",
              zIndex: "1",
              bgcolor: "#fff",
              height: "50px",
            }}
          >
            <Toolbar variant="dense">
              <IconButton
                onClick={() => navigate(-1)}
                edge="start"
                style={{ color: "#7E30E1" }}
                sx={{ mr: 2 }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography
                component="div"
                sx={{
                  fontFamily: "montserrat",
                  fontWeight: "800",
                  color: "black",
                  fontSize: "20px",
                }}
              >
                Cart
              </Typography>
              <Grid position={"absolute"} right={30}>
                <IconButton
                  sx={{ color: "black" }}
                  onClick={() => navigate("/user/wishlist")}
                >
                  <FavoriteBorderOutlined />
                </IconButton>
              </Grid>
            </Toolbar>
          </AppBar>
        </Box>
      </Grid>
      {/* navbar ends */}
      {/* loading state */}
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
          <Loader />
        </Grid>
      ) : (
        // loading state ends
        cartProducts.map((product) => (
          // product list
          <Grid
            md={12}
            sx={{ cursor: "pointer" }}
            padding={1}
            pt={10}
            border={"1px solid #F8FAE5"}
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"space-between"}
            width={"100%"}
            key={product._id}
          >
            {/* product image */}
            <Grid
              md={4}
              xs={2}
              width={130}
              sx={{
                paddingLeft: {
                  md: "40px",
                },
              }}
            >
              {" "}
              <img
                className="product-img"
                src={`${BASE_URL}/uploads/${product.image.filename}`}
                alt="product-image"
              />
            </Grid>
            <Grid
              p={1}
              sx={{
                display: "flex",
                flexDirection: {
                  md: "row",
                  sm: "column",
                  xs: "column",
                },
                width: {
                  md: "70%",
                  sm: "60%",
                },
                height: {
                  md: "150px",
                },
                justifyContent: "space-between",
              }}
            >
              {/* product texts */}
              <Link to={`/user/view-product/${product._id}`}>
                <Grid
                  md={4}
                  display={"flex"}
                  flexDirection={"column"}
                  sx={{
                    textDecoration: "none",
                    marginRight: {
                      md: "50px",
                    },
                    paddingRight: {
                      md: "56px",
                      sm: "0",
                      xs: "0",
                    },
                    paddingLeft: {
                      md: "0",
                      sm: "15px",
                      xs: "15px",
                    },
                    justifyContent: {
                      md: "space-between",
                    },
                    height: {
                      md: "150px",
                    },
                  }}
                  color={"black"}
                >
                  <Typography
                    fontFamily={"poppins"}
                    color={"#607274"}
                    fontWeight={500}
                  >
                    {product.title}
                  </Typography>
                  <Typography
                    fontFamily={"poppins"}
                    fontWeight={600}
                    sx={{
                      display: {
                        md: "block",
                        xs: "none",
                        sm: "none",
                      },
                    }}
                  >
                    {product.brand}
                  </Typography>
                  <Typography
                    fontFamily={"poppins"}
                    fontWeight={500}
                    fontSize={"14px"}
                    pt={1}
                  >
                    {product.description}
                  </Typography>
                </Grid>
              </Link>
              {/* product controls */}
              <Grid
                md={4}
                display={"flex"}
                alignItems={"center"}
                sx={{
                  height: {
                    md: "150px",
                  },
                }}
                pr={1}
              >
                <Grid
                  display={"flex"}
                  flexDirection={"row"}
                  alignItems={"center"}
                >
                  <IconButton
                    onClick={() =>
                      updateQuantity(product._id, product.quantity - 1)
                    }
                  >
                    <Remove />
                  </IconButton>
                  <Typography>{product.quantity}</Typography>
                  <IconButton
                    onClick={() =>
                      updateQuantity(product._id, product.quantity + 1)
                    }
                  >
                    <AddIcon />
                  </IconButton>
                </Grid>
                <button
                  style={{
                    marginLeft: "10px",
                    padding: "5px",
                    background: "#7E30E1",
                    color: "white",
                    fontFamily: "poppins",
                    border: "none",
                    outline: "none",
                    borderRadius: "3px",
                    cursor: "pointer",
                  }}
                  onClick={() => removeFromCart(product._id)}
                >
                  Remove
                </button>
                <Typography fontFamily={"montserrat"} fontWeight={600} pl={2}>
                  ₹{product.price * product.quantity}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        ))
      )}
      {/* Total and checkout */}
      {cartProducts.length > 0 && loading == false ? (
        <Grid
          mt={5}
          pb={10}
          md={12}
          width={"100%"}
          display={"flex"}
          flexDirection={"column"}
          alignItems={"flex-end"}
          pr={5}
        >
          <Typography
            pb={5}
            fontFamily={"montserrat"}
            fontWeight={600}
          >{`Cart subtotal : ₹${totalAmount.toFixed(2)}`}</Typography>
          <Link to={"/user/cart/checkout/address"}>
            <button className="custom-btn">checkout</button>
          </Link>
        </Grid>
      ) : (
        // empty cart
        cartProducts.length === 0 &&
        loading == false && (
          <Grid
            md={12}
            p={8}
            width={"100%"}
            height={"90svh"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            textAlign={"center"}
          >
            <Typography sx={{ color: "grey", fontFamily: "montserrat" }}>
              Your cart is currently empty. <br /> Add some products you want to
              buy!
            </Typography>
          </Grid>
        )
      )}
    </>
  );
}

export default UserCartPage;
