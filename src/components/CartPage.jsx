import React from 'react';

function CartPage({ cart, handleQuantityChange, handleRemoveFromCart, setShopPage }) {
  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontWeight: 700, fontSize: 32, marginBottom: 24 }}>Your Cart</h2>
      {cart.length === 0 ? (
        <div style={{ fontSize: 20, color: '#888' }}>Your cart is empty.</div>
      ) : (
        <div style={{ display: 'flex', gap: 32 }}>
          <div style={{ flex: 2 }}>
            {cart.map(item => (
              <div key={item.id} style={{
                display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 10,
                boxShadow: '0 2px 8px #eee', marginBottom: 18, padding: 16
              }}>
                <img src={item.image} alt={item.name} style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover', marginRight: 18 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 20 }}>{item.name}</div>
                  <div style={{ color: '#666', fontSize: 15 }}>{item.description}</div>
                  <div style={{ color: '#ff9800', fontWeight: 700, fontSize: 18 }}>₹{item.price}</div>
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      style={{ 
                        background: '#f0f0f0', 
                        border: 'none', 
                        width: 28, 
                        height: 28, 
                        borderRadius: '50%', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      -
                    </button>
                    <span style={{ margin: '0 12px', fontSize: 16 }}>{item.quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      style={{ 
                        background: '#f0f0f0', 
                        border: 'none', 
                        width: 28, 
                        height: 28, 
                        borderRadius: '50%', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  style={{
                    background: 'none', border: 'none', color: 'red', fontSize: 22, cursor: 'pointer'
                  }}
                  onClick={() => handleRemoveFromCart(item.id, item.quantity)}
                  title="Remove"
                >🗑️</button>
              </div>
            ))}
          </div>
          <div style={{
            flex: 1, background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px #eee', padding: 24, height: 'fit-content'
          }}>
            <h3 style={{ fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Order Summary</h3>
            <div style={{ fontSize: 18, marginBottom: 8 }}>
              Subtotal <span style={{ float: 'right' }}>₹{cart.reduce((sum, i) => sum + i.price * i.quantity, 0)}</span>
            </div>
            <div style={{ fontSize: 18, marginBottom: 8 }}>
              Delivery Fee <span style={{ float: 'right' }}>₹{cart.length > 0 ? 40 : 0}</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: 20, margin: '18px 0' }}>
              Total <span style={{ float: 'right' }}>₹{cart.reduce((sum, i) => sum + i.price * i.quantity, 0) + (cart.length > 0 ? 40 : 0)}</span>
            </div>
            <button
              style={{
                width: '100%', background: 'linear-gradient(90deg, #ff9800 0%, #ffb347 100%)',
                color: '#fff', border: 'none', borderRadius: 6, padding: '12px 0', fontWeight: 600, fontSize: 18, cursor: 'pointer'
              }}
              onClick={() => setShopPage('order')}
            >Proceed to Order</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage; 