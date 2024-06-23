import "./NavBar.css";
import {
  AppBar,
  Badge,
  Grid,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  SvgIcon,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  AccountCircle,
  Favorite,
  FavoriteBorder,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  Home,
  HomeMaxOutlined,
  HomeOutlined,
  Logout,
  Person,
  PersonOffOutlined,
  PersonOutline,
  SearchOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import DrawerComponent from "./DrawerComponent";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { getHeaders } from "../../utils/auth";
import { useSearchContext } from "../../context/SearchContext";
import { BASE_URL } from "../../utils/helpers";

function NavBar({ setSearchResults }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down("md"));

  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const [cartItems, setCartItems] = useState([]);
  const { updateSearchResults } = useSearchContext();
  const [user, setUser] = useState(null);

  const handleOnChange = (e) => {
    e.preventDefault();
    setSearchTerm(e.target.value);
  };

  // fetch user info
  const getUser = async () => {
    try {
      const userHeader = getHeaders();
      setUser(userHeader);
    } catch (error) {
      console.log(error);
    }
  };

  // to perform search query
  const searchButton = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/search/${searchTerm}`, {
        headers: getHeaders(),
      });
      console.log(res.data);
      if (res.status === 200) {
        updateSearchResults(res.data);
        setSearchTerm("");
        navigate("/user/search", { state: { query: searchTerm } });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogOut = () => {
    localStorage.removeItem("token");
    navigate("/user/login");
  };

  const getCartItems = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/cart`, {
        headers: getHeaders(),
      });
      setCartItems(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchButton();
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    getCartItems();
  }, [cartItems]);

  return (
    <nav className="app-bar">
      <Grid
        md={12}
        width={"100%"}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        height={"10svh"}
      >
        <Grid
          md={4}
          sm={1}
          sx={{
            marginLeft: {
              xs: "20px",
              md: "90px",
              sm: "50px",
            },
          }}
          pl={"auto"}
        >
          <Typography
            sx={{
              color: "#262626",
              fontSize: {
                md: "30px",
                sm: "20px",
                xs: "20px",
              },
              fontWeight: "800",
              fontFamily: "Pacifico",
              cursor: "pointer",
            }}
          >
            DevCart{" "}
            <span className="span-el" style={{ color: "#7E30E1" }}>
              .
            </span>
          </Typography>
        </Grid>
        <Grid md={4} sm={3}>
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
            onClick={searchButton}
            sx={{
              color: "#fff",
              backgroundColor: "#7E30E1",
              marginLeft: "10px",
              "&:hover": { color: "#fff", backgroundColor: "#6018BE" },
              transition: "0.3s ease-in",
            }}
            size="small"
          >
            <SearchOutlined />
          </IconButton>
        </Grid>

        <Grid
          md={4}
          sm={4}
          color={"#262626"}
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          gap={5}
          pr={"auto"}
          sx={{
            marginRight: {
              xs: "10px",
              md: "70px",
              sm: "10px",
            },
          }}
        >
          {isMatch ? (
            <DrawerComponent cartItems={cartItems} user={user} />
          ) : (
            <>
              {user ? (
                <>
                  <Link to={"/user/wishlist"} className="link-tag">
                    <Badge badgeContent={""}>
                      <FavoriteBorderOutlined sx={{ color: "black" }} />
                      <Typography
                        className="typo"
                        fontFamily={"poppins"}
                        pl={1}
                      >
                        Wishlist
                      </Typography>
                    </Badge>
                  </Link>
                  <Link to={"/user/cart"}>
                    <Badge badgeContent={cartItems.length} color="primary">
                      <ShoppingCartOutlined sx={{ color: "black" }} />
                      <Typography
                        className="typo"
                        fontFamily={"poppins"}
                        pl={1}
                      >
                        Cart
                      </Typography>
                    </Badge>
                  </Link>
                </>
              ) : null}

              <IconButton sx={{ color: "#262626" }} onClick={handleClick}>
                <PersonOutline />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                {user == null ? (
                  <MenuItem onClick={() => navigate("/user/login")}>
                    <ListItemIcon>
                      <Person sx={{ color: "#7E30E1" }} />
                    </ListItemIcon>
                    <Typography
                      sx={{
                        fontFamily: "poppins",
                        color: "black",
                        fontWeight: "500",
                      }}
                    >
                      Login
                    </Typography>
                  </MenuItem>
                ) : (
                  <div>
                    <MenuItem onClick={() => navigate("/user/profile")}>
                      <ListItemIcon>
                        <Person sx={{ color: "#7E30E1" }} />
                      </ListItemIcon>
                      <Typography
                        sx={{
                          fontFamily: "poppins",
                          color: "black",
                          fontWeight: "500",
                        }}
                      >
                        Profile
                      </Typography>
                    </MenuItem>

                    <MenuItem onClick={() => handleLogOut()}>
                      <ListItemIcon>
                        <Logout fontSize="small" sx={{ color: "#7E30E1" }} />
                      </ListItemIcon>
                      <Typography
                        sx={{
                          fontFamily: "poppins",
                          color: "black",
                          fontWeight: "500",
                        }}
                      >
                        Log out
                      </Typography>
                    </MenuItem>
                  </div>
                )}
              </Menu>
            </>
          )}
        </Grid>
      </Grid>
    </nav>
  );
}

export default NavBar;
