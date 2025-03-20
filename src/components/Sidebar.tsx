import { NavLink } from "react-router-dom";
import {
  FaTrademark,
  FaThList,
  FaBoxOpen,
  FaShoppingCart,
  FaUser,
} from "react-icons/fa";

const Sidebar = () => {
  const navItem =
    "flex items-center p-3 my-1 rounded transition-colors hover:bg-purple-800";

  // Định nghĩa kiểu cho các biểu tượng
  const BrandIcon = FaTrademark as React.FC<React.SVGProps<SVGSVGElement>>;
  const CategoryIcon = FaThList as React.FC<React.SVGProps<SVGSVGElement>>;
  const ProductIcon = FaBoxOpen as React.FC<React.SVGProps<SVGSVGElement>>;
  const OrderIcon = FaShoppingCart as React.FC<React.SVGProps<SVGSVGElement>>;
  const UserIcon = FaUser as React.FC<React.SVGProps<SVGSVGElement>>;

  return (
    <div className="w-64 bg-purple-700 text-white h-screen p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-5">ADMIN PANEL</h2>
      <NavLink
        to="/admin/brands"
        className={({ isActive }) =>
          `${navItem} ${isActive ? "bg-purple-800" : ""}`
        }
      >
        <BrandIcon className="mr-3 text-lg" /> Brands
      </NavLink>
      <NavLink
        to="/admin/categories"
        className={({ isActive }) =>
          `${navItem} ${isActive ? "bg-purple-800" : ""}`
        }
      >
        <CategoryIcon className="mr-3 text-lg" /> Categories
      </NavLink>
      <NavLink
        to="/admin/products"
        className={({ isActive }) =>
          `${navItem} ${isActive ? "bg-purple-800" : ""}`
        }
      >
        <ProductIcon className="mr-3 text-lg" /> Products
      </NavLink>
      <NavLink
        to="/admin/orders"
        className={({ isActive }) =>
          `${navItem} ${isActive ? "bg-purple-800" : ""}`
        }
      >
        <OrderIcon className="mr-3 text-lg" /> Orders
      </NavLink>
      <NavLink
        to="/admin/users"
        className={({ isActive }) =>
          `${navItem} ${isActive ? "bg-purple-800" : ""}`
        }
      >
        <UserIcon className="mr-3 text-lg" /> Users
      </NavLink>
    </div>
  );
};

export default Sidebar;
