import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import RequireAdmin from './components/RequireAdmin';
import FoodList from './components/FoodList';
import CartPage from './components/CartPage';
import OrderPage from './components/OrderPage';
import Navbar from './components/Navbar';
import { useState } from 'react';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import useAuth from './hooks/useAuth';
import useShop from './hooks/useShop';

function App() {
  const [foodItems, setFoodItems] = useState([]);
  const auth = useAuth();
  const shop = useShop();

  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={!auth.isLoggedIn ? <Login {...auth} /> : <Navigate to="/" />} />
        <Route path="/register" element={!auth.isLoggedIn ? <Register {...auth} /> : <Navigate to="/" />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <RequireAdmin>
              <AdminDashboard foodItems={foodItems} setFoodItems={setFoodItems} />
            </RequireAdmin>
          }
        />

        {/* Protected app routes */}
        <Route path="/" element={
          auth.isLoggedIn ? (
            <div>
              <Navbar
                isAdmin={auth.isAdmin}
                cart={shop.cart}
                shopPage={shop.shopPage}
                setShopPage={shop.setShopPage}
                handleLogout={auth.handleLogout}
                handleSearch={shop.handleSearch}
              />
              {auth.isAdmin ? (
                <AdminDashboard foodItems={foodItems} setFoodItems={setFoodItems} />
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

                  {/* South Indian */}
                  {shop.shopPage === "South Indian" && (
                    <FoodList
                      category="South Indian"
                      foodItems={shop.foodItems}
                      handleAddToCart={shop.handleAddToCart}
                    />
                  )}

                  {/* North Indian */}
                  {shop.shopPage === "North Indian" && (
                    <FoodList
                      category="North Indian"
                      foodItems={shop.foodItems}
                      handleAddToCart={shop.handleAddToCart}
                    />
                  )}

                  {/* Fast Food */}
                  {shop.shopPage === "Fast Food" && (
                    <FoodList
                      category="Fast Food"
                      foodItems={shop.foodItems}
                      handleAddToCart={shop.handleAddToCart}
                    />
                  )}

                  {/* Chinese Food */}
                  {shop.shopPage === "Chinese Food" && (
                    <FoodList
                      category="Chinese Food"
                      foodItems={shop.foodItems}
                      handleAddToCart={shop.handleAddToCart}
                    />
                  )}

                  {/* Desserts */}
                  {shop.shopPage === "Desserts" && (
                    <FoodList
                      category="Desserts"
                      foodItems={shop.foodItems}
                      handleAddToCart={shop.handleAddToCart}
                    />
                  )}

                  {/* Beverages */}
                  {shop.shopPage === "Beverages" && (
                    <FoodList
                      category="Beverages"
                      foodItems={shop.foodItems}
                      handleAddToCart={shop.handleAddToCart}
                    />
                  )}

                  {/* Search Results */}
                  {shop.shopPage === "search" && (
                    <FoodList
                      category="search"
                      foodItems={shop.getFilteredFoodItems()}
                      handleAddToCart={shop.handleAddToCart}
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
    </Router>
  );
}

export default App;
