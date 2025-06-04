import { NavigateNextOutlined } from "@mui/icons-material";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import CategoryIcon from "@mui/icons-material/Category";
import HomeIcon from "@mui/icons-material/Home";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StorageIcon from "@mui/icons-material/Storage";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import RedeemIcon from '@mui/icons-material/Redeem';
import EngineeringIcon from "@mui/icons-material/Engineering";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useLocation } from "react-router-dom";

function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  event.preventDefault();
}

export default function IconBreadcrumbs() {
  const location = useLocation();
  let path;
  let icon;

  switch (location.pathname) {
    case "/admin/brands":
      path = "Brands";
      icon = <LocalOfferIcon sx={{ mr: 0.5 }} fontSize="inherit" />;
      break;
    case "/admin/categories":
      path = "Categories";
      icon = <CategoryIcon sx={{ mr: 0.5 }} fontSize="inherit" />;
      break;
    case "/admin/products":
      path = "Products";
      icon = <StorageIcon sx={{ mr: 0.5 }} fontSize="inherit" />;
      break;
    case "/admin/orders":
      path = "Orders";
      icon = <ShoppingCartIcon sx={{ mr: 0.5 }} fontSize="inherit" />;
      break;
    case "/admin/users":
      path = "Users";
      icon = <PeopleAltIcon sx={{ mr: 0.5 }} fontSize="inherit" />;
      break;
    case "/admin/roles":
      path = "Roles";
      icon = <EngineeringIcon sx={{ mr: 0.5 }} fontSize="inherit" />;
      break;
      case "/admin/salePrograms":
      path = "Sale Programs";
      icon = <RedeemIcon sx={{ mr: 0.5 }} fontSize="inherit" />;
      break;
    case "/admin/analysis":
      path = "Analysis";
      icon = <AnalyticsIcon sx={{ mr: 0.5 }} fontSize="inherit" />;
      break;
    default:
      path = "Dashboard";
  }

  return (
    <div role="presentation" onClick={handleClick}>
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<NavigateNextOutlined fontSize="small" />}
      >
        <Link
          underline="hover"
          sx={{ display: "flex", alignItems: "center" }}
          color="inherit"
          href="/"
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
        </Link>
        <Link
          underline="hover"
          sx={{ display: "flex", alignItems: "center" }}
          color="inherit"
          href="/material-ui/getting-started/installation/"
        >
          <WhatshotIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Admin
        </Link>
        <Typography
          sx={{ color: "text.primary", display: "flex", alignItems: "center" }}
        >
          {icon}
          {path}
        </Typography>
      </Breadcrumbs>
    </div>
  );
}
