import React from 'react';

const FoodList = ({ category, foodItems, handleAddToCart }) => {
  // Safety check for foodItems
  if (!foodItems || !Array.isArray(foodItems)) {
    return <div style={{ padding: 32, textAlign: 'center' }}>Loading...</div>;
  }

  // For home page, show all items instead of filtering by category
  // For search, items are already filtered in useShop hook
  const filteredItems = category === 'home' 
    ? foodItems 
    : category === 'search'
    ? foodItems
    : foodItems.filter(item => item.category === category);


  return (
    <div style={{ padding: 32 }}>
      {category === 'home' && (
        <div style={{
          background: 'linear-gradient(90deg, #ff9800 0%, #ffb347 100%)',
          borderRadius: 16, padding: 32, textAlign: 'center', marginBottom: 32
        }}>
          <h1 style={{ color: '#fff', fontSize: 48, fontWeight: 700 }}>Delicious Food Delivered</h1>
          <p style={{ color: '#fff', fontSize: 22, margin: '16px 0' }}>
            Order your favorite meals from the comfort of your home
          </p>
          <div style={{
            background: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 600,
            display: 'inline-block', padding: '16px 32px', borderRadius: 12, fontSize: 20
          }}>
            🚚 Free Delivery on orders above ₹299
          </div>
        </div>
      )}

      <h2 style={{ textAlign: 'center', fontWeight: 700, fontSize: 32, margin: '32px 0 24px' }}>
        {category === 'home' ? 'Featured Items' : 
         category === 'search' ? 'Search Results' : 
         `${category} Cuisine`}
      </h2>

      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center'
      }}>
        {filteredItems && filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <div key={item.id} style={{
              width: 260, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #eee',
              overflow: 'hidden', display: 'flex', flexDirection: 'column'
            }}>
              <img src={item.image} alt={item.name} style={{ width: '100%', height: 150, objectFit: 'cover' }} />
              <div style={{ padding: 18, flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 20 }}>{item.name}</div>
                <div style={{ color: '#666', fontSize: 15, margin: '8px 0 12px' }}>{item.description}</div>
                <div style={{ color: '#ff9800', fontWeight: 700, fontSize: 20, marginBottom: 10 }}>₹{item.price}</div>
                <div style={{
                  color: item.stock > 5 ? '#28a745' : item.stock > 0 ? '#ffc107' : '#dc3545',
                  fontWeight: 600,
                  marginBottom: 10
                }}>
                  {item.stock > 0 ? `${item.stock} available` : 'Out of stock'}
                </div>
                <button
                  style={{
                    width: '100%',
                    background: item.stock > 0
                      ? 'linear-gradient(90deg, #ff9800 0%, #ffb347 100%)'
                      : '#cccccc',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '10px 0',
                    fontWeight: 600,
                    fontSize: 16,
                    cursor: item.stock > 0 ? 'pointer' : 'not-allowed'
                  }}
                  onClick={() => item.stock > 0 && handleAddToCart(item)}
                  disabled={item.stock <= 0}
                >
                  {item.stock > 0 ? '+ Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <p style={{ fontSize: 20, fontWeight: 600, color: '#999', marginBottom: 8 }}>
              {category === 'search' ? 'No results found' : 'No items available in this category.'}
            </p>
            {category === 'search' && (
              <p style={{ fontSize: 16, color: '#666' }}>
                Try searching with different keywords or check the spelling.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default FoodList;
