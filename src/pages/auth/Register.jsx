import React from 'react';
import { Link } from 'react-router-dom';
import { orderInputStyle } from '../../styles/styles';

function Register({ registerData, setRegisterData, handleRegister, message, isLoading }) {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #36d1c4 0%, #1e90ff 100%)', paddingTop: 60 }}>
      <div style={{
        maxWidth: 350, margin: '40px auto', padding: 24, border: '1px solid #eee', borderRadius: 10,
        background: '#fff', boxShadow: '0 2px 16px rgba(0,0,0,0.08)', fontFamily: 'sans-serif'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Sign Up</h2>
        {message && <div style={{ 
          color: message.includes('successful') ? '#28a745' : '#dc3545', 
          marginBottom: 16, 
          textAlign: 'center',
          padding: '8px',
          backgroundColor: message.includes('successful') ? '#d4edda' : '#f8d7da',
          borderRadius: '4px',
          border: `1px solid ${message.includes('successful') ? '#c3e6cb' : '#f5c6cb'}`
        }}>{message}</div>}
        <form onSubmit={handleRegister}>
          <label style={{ fontWeight: 500, marginBottom: 2, display: 'block' }}>Username</label>
          <input
            type="text"
            placeholder="Username"
            value={registerData.username}
            onChange={e => setRegisterData({ ...registerData, username: e.target.value })}
            required
            style={orderInputStyle}
            disabled={isLoading}
          />
          <label style={{ fontWeight: 500, marginBottom: 2, display: 'block' }}>Email</label>
          <input
            type="email"
            placeholder="Email"
            value={registerData.email}
            onChange={e => setRegisterData({ ...registerData, email: e.target.value })}
            required
            style={orderInputStyle}
            disabled={isLoading}
          />
          <label style={{ fontWeight: 500, marginBottom: 2, display: 'block' }}>Phone</label>
          <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
            <select
              value={registerData.countryCode}
              onChange={e => setRegisterData({ ...registerData, countryCode: e.target.value })}
              style={{ ...orderInputStyle, width: 90, marginBottom: 0 }}
              disabled={isLoading}
            >
              <option value="+91">+91</option>
              <option value="+1">+1</option>
              <option value="+44">+44</option>
              <option value="+86">+86</option>
              <option value="+81">+81</option>
              <option value="+49">+49</option>
              <option value="+33">+33</option>
              <option value="+61">+61</option>
              <option value="+7">+7</option>
              <option value="+55">+55</option>
            </select>
            <input
              type="tel"
              placeholder="Phone number"
              value={registerData.phone}
              onChange={e => setRegisterData({ ...registerData, phone: e.target.value })}
              required
              style={{ ...orderInputStyle, flex: 1, marginBottom: 0 }}
              disabled={isLoading}
            />
          </div>
          <label style={{ fontWeight: 500, marginBottom: 2, display: 'block' }}>Password</label>
          <input
            type="password"
            placeholder="Password"
            value={registerData.password}
            onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
            required
            style={orderInputStyle}
            disabled={isLoading}
          />
          <label style={{ fontWeight: 500, marginBottom: 2, display: 'block' }}>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm password"
            value={registerData.confirmPassword}
            onChange={e => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
            required
            style={orderInputStyle}
            disabled={isLoading}
          />
          <button 
            type="submit" 
            style={{
              width: '100%', 
              padding: 12, 
              background: '#1abc9c', 
              color: '#fff', 
              border: 'none',
              borderRadius: 4, 
              fontWeight: 600, 
              fontSize: 16, 
              cursor: 'pointer', 
              marginTop: 4, 
              marginBottom: 8,
              opacity: isLoading ? 0.7 : 1,
              transition: 'opacity 0.2s ease'
            }}
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
          <div style={{ textAlign: 'center', fontSize: 15 }}>
            Already have an account?
            <Link to="/login" style={{ color: '#1abc9c', cursor: 'pointer', textDecoration: 'underline', marginLeft: 4 }}>Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
