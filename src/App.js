// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuth from "./hooks/useAuth";
import useShop from "./hooks/useShop";
import Navbar from "./components/Navbar";
import FoodList from "./components/FoodList";
import CartPage from "./components/CartPage";
import OrderPage from "./components/OrderPage";
import AdminDashboard from "./components/AdminDashboard";
import AdminLogin from './components/AdminLogin';
import RequireAdmin from './components/RequireAdmin';
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPhone from "./pages/auth/ForgotPhone";
import OtpVerify from "./pages/auth/OtpVerify";
import ResetPassword from "./pages/auth/ResetPassword";

// Separate component that uses hooks inside Router context
function AppContent() {
  const auth = useAuth();
  const shop = useShop();

  console.log('AppContent rendered:', { 
    isLoggedIn: auth.isLoggedIn, 
    shopPage: shop.shopPage,
    foodItemsLength: shop.foodItems?.length 
  });

  // Add error boundary
  try {
    return (
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={
          <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #36d1c4 0%, #1e90ff 100%)' }}>
            {!auth.isLoggedIn ? <Login {...auth} /> : <Navigate to="/" />}
          </div>
        } />
        <Route path="/register" element={
          <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #36d1c4 0%, #1e90ff 100%)' }}>
            {!auth.isLoggedIn ? <Register {...auth} /> : <Navigate to="/" />}
          </div>
        } />
        <Route path="/forgot" element={
          <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #36d1c4 0%, #1e90ff 100%)' }}>
            <ForgotPhone {...auth} />
          </div>
        } />
        <Route path="/otp" element={
          <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #36d1c4 0%, #1e90ff 100%)' }}>
            <OtpVerify {...auth} />
          </div>
        } />
        <Route path="/reset" element={
          <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #36d1c4 0%, #1e90ff 100%)' }}>
            <ResetPassword {...auth} />
          </div>
        } />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <RequireAdmin>
              <AdminDashboard foodItems={shop.foodItems} setFoodItems={shop.setFoodItems} />
            </RequireAdmin>
          }
        />

        {/* Protected app routes */}
        <Route path="/" element={
          auth.isLoggedIn ? (
            <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
              <Navbar
                isAdmin={auth.isAdmin}
                cart={shop.cart}
                shopPage={shop.shopPage}
                setShopPage={shop.setShopPage}
                handleLogout={auth.handleLogout}
                handleSearch={shop.handleSearch}
              />
              {auth.isAdmin ? (
                <AdminDashboard foodItems={shop.foodItems} setFoodItems={shop.setFoodItems} />
              ) : (
                <>
                  {/* Home */}
                  {shop.shopPage === "home" && (
                    <FoodList
                      category="home"
                      foodItems={shop.foodItems}
                      handleAddToCart={shop.handleAddToCart}
                    />
                  )}

                  {/* Category pages */}
                  {(shop.shopPage === "South Indian" ||
                    shop.shopPage === "Fast Food" ||
                    shop.shopPage === "Chinese Food") && (
                    <FoodList
                      category={shop.shopPage}
                      foodItems={shop.foodItems.filter(
                        (item) => item.category === shop.shopPage
                      )}
                      handleAddToCart={shop.handleAddToCart}
                    />
                  )}

                  {/* Search Results */}
                  {shop.shopPage === "search" && (
                    <FoodList
                      category="search"
                      foodItems={shop.getFilteredFoodItems()}
                      handleAddToCart={shop.handleAddToCart}
                      searchQuery={shop.searchQuery}
                    />
                  )}

                  {/* Cart */}
                  {shop.shopPage === "cart" && (
                    <CartPage
                      cart={shop.cart}
                      handleQuantityChange={shop.handleQuantityChange}
                      handleRemoveFromCart={shop.handleRemoveFromCart}
                      setShopPage={shop.setShopPage}
                    />
                  )}

                  {/* Order */}
                  {shop.shopPage === "order" && (
                    <OrderPage
                      cart={shop.cart}
                      setCart={shop.setCart}
                      setShopPage={shop.setShopPage}
                    />
                  )}
                </>
              )}
            </div>
          ) : (
            <Navigate to="/login" />
          )
        } />
      </Routes>
    );
  } catch (error) {
    console.error('Error in AppContent:', error);
    return (
      <div style={{ padding: '20px', textAlign: 'center', minHeight: '100vh', background: '#f5f5f5' }}>
        <h1>Something went wrong!</h1>
        <p>Error: {error.message}</p>
        <button onClick={() => window.location.reload()}>Reload Page</button>
      </div>
    );
  }
}

function App() {
  console.log('App component rendered');
  
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App; 


