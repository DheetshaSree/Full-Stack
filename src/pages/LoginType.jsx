import React from 'react';

function LoginType({ setShowLoginType, setView, setIsAdmin }) {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #36d1c4 0%, #1e90ff 100%)'
    }}>
      <div style={{ 
        textAlign: 'center', 
        background: '#fff', 
        padding: '40px 60px', 
        borderRadius: 16,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          fontSize: 36, 
          fontWeight: 700, 
          color: '#ff9800', 
          marginBottom: 40,
          fontFamily: 'cursive'
        }}>
          🍴 YummyCart
        </h1>
        <h2 style={{ 
          fontSize: 24, 
          fontWeight: 600, 
          marginBottom: 30,
          color: '#333'
        }}>
          Welcome to YummyCart
        </h2>
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
          <button 
            style={{
              padding: '16px 32px',
              background: 'linear-gradient(90deg, #ff9800 0%, #ffb347 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 18,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
              width: 200
            }}
            onClick={() => {
              setShowLoginType(false);
              setView('login');
              setIsAdmin(false);
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Login
          </button>
          <button 
            style={{
              padding: '16px 32px',
              background: 'linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 18,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
              width: 200
            }}
            onClick={() => {
              setShowLoginType(false);
              setView('login');
              setIsAdmin(true);
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Admin Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginType; 