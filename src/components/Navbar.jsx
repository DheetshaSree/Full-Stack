
import React, { useState } from 'react';

function Navbar({ isAdmin, cart, shopPage, setShopPage, handleLogout, handleSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  function navLink(page) {
    return {
      margin: '0 10px',
      color: shopPage === page ? '#ff9800' : '#333',
      fontWeight: shopPage === page ? 700 : 500,
      fontSize: 18,
      cursor: 'pointer',
      textDecoration: shopPage === page ? 'underline' : 'none'
    };
  }

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 32px', height: 64, background: '#fff', boxShadow: '0 2px 8px #eee'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontWeight: 700, fontSize: 28, color: '#ff9800', fontFamily: 'cursive' }}>🍴 YummyCart</span>
        {!isAdmin && (
          <>
            <span style={navLink('home')} onClick={() => setShopPage('home')}>Home</span>
            <span style={navLink('South Indian')} onClick={() => setShopPage('South Indian')}>South Indian</span>
            <span style={navLink('Fast Food')} onClick={() => setShopPage('Fast Food')}>Fast Food</span>
            <span style={navLink('Chinese Food')} onClick={() => setShopPage('Chinese Food')}>Chinese Food</span>
          </>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        {!isAdmin && (
          <>
            {/* Search Button */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowSearch(!showSearch)}
                style={{
                  background: '#f8f9fa',
                  border: '2px solid #e9ecef',
                  borderRadius: 8,
                  padding: '8px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#495057',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#e9ecef';
                  e.target.style.borderColor = '#ff9800';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#f8f9fa';
                  e.target.style.borderColor = '#e9ecef';
                }}
              >
                🔍 Search
              </button>
              
              {/* Search Input Dropdown */}
              {showSearch && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: 8,
                  background: '#fff',
                  border: '2px solid #ff9800',
                  borderRadius: 8,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  zIndex: 1000,
                  minWidth: 250
                }}>
                  <form onSubmit={handleSearchSubmit} style={{ padding: 16 }}>
                    <input
                      type="text"
                      placeholder="Search food items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #ddd',
                        borderRadius: 6,
                        fontSize: 14,
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      autoFocus
                    />
                    <div style={{ 
                      display: 'flex', 
                      gap: 8, 
                      marginTop: 12,
                      justifyContent: 'flex-end'
                    }}>
                      <button
                        type="button"
                        onClick={() => {
                          setShowSearch(false);
                          setSearchQuery('');
                        }}
                        style={{
                          padding: '6px 12px',
                          border: '1px solid #ddd',
                          background: '#fff',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: 12
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        style={{
                          padding: '6px 12px',
                          border: 'none',
                          background: '#ff9800',
                          color: '#fff',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: 12
                        }}
                      >
                        Search
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
            
            {/* Cart Icon */}
            <span style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setShopPage('cart')}>
              🛒
              {cart.length > 0 && (
                <span style={{
                  position: 'absolute', top: -8, right: -10, background: 'red', color: '#fff',
                  borderRadius: '50%', fontSize: 12, padding: '2px 6px'
                }}>{cart.reduce((total, item) => total + item.quantity, 0)}</span>
              )}
            </span>
          </>
        )}
        <span style={{ cursor: 'pointer', color: '#333', fontWeight: 500 }} onClick={handleLogout}>Logout</span>
      </div>
    </nav>
  );
}

export default Navbar; //Navbar.jsx


