import React from 'react';
import { orderInputStyle } from '../../styles/styles';

function ResetPassword({ newPassword, setNewPassword, confirmNewPassword, setConfirmNewPassword, handleResetPassword, goToLogin, message }) {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #36d1c4 0%, #1e90ff 100%)', paddingTop: 60 }}>
      <div style={{
        maxWidth: 350, margin: '40px auto', padding: 24, border: '1px solid #eee', borderRadius: 10,
        background: '#fff', boxShadow: '0 2px 16px rgba(0,0,0,0.08)', fontFamily: 'sans-serif'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Forgot Password</h2>
        {message && <div style={{ color: message.includes('successful') ? '#28a745' : '#dc3545', marginBottom: 16, textAlign: 'center' }}>{message}</div>}
        <form onSubmit={handleResetPassword}>
          <label style={{ fontWeight: 500, marginBottom: 2, display: 'block' }}>New Password</label>
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
            style={orderInputStyle}
          />
          <label style={{ fontWeight: 500, marginBottom: 2, display: 'block' }}>Confirm New Password</label>
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmNewPassword}
            onChange={e => setConfirmNewPassword(e.target.value)}
            required
            style={orderInputStyle}
          />
          <button type="submit" style={{
            width: '100%', padding: 12, background: '#28a745', color: '#fff', border: 'none',
            borderRadius: 4, fontWeight: 600, fontSize: 16, cursor: 'pointer', marginTop: 4, marginBottom: 8
          }}>Set New Password</button>
          <div style={{ marginTop: 10, textAlign: 'center', fontSize: 15 }}>
            <span style={{ color: '#1abc9c', cursor: 'pointer', textDecoration: 'underline', marginLeft: 4 }}
              onClick={goToLogin}>Back to Login</span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword; 