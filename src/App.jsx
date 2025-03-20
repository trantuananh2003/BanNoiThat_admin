import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Auth from "./pages/Auth/Auth";
import Brand from "./pages/Brand/Brand";
import Category from "./pages/Category/Category";
import Product from "./pages/Product/Product";
import Order from "./pages/Order/Order";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { setUser } from "./redux/features/userSlice";
import OrderPage from "./pages/Order";
import UserPage from "./pages/User";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const localToken = localStorage.getItem("userToken");
    if (localToken) {
      const { user_id, email, fullName } = jwtDecode(localToken);
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
          <Route path="orders" element={<OrderPage />} />
          <Route path="users" element={<UserPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
