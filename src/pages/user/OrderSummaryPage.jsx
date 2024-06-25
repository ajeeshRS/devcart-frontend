import {
  AppBar,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Remove from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { getHeaders } from "../../utils/auth";
import axios from "axios";
import useRazorpay from "react-razorpay";
import {
  notifyCouponAppliedSuccess,
  notifyCouponError,
} from "../../utils/toastify";
import { ToastContainer } from "react-toastify";
import { BASE_URL } from "../../utils/helpers";

function OrderSummaryPage() {
  const [Razorpay] = useRazorpay();
  const location = useLocation();
  const addressId = location.state.id;
  const navigate = useNavigate();
  // states
  const [address, setAddress] = useState({});
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalAmountToBePaid, setTotalAmountToBePaid] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(null);
  const [couponValue, setCouponValue] = useState("");

  const { fullName, phoneNo, street, city, state, pinCode } = address;
  const addressString = `${fullName},${phoneNo},${street},${city},${state},${pinCode}`;

  const fetchAddress = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/address/${addressId}`, {
        headers: getHeaders(),
      });
      setAddress(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchCartProducts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/cart`, {
        headers: getHeaders(),
      });
      setCartProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
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

  const handleChange = (e) => {
    e.preventDefault();
    setCouponValue(e.target.value);
  };

  const handleApplyBtn = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/user/check-coupon`,
        { couponValue, totalAmount },
        {
          headers: getHeaders(),
        }
      );

      if (res.data.valid === true) {
        const discountPercentage = res.data.discountPercentage;
        const calculatedDiscountAmount = Math.round(
          (discountPercentage / 100) * totalAmount
        );
        const updatedTotalAmountToBePaid =
          totalAmount - calculatedDiscountAmount;
        setDiscountAmount(calculatedDiscountAmount);
        setTotalAmountToBePaid(updatedTotalAmountToBePaid);
        notifyCouponAppliedSuccess();
        setCouponValue(" ");
      }
    } catch (error) {
      console.log(error);
      notifyCouponError(error.response.data.message);
    }
  };

  const initPayment = (data) => {
    const orderDetails = {
      orderId: data.id,
      amount: data.amount,
      productDetails: cartProducts,
      discount: discountAmount ? discountAmount : null,
    };
    const options = {
      key: "rzp_test_c63laqjRhLhKki",
      amount: data.amount,
      currency: data.currency,
      name: "order1",
      image: null,
      description: cartProducts.length,
      order_id: data.id,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            `${BASE_URL}/user/checkout/verify-payment`,
            { response },
            {
              headers: getHeaders(),
            }
          );

          orderDetails !== null &&
            navigate("/user/cart/checkout/order-confirm", {
              state: {
                details: orderDetails,
                paymentId: response.razorpay_payment_id,
                address: address,
              },
            });
        } catch (error) {
          console.log(error);
        }
      },
      theme: {
        color: "#7E30E1",
      },
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
  };

  const handlePayment = async () => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/user/checkout/payment`,
        { amount: discountAmount ? totalAmountToBePaid : totalAmount },
        {
          headers: getHeaders(),
        }
      );
      console.log(data.data);
      initPayment(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // fetch address
  useEffect(() => {
    fetchAddress();
  }, []);

  // fetch cart products
  useEffect(() => {
    fetchCartProducts();
  }, [cartProducts]);

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
              zIndex: "1",
              bgcolor: "#fff",
            }}
          >
            <Toolbar variant="dense">
              <IconButton
                onClick={() => navigate(-1)}
                edge="start"
                style={{ color: "#7E30E1" }}
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography
                color={"black"}
                fontFamily={"montserrat"}
                fontSize={"20px"}
                fontWeight={800}
                component="div"
              >
                Order Summary
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>
      </Grid>
      {/* navbar ends */}
      {/* address */}
      <Grid
        md={12}
        mt={12}
        pb={2}
        width={"100%"}
        display={"flex"}
        sx={{
          flexDirection: {
            md: "row",
            sm: "column",
            xs: "column",
          },
        }}
      >
        <Typography
          fontFamily={"poppins"}
          fontWeight={600}
          pr={1}
          sx={{
            paddingLeft: {
              md: 8,
              xs: "10px",
              sm: "10px",
            },
          }}
        >
          Deliver to :{" "}
        </Typography>
        <Typography
          fontFamily={"poppins"}
          sx={{
            paddingLeft: {
              md: 0,
              xs: "10px",
              sm: "10px",
            },
          }}
        >
          {" "}
          {address ? addressString : "no address selected"}
        </Typography>
      </Grid>
      {/* loading state */}
      <Grid md={12}>
        {loading ? (
          <Grid
            width={"100%"}
            height={"60svh"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Typography fontFamily={"poppins"} color={"grey"}>
              Loading...
            </Typography>
          </Grid>
        ) : (
          // list cart products
          cartProducts.map((product) => (
            <Grid
              md={12}
              sx={{ cursor: "pointer" }}
              padding={1}
              pt={10}
              border={"1px solid #F8FAE5"}
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"space-around"}
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
      </Grid>
      {/* coupon apply section */}
      <Grid
        md={12}
        width={"100%"}
        height={"100px"}
        display={"flex"}
        // justifyContent={"flex-end"}
        alignItems={"center"}
        pt={5}
        mb={5}
        sx={{
          justifyContent: {
            md: "flex-end",
            sm: "center",
            xs: "center",
          },
          paddingRight: {
            md: 14,
            sm: "0",
            xs: "0",
          },
        }}
      >
        <Typography
          sx={{
            paddingLeft: "10px",
            paddingRight: {
              md: "10px",
            },
            fontFamily: "poppins",
            color: "grey",
            fontSize: {
              md: "16px",
              xs: "12px",
              sm: "12px",
            },
          }}
        >
          Have a discount coupon ?
        </Typography>
        <input
          style={{
            width: "200px",
            borderRadius: "3px",
            border: "1px solid grey",
            height: "35px",
            marginRight: "5px",
            paddingLeft: "5px",
          }}
          onChange={handleChange}
          value={couponValue}
          placeholder="coupon code"
        />
        <button className="custom-btn" onClick={handleApplyBtn}>
          Apply
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
      </Grid>
      <Divider />
      {/* total */}
      <Grid pt={5} pb={10} sx={{
        paddingRight:{
          md:15,
          sm:"10px",
          xs:"10px"
        },
        paddingLeft:{
          md:15,
          sm:"10px",
          xs:"10px"
        },
      }}>
        <Typography sx={{ fontFamily: "poppins", fontWeight: "600" }}>
          Price details
        </Typography>
        {discountAmount ? (
          <>
            <Grid
              width={"100%"}
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              pt={3}
            >
              <Typography sx={{ fontFamily: "poppins" }}>
                Price ({cartProducts.length} items)
              </Typography>
              <Typography sx={{ fontFamily: "poppins" }}>
                ₹{totalAmount}
              </Typography>
            </Grid>

            <Grid
              width={"100%"}
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              pt={1}
            >
              <Typography sx={{ fontFamily: "poppins" }}>Discount</Typography>
              <Typography sx={{ fontFamily: "poppins", color: "green" }}>
                -₹{discountAmount}
              </Typography>
            </Grid>
            <Grid
              width={"100%"}
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              pt={1}
            >
              <Typography sx={{ fontFamily: "poppins", fontWeight: "600" }}>
                Total amount
              </Typography>
              <Typography sx={{ fontFamily: "poppins", fontWeight: "600" }}>
                ₹{totalAmountToBePaid}
              </Typography>
            </Grid>
          </>
        ) : (
          <>
            <Grid
              width={"100%"}
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              pt={3}
            >
              <Typography sx={{ fontFamily: "poppins" }}>
                Price ({cartProducts.length} items)
              </Typography>
              <Typography sx={{ fontFamily: "poppins" }}>
                ₹{totalAmount}
              </Typography>
            </Grid>
            <Grid
              width={"100%"}
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              pt={1}
            >
              <Typography sx={{ fontFamily: "poppins", fontWeight: "600" }}>
                Total Amount
              </Typography>
              <Typography sx={{ fontFamily: "poppins", fontWeight: "600" }}>
                ₹{totalAmount}
              </Typography>
            </Grid>
          </>
        )}
        <Grid
          width={"100%"}
          display={"flex"}
          justifyContent={"flex-end"}
          alignItems={"center"}
          pt={3}
        >
          <button className="custom-btn" onClick={handlePayment}>
            Proceed
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
        </Grid>
      </Grid>
    </>
  );
}

export default OrderSummaryPage;
