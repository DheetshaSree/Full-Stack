import { useState } from 'react';
import initialFoodData from '../data/foodData';

export default function useShop() {
  const [cart, setCart] = useState([]);
  const [shopPage, setShopPage] = useState('home'); // home, south, fast, chinese, cart, order
  const [foodItems, setFoodItems] = useState(initialFoodData);
  const [searchQuery, setSearchQuery] = useState('');

  // Save cart to database (without affecting existing functionality)
  const saveCartToDatabase = async (cartItems) => {
    try {
      // Get current user ID from localStorage
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      const userId = currentUser ? currentUser.id : 'temp-user-' + Date.now();
      
      console.log('Saving cart to database:', { userId, cartItems });
      
      // Save each item to database
      for (const item of cartItems) {
        const response = await fetch('/api/cart/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: userId,
            foodId: item.id.toString(),
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            description: item.description
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Failed to save item to cart:', errorData);
          throw new Error(`HTTP ${response.status}: ${errorData.message}`);
        }
        
        const result = await response.json();
        console.log('Item saved to cart:', result);
      }
      
      console.log('Cart saved to database successfully!');
    } catch (error) {
      console.error('Could not save to database (using local storage as fallback):', error);
    }
  };

  const handleAddToCart = (item) => {
    if (item.stock <= 0) {
      alert('This item is out of stock!');
      return;
    }
    
    setCart(prev => {
      const existingItem = prev.find(i => i.id === item.id);
      let updatedCart;
      
      if (existingItem) {
        if (existingItem.quantity >= item.stock) {
          alert(`Only ${item.stock} available in stock!`);
          return prev;
        }
        updatedCart = prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      } else {
        updatedCart = [...prev, { ...item, quantity: 1 }];
      }
      
      // Save to database after updating cart
      saveCartToDatabase(updatedCart);
      return updatedCart;
    });
    
    setFoodItems(prev => prev.map(food => food.id === item.id ? { ...food, stock: food.stock - 1 } : food)); 
    alert('Added to cart!');
  };

  const handleRemoveFromCart = (id, quantity) => {
    setCart(prev => prev.filter(i => i.id !== id));
    setFoodItems(prev => prev.map(food => food.id === id ? { ...food, stock: food.stock + quantity } : food));
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    const itemInCart = cart.find(item => item.id === id);
    const originalItem = foodItems.find(item => item.id === id);
    if (newQuantity > originalItem.stock + itemInCart.quantity) {
      alert(`Only ${originalItem.stock + itemInCart.quantity} available in stock!`);
      return;
    }
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
    setFoodItems(prev => prev.map(item => item.id === id ? { ...item, stock: originalItem.stock + itemInCart.quantity - newQuantity } : item));
  };

  const restoreCartToStockAndClear = () => {
    cart.forEach(item => {
      setFoodItems(prev => prev.map(food => food.id === item.id ? { ...food, stock: food.stock + item.quantity } : food));
    });
    setCart([]);
  };

  // Search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      setShopPage('search');
    }
  };

  const getFilteredFoodItems = () => {
    if (!searchQuery.trim()) return foodItems;
    
    const query = searchQuery.toLowerCase();
    return foodItems.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  };

  return {
    cart, setCart,
    shopPage, setShopPage,
    foodItems, setFoodItems,
    searchQuery, setSearchQuery,
    handleAddToCart, handleRemoveFromCart, handleQuantityChange,
    restoreCartToStockAndClear,
    handleSearch, getFilteredFoodItems,
  };
} 