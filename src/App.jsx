import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { setUser } from "./redux/features/userSlice";
import Brand from "pages/Brand";
import Category from "pages/Category";
import Product from "pages/Product";
import Order from "pages/Order";
import User from "pages/User";
import Analysis from "pages/Analysis";
import Auth from "pages/Auth";
import Role from "pages/Role";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      const { user_id, email, fullName } = jwtDecode(userToken);
      dispatch(setUser({ user_id, email, fullName }));
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="brands" element={<Brand />} />
          <Route path="categories" element={<Category />} />
          <Route path="products" element={<Product />} />
          <Route path="orders" element={<Order />} />
          <Route path="users" element={<User />} />
          <Route path="roles" element={<Role />} />
          <Route path="analysis" element={<Analysis />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
