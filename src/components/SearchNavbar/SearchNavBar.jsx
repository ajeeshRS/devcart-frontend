import React, { useEffect, useState } from "react";
import { AppBar, Box, Grid, IconButton, Toolbar } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { SearchOutlined, ShoppingCartOutlined } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSearchContext } from "../../context/SearchContext";
import { getHeaders } from "../../utils/auth";
import { BASE_URL } from "../../utils/helpers";
import Loader from "../Loader/Loader";

function SearchNavBar() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const { updateSearchResults } = useSearchContext();
  const location = useLocation();

  const handleOnChange = (e) => {
    e.preventDefault();
    setSearchTerm(e.target.value);
  };

  // to perform search query
  const searchButton = async (searchTerm) => {
    try {
      setLoading(true);
      localStorage.setItem("query", searchTerm);
      const res = await axios.get(`${BASE_URL}/user/search/${searchTerm}`, {
        headers: getHeaders(),
      });
      if (res.status === 200) {
        updateSearchResults(res.data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchButton();
    }
  };

  useEffect(() => {
    const query = localStorage.getItem("query");
    !query ? setSearchTerm(location.state.query) : setSearchTerm(query);
    query ? searchButton(query) : searchButton(location.state.query);

    return () => {
      localStorage.removeItem("query");
    };
  }, []);

  return (
    <Grid md={12}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          elevation={0}
          position="static"
          sx={{
            position: "fixed",
            top: "0px",
            paddingTop: "5px",
            paddingBottom: "5px",
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
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Grid md={4} sm={3} pl={2}>
              <input
                style={{ height: "30px", borderRadius: "50px" }}
                onChange={handleOnChange}
                onKeyDown={handleKeyPress}
                type="text"
                value={searchTerm}
                className="search-input"
                placeholder="Search products"
              />
              <IconButton
                className="search-btn"
                onClick={() => searchButton(searchTerm)}
                sx={{
                  color: "#fff",
                  backgroundColor: "#7E30E1",
                  marginLeft: "10px",
                  "&:hover": { color: "#fff", backgroundColor: "#6018BE" },
                  transition: "0.3s ease-in",
                }}
                size="small"
              >
                {loading ? <Loader /> : <SearchOutlined />}
              </IconButton>
            </Grid>
            <Grid position={"absolute"} right={30}>
              <IconButton
                sx={{ color: "black" }}
                onClick={() => navigate("/user/wishlist")}
              >
                <FavoriteIcon />
              </IconButton>
              <IconButton
                sx={{ color: "black" }}
                onClick={() => navigate("/user/cart")}
              >
                <ShoppingCartOutlined />
              </IconButton>
            </Grid>
          </Toolbar>
        </AppBar>
      </Box>
    </Grid>
  );
}

export default SearchNavBar;
