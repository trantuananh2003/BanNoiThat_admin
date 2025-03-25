import { NavLink } from "react-router-dom";
import {
  AppstoreOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  BarChartOutlined,
  TagsOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";

const Sidebar = () => {
  const navItem =
    "flex items-center p-3 my-1 rounded-lg transition-all duration-300 hover:bg-purple-700 hover:scale-105";

  return (
    <div className="w-64 bg-gradient-to-b from-blue-800 to-blue-600 text-white p-6 shadow-2xl">
      <h2 className="text-3xl font-extrabold mb-8 text-center tracking-wide">
        ADMIN PANEL
      </h2>
      <div className="space-y-2">
        <NavLink
          to="/admin/brands"
          className={({ isActive }) =>
            `${navItem} ${isActive ? "bg-purple-700 shadow-inner" : ""}`
          }
        >
          <TagsOutlined className="mr-3 text-xl" /> Brands
        </NavLink>
        <NavLink
          to="/admin/categories"
          className={({ isActive }) =>
            `${navItem} ${isActive ? "bg-purple-700 shadow-inner" : ""}`
          }
        >
          <AppstoreOutlined className="mr-3 text-xl" /> Categories
        </NavLink>
        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            `${navItem} ${isActive ? "bg-purple-700 shadow-inner" : ""}`
          }
        >
          <DatabaseOutlined className="mr-3 text-xl" /> Products
        </NavLink>
        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            `${navItem} ${isActive ? "bg-purple-700 shadow-inner" : ""}`
          }
        >
          <ShoppingCartOutlined className="mr-3 text-xl" /> Orders
        </NavLink>
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `${navItem} ${isActive ? "bg-purple-700 shadow-inner" : ""}`
          }
        >
          <UserOutlined className="mr-3 text-xl" /> Users
        </NavLink>
        <NavLink
          to="/admin/analysis"
          className={({ isActive }) =>
            `${navItem} ${isActive ? "bg-purple-700 shadow-inner" : ""}`
          }
        >
          <BarChartOutlined className="mr-3 text-xl" /> Analysis
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
