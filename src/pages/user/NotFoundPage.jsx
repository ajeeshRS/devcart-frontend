import { Button, Grid, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <Grid
      sx={{
        width: "100%",
        height: "90vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography
        fontFamily={"montserrat"}
        fontWeight={"600"}
        fontSize={"20px"}
      >
        404
      </Typography>
      <Typography
        sx={{ fontWeight: "1000", fontFamily: "montserrat", fontSize: "20px" }}
      >
        Page Not Found
      </Typography>
      <button style={{ marginTop: "15px" }} className="custom-btn">
        <Link
          to={"/user/home"}
          style={{ textDecoration: "none", color: "white" }}
        >
          Go back to Home
        </Link>
      </button>
    </Grid>
  );
}

export default NotFoundPage;
