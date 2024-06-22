import {
  Menu,
  AccountCircle,
  Home,
  Storefront,
  FavoriteBorderOutlined,
  ShoppingCartOutlined,
  PersonOutline,
  Logout,
} from "@mui/icons-material";
import {
  Badge,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function DrawerComponent({ cartItems, user }) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem("token");
    navigate("/user/login");
  };
  return (
    <>
      <Drawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        anchor="right"
        sx={{ width: "200px" }}
      >
        <List>
          <ListItemButton>
            <ListItemIcon>
              <IconButton sx={{ color: "#0ecc25" }}>
                <FavoriteBorderOutlined sx={{ color: "black" }} />
              </IconButton>
            </ListItemIcon>
            <ListItemText>
              <Link to={"/user/wishlist"} className="link-tag">
                <Badge badgeContent={""}>
                  <Typography className="typo" fontFamily={"poppins"}>
                    Wishlist
                  </Typography>
                </Badge>
              </Link>
            </ListItemText>
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <IconButton sx={{ color: "#0ecc25" }}>
                <ShoppingCartOutlined sx={{ color: "black" }} />
              </IconButton>
            </ListItemIcon>
            <ListItemText>
              <Link to={"/user/cart"}>
                <Badge badgeContent={cartItems.length} color="primary">
                  <Typography className="typo" fontFamily={"poppins"}>
                    Cart
                  </Typography>
                </Badge>
              </Link>
            </ListItemText>
          </ListItemButton>
          {user == null ? (
            <ListItemButton>
              <ListItemIcon>
                <IconButton sx={{ color: "#000" }}>
                  <PersonOutline />
                </IconButton>
              </ListItemIcon>
              <ListItemText>
                <Link to={"/user/login"}>
                  <Typography className="typo" fontFamily={"poppins"}>
                    login{" "}
                  </Typography>
                </Link>
              </ListItemText>
            </ListItemButton>
          ) : (
            <>
              <ListItemButton>
                <ListItemIcon>
                  <IconButton sx={{ color: "#000" }}>
                    <PersonOutline />
                  </IconButton>
                </ListItemIcon>
                <ListItemText>
                  <Link to={"/user/profile"}>
                    <Typography className="typo" fontFamily={"poppins"}>
                      Profile
                    </Typography>
                  </Link>
                </ListItemText>
              </ListItemButton>

              <ListItemButton onClick={() => handleLogOut()}>
                <ListItemIcon>
                  <IconButton sx={{ color: "#000" }}>
                    <Logout />
                  </IconButton>
                </ListItemIcon>
                <ListItemText>
                  <Typography className="typo" fontFamily={"poppins"}>
                    Logout
                  </Typography>
                </ListItemText>
              </ListItemButton>
            </>
          )}
        </List>
      </Drawer>
      <IconButton onClick={() => setOpenDrawer(!openDrawer)}>
        <Menu />
      </IconButton>
    </>
  );
}

export default DrawerComponent;
