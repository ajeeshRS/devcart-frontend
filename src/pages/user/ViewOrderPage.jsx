import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getHeaders } from "../../utils/auth";
import easyinvoice from "easyinvoice";
import { BASE_URL } from "../../utils/helpers";

function ViewOrderPage() {
  const [details, setDetails] = useState([]);
  const [productData, setProductData] = useState([]);
  const [addressData, setAddressData] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const fetchOrder = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/get/order/${id}`, {
        headers: getHeaders(),
      });
      if (response) {
        setDetails(response.data[0]);
        setProductData(response.data[0].productDetails);
        setAddressData(response.data[0].address);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addressString = `${addressData.phoneNo},${addressData.street},${addressData.state}`;

  const generateInvoice = () => {
    try {
      const data = {
        documentTitle: "Invoice",
        currency: "INR",
        taxNotation: "vat",
        marginTop: 25,
        marginRight: 25,
        marginLeft: 25,
        marginBottom: 25,
        sender: {
          company: "DevCart",
          address: "123 Main Street",
          zip: "12345",
          city: "Palghat",
          country: "India",
        },
        client: {
          company: `${addressData.fullName}`,
          address: `${addressString}`,
          zip: `${addressData.pinCode}`,
          city: `${addressData.city}`,
          country: "India",
        },
        information: {
          number: "2021.0001",
          date: new Date().toLocaleDateString(),
        },

        products: productData.map((product) => ({
          quantity: product.quantity,
          description: product.title,
          "tax-rate": 0, // in percentage
          price: product.price,
        })),

        "bottom-notice":
          "note : The above price is the amount before discount, thank you !", // optional
      };
      easyinvoice.createInvoice(data, (result) => {
        easyinvoice.download("invoice.pdf", result.pdf);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);
  return (
    <>
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
              <Grid
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
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
                >
                  Order details
                </Typography>
              </Grid>
            </Toolbar>
          </AppBar>
        </Box>
      </Grid>
      <Grid
        width={"100%"}
        pt={10}
        pl={8}
        pr={8}
        display={"flex"}
        sx={{
          flexDirection: {
            md: "row",
            sm: "column-reverse",
            xs: "column-reverse",
          },
          alignItems: {
            md: "center",
            sm: "flex-start",
            xs: "flex-start",
          },
        }}
        justifyContent={"space-between"}
      >
        <Grid>
          <Typography
            sx={{
              fontFamily: "montserrat",
              fontWeight: "600",
              paddingTop: {
                xs: "20px",
                sm: "20px",
              },
            }}
          >
            Billing Address
          </Typography>
          <Typography sx={{ fontFamily: "poppins", color: "black" }}>
            {addressData.fullName}, <br />
            {addressData.street},<br />
            {addressData.state},<br />
            {addressData.phoneNo},<br />
            {addressData.pinCode}
          </Typography>
        </Grid>
        <Grid>
          <Typography
            sx={{ fontFamily: "montserrat", fontWeight: "500", color: "grey" }}
          >
            #{details.orderId}
          </Typography>
          <Typography sx={{ fontFamily: "montserrat", fontWeight: "500" }}>
            Payment id : {details.paymentId}
          </Typography>
          <Typography sx={{ fontFamily: "montserrat", fontWeight: "600" }}>
            Total amount : ₹{details.amount / 100}
          </Typography>
          <Typography
            onClick={() => generateInvoice()}
            pt={1}
            sx={{
              fontFamily: "montserrat",
              fontWeight: "600",
              color: "#7E30E1",
              cursor: "pointer",
            }}
          >
            Download invoice
          </Typography>
        </Grid>
      </Grid>
      {productData.map((product) => (
        <Grid
          md={12}
          sx={{
            cursor: "pointer",
          }}
          padding={2}
          pt={10}
          border={"1px solid #F8FAE5"}
          display={"flex"}
          flexDirection={"row"}
          width={"100%"}
          justifyContent={"space-between"}
        >
          <Grid
            md={4}
            xs={2}
            width={150}
            sx={{
              paddingLeft: {
                md: "40px",
              },
            }}
          >
            <img
              className="product-img"
              src={`${BASE_URL}/uploads/${product.image.filename}`}
              alt="product-image"
            />
          </Grid>
          <Link to={`/user/view-product/${product._id}`}>
            <Grid
              md={4}
              display={"flex"}
              height={"150px"}
              flexDirection={"column"}
              sx={{
                width: {
                  md: "500px",
                },
                textDecoration: "none",
                justifyContent: {
                  md: "space-between",
                },
              }}
              color={"black"}
            >
              <Typography
                fontFamily={"poppins"}
                color={"#607274"}
                fontWeight={500}
                sx={{
                  width: {
                    xs: 110,
                    sm: 110,
                  },
                }}
              >
                {product.title}
              </Typography>
              <Typography fontFamily={"poppins"} fontWeight={500}>
                {product.brand}
              </Typography>
              <Typography
                fontFamily={"poppins"}
                fontWeight={400}
                fontSize={"15px"}
                sx={{
                  display: {
                    md: "block",
                    xs: "none",
                    sm: "none",
                  },
                }}
              >
                {product.description}
              </Typography>
              <Typography
                fontFamily={"montserrat"}
                fontWeight={600}
                sx={{
                  paddingTop: {
                    xs: "20px",
                    sm: "20px",
                  },
                }}
              >
                ₹{product.price}
              </Typography>
            </Grid>
          </Link>
          <Grid>
            <Typography sx={{ fontFamily: "poppins", fontWeight: "500" }}>
              Quantity {product.quantity}
            </Typography>
          </Grid>
        </Grid>
      ))}
    </>
  );
}

export default ViewOrderPage;
