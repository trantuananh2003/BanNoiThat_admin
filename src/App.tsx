import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Auth from "./pages/Auth/Auth";
import Brand from "./pages/Brand/Brand";
import Category from "./pages/Category/Category";
import Product from "./pages/Product/Product";
import Order from "./pages/Order/Order";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth/>} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="brands" element={<Brand />} />
          <Route path="categories" element={<Category />} />
          <Route path="products" element={<Product />} />
          <Route path="orders" element={<Order/>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;