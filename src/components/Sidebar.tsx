import { Link } from "react-router-dom";
const FaTachometerAlt = require("react-icons/fa").FaTachometerAlt;
const FaUser = require("react-icons/fa").FaUser;
const FaTable = require("react-icons/fa").FaTable;

const Sidebar = () => {
  return (
    <div className="w-64 bg-purple-700 text-white h-full p-5">
      <h2 className="text-xl font-bold">ADMIN PANEL</h2>
      <ul className="mt-5 space-y-3">
        <Link to="/admin/brands">
          <li className="p-2 hover:bg-purple-800 rounded">
            <FaTable className="inline-block mr-2" /> Brands
          </li>
        </Link>
        <Link to="/admin/categories">
          <li className="p-2 hover:bg-purple-800 rounded">
            <FaTable className="inline-block mr-2" /> Categories
          </li>
        </Link>
        <Link to="/admin/products">
          <li className="p-2 hover:bg-purple-800 rounded">
            <FaTable className="inline-block mr-2" /> Products
          </li>
        </Link>
        <Link to="/admin/orders">
        <li className="p-2 hover:bg-purple-800 rounded">
            <FaTable className="inline-block mr-2" /> Orders
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default Sidebar;