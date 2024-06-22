import { Grid, IconButton, Typography } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import GoogleIcon from "@mui/icons-material/Google";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <Grid className="footer" container md={12} bgcolor={"#7E30E1"}>
      <Grid
        display={"flex"}
        width={"100%"}
        sx={{
          flexDirection: {
            md: "row",
            sm: "column",
            xs:"column"
          },
        }}
      >
        <Grid
          item
          md={6}
          display={"flex"}
          flexDirection={"column"}
          sx={{alignItems:{
            md:"justify-between",
            sm:"center",
            xs:"center"
          }}}
          justifyContent={"space-around"}
          pt={1}
        >
          <Grid pt={2} sx={{display:"flex",flexDirection:"column",alignItems:{
            md:"center",
            sm:"center",
            xs:"center",

          }}}>
            <Typography
              sx={{
                color: "#fff",
                fontFamily: "montserrat",
                fontWeight: "800",
                fontSize: "20px",
                paddingBottom: "10px",
              }}
            >
              Stay productive.
            </Typography>
            <Typography
              width={"55%"}
              sx={{ color: "#fff", fontFamily: "poppins", fontSize: "13px",textAlign:"justify" }}
            >
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Blanditiis temporibus molestiae obcaecati quidem quaerat ex
            </Typography>
          </Grid>
          <Grid>
            <IconButton size="medium">
              <InstagramIcon sx={{ color: "#fff" }} />
            </IconButton>
            <IconButton size="medium">
              <FacebookIcon sx={{ color: "#fff" }} />
            </IconButton>
            <IconButton size="medium">
              <TwitterIcon sx={{ color: "#fff" }} />
            </IconButton>
            <IconButton size="medium">
              <GoogleIcon sx={{ color: "#fff" }} />
            </IconButton>
          </Grid>
        </Grid>
        <Grid
          md={6}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"flex-start"}
          pr={2}
        >
          <Grid
            md={4}
            container
            item
            display={"flex"}
            flexDirection={"row"}
            alignItems={"space-around"}
            justifyContent={"center"}
            pt={3}
          >
            <Grid md={3} item>
              <Typography
                pb={1}
                sx={{
                  color: "#fff",
                  fontFamily: "poppins",
                  fontWeight: "500",
                  fontSize: "19px",
                }}
              >
                Company
              </Typography>
              <Typography
                sx={{
                  color: "#fff",
                  fontFamily: "montserrat",
                  fontSize: "15px",
                }}
              >
                About
              </Typography>
              <Typography
                sx={{
                  color: "#fff",
                  fontFamily: "montserrat",
                  fontSize: "15px",
                }}
              >
                Services
              </Typography>
              <Typography
                sx={{
                  color: "#fff",
                  fontFamily: "montserrat",
                  fontSize: "15px",
                }}
              >
                Community
              </Typography>
              <Typography
                sx={{
                  color: "#fff",
                  fontFamily: "montserrat",
                  fontSize: "15px",
                }}
              >
                Help
              </Typography>
            </Grid>
          </Grid>
          <Grid md={3} item pt={3}>
            <Typography
              pb={1}
              sx={{
                color: "#fff",
                fontFamily: "poppins",
                fontWeight: "500",
                fontSize: "19px",
              }}
            >
              Contact us
            </Typography>
            <Typography
              display={"flex"}
              alignItems={"center"}
              sx={{ color: "#fff", fontFamily: "montserrat", fontSize: "15px" }}
            >
              <PhoneIcon sx={{ paddingRight: "10px" }} /> (91)0000000000
            </Typography>
            <Typography
              display={"flex"}
              alignItems={"center"}
              sx={{ color: "#fff", fontFamily: "montserrat", fontSize: "15px" }}
            >
              <EmailIcon sx={{ paddingRight: "10px" }} /> support@mail.com
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid
        md={12}
        width={"100%"}
        display={"flex"}
        justifyContent={"center"}
        pt={3}
        pb={2}
      >
        <Typography sx={{ color: "#fff", fontFamily: "montserrat", fontSize:"16px" }}>
          Copyright © 2024.All Right Reserved.
        </Typography>
      </Grid>
    </Grid>
  );
}

export default Footer;
