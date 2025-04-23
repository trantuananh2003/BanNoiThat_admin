import { Outlet } from "react-router-dom";
import Sidenav from "components/Sidenav";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen h-full">
      <Sidenav />
      <div className="flex-1">
        <div className="pt-20">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;