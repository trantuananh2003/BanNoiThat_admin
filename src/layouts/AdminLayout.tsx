import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen h-screen">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-2">
          <Outlet /> 
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;