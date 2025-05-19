import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Auth from "./pages/Auth/Auth";
import Brand from "./pages/Brand/Brand";
import Category from "./pages/Category/Category";
import Product from "./pages/Product";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { setUser } from "./redux/features/userSlice";
import OrderPage from "./pages/Order/Order";
import User from "./pages/User/User";
import AnalysisPage from "./pages/Analysist";

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
          <Route path="orders" element={<OrderPage />} />
          <Route path="users" element={<User />} />
          <Route path="analysis" element={<AnalysisPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
