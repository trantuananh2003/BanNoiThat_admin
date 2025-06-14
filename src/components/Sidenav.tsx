import { Logout, PersonAdd, Settings } from "@mui/icons-material";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import CategoryIcon from "@mui/icons-material/Category";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import EngineeringIcon from "@mui/icons-material/Engineering";
import RedeemIcon from "@mui/icons-material/Redeem";
import StorageIcon from "@mui/icons-material/Storage";
import { Avatar, Menu, MenuItem, Tooltip } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { CSSObject, styled, Theme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import * as React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { emptyUserState, setUser } from "../redux/features/userSlice";
import IconBreadcrumbs from "./ui/IconBreadcrumbs";
import clientAPI from "client-api/rest-client";
import { RootState } from "redux/store";
import User from "model/User";
const drawerWidth = 170;

const NAVIGATION = [
  {
    id: 0,
    icon: <LocalOfferIcon />,
    label: "Brand",
    route: "/admin/brands",
    manageKey: "manage-brand",
  },
  {
    id: 1,
    icon: <CategoryIcon />,
    label: "Category",
    route: "/admin/categories",
    manageKey: "manage-category",
  },
  {
    id: 2,
    icon: <StorageIcon />,
    label: "Product",
    route: "/admin/products",
    manageKey: "manage-product",
  },
  {
    id: 3,
    icon: <ShoppingCartIcon />,
    label: "Order",
    route: "/admin/orders",
    manageKey: "manage-order",
  },
  {
    id: 4,
    icon: <PeopleAltIcon />,
    label: "User",
    route: "/admin/users",
    manageKey: "manage-user",
  },
  {
    id: 5,
    icon: <EngineeringIcon />,
    label: "Role",
    route: "/admin/roles",
    manageKey: "manage-role",
  },
  {
    id: 6,
    icon: <RedeemIcon />,
    label: "Sale Program",
    route: "/admin/salePrograms",
    manageKey: "manage-saleprogram",
  },
  {
    id: 7,
    icon: <AnalyticsIcon />,
    label: "Analysis",
    route: "/admin/analysis",
    manageKey: "manage-analysis",
  },
];

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

function stringToColor(string: string) {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

export default function Sidenav() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const userData: User = useSelector((state: RootState) => state.users);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openAccountSettings = Boolean(anchorEl);
  const handleClickAccountSettings = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseAccountSettings = () => {
    setAnchorEl(null);
  };

  const onLogout = () => {
    setAnchorEl(null);
    localStorage.removeItem("userToken");
    dispatch(setUser(emptyUserState));
    navigate("/");
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleClickManagePage = async (route: string, manageKey: string) => {
    let id = userData.user_id;
    const response: { result: string[] } = await clientAPI
      .service("Roles")
      .get(`permission-user/${id}`);
    if (response.result.includes(manageKey)) {
      navigate(route);
    }
  };
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              display: open ? "none" : "flex",
              pointerEvents: {
                xs: "none",
                sm: "auto",
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          <IconBreadcrumbs />
          {/* <Typography variant="h6" noWrap component="div">
            ADMIN MANAGE PAGE
          </Typography> */}
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleClickAccountSettings}
              size="large"
              sx={{ ml: 2, position: "absolute", right: "20px", top: "5px" }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Avatar
                //{...stringAvatar(email.toString())}
                sx={{
                  width: 36,
                  height: 36,
                }}
              />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={openAccountSettings}
            onClose={handleCloseAccountSettings}
            onClick={handleCloseAccountSettings}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: -0.2,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&::before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 22,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleCloseAccountSettings}>
              <Avatar /> Profile
            </MenuItem>
            <MenuItem onClick={handleCloseAccountSettings}>
              <Avatar /> My account
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleCloseAccountSettings}>
              <ListItemIcon>
                <PersonAdd fontSize="small" />
              </ListItemIcon>
              Add another account
            </MenuItem>
            <MenuItem onClick={handleCloseAccountSettings}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem onClick={onLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          backgroundColor: "#f6f6f6",
          "& .MuiDrawer-paper": {
            backgroundColor: "#f6f6f6",
            color: "#fff",
          },
        }}
      >
        <DrawerHeader
          onClick={handleDrawerClose}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            // "&:hover": {
            //   backgroundColor: "action.hover",
            // },
            backgroundColor: "#1976d2",
          }}
        >
          <MenuIcon />
        </DrawerHeader>
        <Divider />
        <List>
          {NAVIGATION.map((text) => (
            <ListItem
              key={text.id}
              disablePadding
              sx={{ display: "block" }}
              onClick={() => handleClickManagePage(text.route, text.manageKey)}
            >
              <Tooltip title={open ? "" : text.label} placement="right">
                <ListItemButton
                  sx={[
                    {
                      minHeight: 48,
                      px: 2.5,
                    },
                    open
                      ? {
                          justifyContent: "initial",
                        }
                      : {
                          justifyContent: "center",
                        },
                  ]}
                >
                  <ListItemIcon
                    sx={[
                      {
                        minWidth: 0,
                        justifyContent: "center",
                      },
                      open
                        ? {
                            mr: 3,
                          }
                        : {
                            mr: "auto",
                          },
                    ]}
                  >
                    {text.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={text.label}
                    sx={[
                      {
                        color: "black",
                      },
                      open
                        ? {
                            opacity: 1,
                          }
                        : {
                            opacity: 0,
                          },
                    ]}
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
      </Box>
    </Box>
  );
}
