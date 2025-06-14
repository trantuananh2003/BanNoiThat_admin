import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";

import Auth from "pages/Auth";
import Brand from "pages/Brand";
import Category from "pages/Category";
import Product from "pages/Product";
import Order from "pages/Order";
import User from "pages/User";
import Role from "pages/Role";
import SaleProgram from "pages/SaleProgram";
import Analysis from "pages/Analysis";

import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "components/ProtectedRoute";
import RouteTracker from "components/RouteTracker";
import NotFound from "components/NotFound";
const App = () => {
  const [userPermissions, setUserPermissions] = useState<string[]>([]);

  return (
    <Provider store={store}>
      <Router>
        <RouteTracker setUserPermissions={setUserPermissions} />
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/unauthorized" element={<NotFound />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route
              path="brands"
              element={
                <ProtectedRoute
                  element={<Brand />}
                  requiredPermission="manage-brand"
                  userPermissions={userPermissions}
                />
              }
            />
            <Route
              path="categories"
              element={
                <ProtectedRoute
                  element={<Category />}
                  requiredPermission="manage-category"
                  userPermissions={userPermissions}
                />
              }
            />
            <Route
              path="products"
              element={
                <ProtectedRoute
                  element={<Product />}
                  requiredPermission="manage-product"
                  userPermissions={userPermissions}
                />
              }
            />
            <Route
              path="orders"
              element={
                <ProtectedRoute
                  element={<Order />}
                  requiredPermission="manage-order"
                  userPermissions={userPermissions}
                />
              }
            />
            <Route
              path="users"
              element={
                <ProtectedRoute
                  element={<User />}
                  requiredPermission="manage-user"
                  userPermissions={userPermissions}
                />
              }
            />
            <Route
              path="roles"
              element={
                <ProtectedRoute
                  element={<Role />}
                  requiredPermission="manage-role"
                  userPermissions={userPermissions}
                />
              }
            />
            <Route
              path="salePrograms"
              element={
                <ProtectedRoute
                  element={<SaleProgram />}
                  requiredPermission="manage-saleprogram"
                  userPermissions={userPermissions}
                />
              }
            />
            <Route
              path="analysis"
              element={
                <ProtectedRoute
                  element={<Analysis />}
                  requiredPermission="manage-analysis"
                  userPermissions={userPermissions}
                />
              }
            />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
