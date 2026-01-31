import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeScreen from "./pages/HomeScreen";
import ProductScreen from "./pages/ProductScreen";
import ShopScreen from "./pages/ShopScreen";
import LoginScreen from "./pages/LoginScreen";
import RegisterScreen from "./pages/RegisterScreen";
import VerifyScreen from "./pages/VerifyScreen";
import ForgotPasswordScreen from "./pages/ForgotPasswordScreen";
import ResetPasswordScreen from "./pages/ResetPasswordScreen";
import CartScreen from "./pages/CartScreen";
import AboutScreen from "./pages/AboutScreen";
import ContactScreen from "./pages/ContactScreen";
import ProfileScreen from "./pages/ProfileScreen";
import MyOrdersScreen from "./pages/MyOrdersScreen";
import AdminDashboardScreen from "./pages/AdminDashboardScreen";
import ProductListScreen from "./pages/ProductListScreen";
import ProductEditScreen from "./pages/ProductEditScreen";
import OrderListScreen from "./pages/OrderListScreen";
import UserListScreen from "./pages/UserListScreen";
import CategoryListScreen from "./pages/CategoryListScreen";
import PackingSlipScreen from "./pages/PackingSlipScreen";
import ShippingScreen from "./pages/ShippingScreen";
import PaymentScreen from "./pages/PaymentScreen";
import PlaceOrderScreen from "./pages/PlaceOrderScreen";
import OrderScreen from "./pages/OrderScreen";
import WishlistScreen from "./pages/WishlistScreen";
import StatsScreen from "./pages/StatsScreen";
import PrivacyPolicyScreen from "./pages/PrivacyPolicyScreen";
import { StoreProvider } from "./context/StoreContext";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import "./App.css";
import "./styles/input-enhancements.css";
import "./styles/responsive-utilities.css";
import "./styles/accessibility-improvements.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AppContent() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");

  return (
    <div
      className="app-container"
      role="application"
      aria-label="Nuraya E-commerce Application"
    >
      <ToastContainer position="bottom-center" limit={1} />
      {!isAdminPath && <Header />}
      <main
        className={!isAdminPath ? "main-content" : ""}
        role="main"
        id="main-content"
      >
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/shop" element={<ShopScreen />} />
          <Route path="/product/:id" element={<ProductScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/verify" element={<VerifyScreen />} />
          <Route path="/forgotpassword" element={<ForgotPasswordScreen />} />
          <Route
            path="/resetpassword/:token"
            element={<ResetPasswordScreen />}
          />
          <Route path="/cart" element={<CartScreen />} />
          <Route path="/about" element={<AboutScreen />} />
          <Route path="/contact" element={<ContactScreen />} />
          <Route path="/privacy" element={<PrivacyPolicyScreen />} />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfileScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/myorders"
            element={
              <ProtectedRoute>
                <MyOrdersScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <WishlistScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shipping"
            element={
              <ProtectedRoute>
                <ShippingScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <PaymentScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/placeorder"
            element={
              <ProtectedRoute>
                <PlaceOrderScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order/:id"
            element={
              <ProtectedRoute>
                <OrderScreen />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboardScreen />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <ProductListScreen />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/product/:id/edit"
            element={
              <AdminRoute>
                <ProductEditScreen />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/order/:id/packing-slip"
            element={
              <AdminRoute>
                <PackingSlipScreen />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <OrderListScreen />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <UserListScreen />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/stats"
            element={
              <AdminRoute>
                <StatsScreen />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <AdminRoute>
                <CategoryListScreen />
              </AdminRoute>
            }
          />
        </Routes>
      </main>
      {!isAdminPath && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <Router>
          <AppContent />
        </Router>
      </StoreProvider>
    </ErrorBoundary>
  );
}

export default App;
