import {
  AppBar,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import axios from "axios";
import { getHeaders } from "../../utils/auth";
import { ToastContainer } from "react-toastify";
import { notifyChooseAddress } from "../../utils/toastify";
import { BASE_URL } from "../../utils/helpers";
import Loader from "../../components/Loader/Loader";

function ChooseAddress() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState();
  const [loading, setLoading] = useState(false);

  const handleOnChange = (id) => {
    setSelectedAddress(id);
  };

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/user/view-addresses`, {
        headers: getHeaders(),
      });
      setLoading(false);
      setAddresses(res.data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAddresses();
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
                Choose address
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>
      </Grid>
      <Grid md={12} pt={10} display={"flex"}>
        <Typography
          fontFamily={"poppins"}
          display={"flex"}
          alignItems={"center"}
          color={"grey"}
          fontWeight={500}
          pl={5}
        >
          Deliver to <LocationOnIcon />
        </Typography>
      </Grid>
      <Grid md={12} width={"100%"} display={"flex"} flexDirection={"column"}>
        <FormControl sx={{ marginLeft: "50px", marginTop: "10px" }}>
          <RadioGroup name="radio-buttons-group">
            {loading ? (
              <Loader />
            ) : (
              addresses.map((address) => (
                <FormControlLabel
                  key={address._id}
                  value={address._id}
                  control={<Radio />}
                  label={
                    <Typography fontFamily={"poppins"}>
                      {address.fullName}, {address.phoneNo}, {address.street},{" "}
                      {address.city}, {address.state}, {address.pinCode}.
                    </Typography>
                  }
                  onChange={() => handleOnChange(address._id)}
                />
              ))
            )}
          </RadioGroup>
        </FormControl>
        <Grid
          md={12}
          width={"100%"}
          display={"flex"}
          justifyContent={"space-around"}
          sx={{
            justifyContent: {
              md: "flex-end",
              sm: "space-around",
              xs: "space-around",
            },
            paddingLeft: {
              xs: "5px",
              sm: "5px",
            },
          }}
          mt={10}
        >
          <button
            className="custom-btn"
            style={{ margin: "5px" }}
            onClick={() => navigate("/user/address/saved-addresses")}
          >
            Manage address
          </button>
          <button
            style={{ margin: "5px" }}
            className="custom-btn"
            onClick={() =>
              selectedAddress
                ? navigate("/user/cart/checkout/order-summary", {
                    state: { id: selectedAddress },
                  })
                : notifyChooseAddress()
            }
          >
            Next
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

export default ChooseAddress;
