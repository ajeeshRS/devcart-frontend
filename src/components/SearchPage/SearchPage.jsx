import { Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSearchContext } from "../../context/SearchContext";
import { BASE_URL } from "../../utils/helpers";

function SearchPage() {
  const { searchResults, updateSearchResults } = useSearchContext();
  const [sortBy, setSortBy] = useState("");

  const handleChange = (event) => {
    setSortBy(event.target.value);
  };

  if (sortBy == "l2h") {
    updateSearchResults(
      searchResults.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
    );
  }
  if (sortBy == "h2l") {
    updateSearchResults(
      searchResults.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
    );
  }

  useEffect(() => {}, [searchResults]);
  return (
    <div>
      <Grid
        md={12}
        width={"100%"}
        pt={1}
        display={"flex"}
        justifyContent={"flex-end"}
        alignItems={"center"}
        height={"50px"}
        mt={5}
        bgcolor={"#fff"}
        pr={2}
      >
        <Typography fontFamily={"poppins"} pr={1} fontSize={15}>
          Sort by:{" "}
        </Typography>
        <select
          name="sort-by"
          id="sort-by"
          onChange={handleChange}
          style={{
            width: "150px",
            height: "25px",
            border: "1px solid #f4f4f4",
            borderRadius: "5px",
          }}
          defaultValue={"featured"}
        >
          <option value="featured">Featured</option>
          <option value="l2h">Price: Low to high</option>
          <option value="h2l">Price: High to low</option>
        </select>
      </Grid>
      {searchResults.length > 0 ? (
        searchResults.map((item) => (
          <Grid
            md={12}
            sx={{ cursor: "pointer" }}
            pt={10}
            border={"1px solid #F8FAE5"}
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"space-between"}
            width={"100%"}
            bgcolor={"#fff"}
            p={2}
            key={item._id}
          >
            <Grid md={6} sm={2} xs={2} pl={1}>
              <img
                className="product-img"
                src={`${BASE_URL}/uploads/${item.image.filename}`}
                alt="product-image"
              />
            </Grid>
            <Link to={`/user/view-product/${item._id}`}>
              <Grid
                md={6}
                sm={6}
                xs={8}
                position={"absolute"}
                display={"flex"}
                height={"150px"}
                flexDirection={"column"}
                justifyContent={"space-between"}
                sx={{
                  textDecoration: "none",
                  left: {
                    md: "300px",
                    sm: "200px",
                    xs: "200px",
                  },
                }}
                color={"black"}
              >
                <Typography
                  fontFamily={"poppins"}
                  color={"#607274"}
                  fontWeight={500}
                >
                  {item.title}
                </Typography>
                <Typography
                  fontFamily={"poppins"}
                  fontWeight={600}
                  fontSize={15}
                >
                  {item.brand}
                </Typography>
                <Typography
                  fontFamily={"poppins"}
                  fontWeight={500}
                  fontSize={13}
                >
                  {item.description}
                </Typography>
                <Typography fontFamily={"montserrat"} fontWeight={600}>
                  ₹{item.price}
                </Typography>
              </Grid>
            </Link>
          </Grid>
        ))
      ) : (
        <Grid
          width={"100%"}
          height={"90svh"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Typography>oops! no products found</Typography>
        </Grid>
      )}
    </div>
  );
}

export default SearchPage;
