import React from "react";
import { Grid, Typography } from "@mui/material";
function MobileNotSupported() {
  return (
    <Grid width={"100%"} height={"100svh"}  display={"flex"} flexDirection={"row"} justifyContent={"center"} alignItems={"center"}>
      <Typography sx={{fontFamily:'poppins',color:"#262626"}}>This site only supports desktop devices.</Typography>
    </Grid>
  );
}

export default MobileNotSupported;
