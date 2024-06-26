import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Grid, IconButton, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./ProductList.css";
import { getHeaders } from "../../utils/auth";
import { BASE_URL } from "../../utils/helpers";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  //   extracting category name from url
  const { category } = useParams();

  //  making the first letter caps and remove the last letter (s) to filter products with category name
  const removedTrailLetter = category.replace(/s$/, "");
  const categoryName =
    removedTrailLetter.charAt(0).toUpperCase() + removedTrailLetter.slice(1);

  // fetching product details
  useEffect(() => {
    const fetchKeyboards = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/get-products`, {
          headers: getHeaders(),
        });
        setProducts(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchKeyboards();
  }, []);

  const [loading, setLoading] = useState(true);
  // filtering keyboard details from products array
  useEffect(() => {
    if (products.length > 0) {
      const filtered = products.filter(
        (product) => product.category === categoryName
      );
      setFilteredProducts(filtered);
      setLoading(false);
    }
  }, [products]);

  const [favorites, setFavorites] = useState([]);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user/wishlist/all-products`,
        {
          headers: getHeaders(),
        }
      );

      setFavorites(response.data.fav);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const toggleFavorite = async (itemId) => {
    if (favorites.includes(itemId)) {
      // Item is already in favorites, remove it
      setFavorites(favorites.filter((id) => id !== itemId));
      try {
        const response = await axios.delete(
          `${BASE_URL}/user/wishlist/delete/${itemId}`,
          {
            headers: getHeaders(),
          }
        );

        // console.log(response.data);
      } catch (err) {
        console.log(err);
      }
    } else {
      // Item is not in favorites, add it
      setFavorites([...favorites, itemId]);

      try {
        const response = await axios.post(
          `${BASE_URL}/user/wishlist/${itemId}`,
          {},
          {
            headers: getHeaders(),
          }
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="main-container">
      {loading === false ? (
        filteredProducts.map((product) => (
          <Grid
            md={12}
            sx={{
              cursor: "pointer",
              justifyContent: {
                md: "space-around",
                xs: "space-between",
                sm: "space-between",
              },
            }}
            padding={4}
            pt={10}
            border={"1px solid #F8FAE5"}
            display={"flex"}
            flexDirection={"row"}
            width={"100%"}
          >
            <Grid
              md={4}
              xs={2}
              width={150}
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
                pl={2}
                display={"flex"}
                height={"150px"}
                sx={{
                  width: {
                    md: "500px",
                  },
                }}
                flexDirection={"column"}
                justifyContent={"space-between"}
                color={"black"}
              >
                <Typography
                  fontFamily={"poppins"}
                  color={"#607274"}
                  fontWeight={500}
                >
                  {product.title}
                </Typography>
                <Typography fontFamily={"poppins"} fontWeight={500}>
                  {product.brand}
                </Typography>
                <Typography
                  fontFamily={"poppins"}
                  fontWeight={500}
                  sx={{
                    overflowY: "hidden",
                    height: {
                      xs: "100px",
                      sm: "100px",
                    },
                  }}
                >
                  {product.description}
                </Typography>
                <Typography fontFamily={"montserrat"} fontWeight={600}>
                  ₹{product.price}
                </Typography>
              </Grid>
            </Link>
            <Grid md={4} xs={1} sm={1}>
              <IconButton
                onClick={() => {
                  toggleFavorite(product._id);
                }}
              >
                {favorites.includes(product._id) ? (
                  <FavoriteIcon sx={{ color: "#C3ACD0" }} />
                ) : (
                  <FavoriteBorder sx={{ color: "black" }} />
                )}
              </IconButton>
            </Grid>
          </Grid>
        ))
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
    </div>
  );
}

export default ProductList;
