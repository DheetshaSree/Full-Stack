import React from "react";
import { Link } from "react-router-dom";

function Login({ loginData, setLoginData, handleLogin, message, isLoading }) {
  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>Login</h2>
        {message && <p style={message.includes('successful') ? styles.success : styles.error}>{message}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={loginData.email}
            onChange={(e) =>
              setLoginData({ ...loginData, email: e.target.value })
            }
            required
            style={styles.input}
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Password"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
            required
            style={styles.input}
            disabled={isLoading}
          />
          <button 
            type="submit" 
            style={{...styles.button, opacity: isLoading ? 0.7 : 1}}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div style={{ marginTop: 8, fontSize: 14 }}>
          <Link to="/forgot" style={{ textDecoration: 'underline', color: '#0b8ef2' }}>Forgot password?</Link>
        </div>
        <p style={styles.switchText}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.link}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #36d1c4 0%, #1e90ff 100%)",
  },
  box: {
    background: "#ffffffff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
    width: "300px",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
  },
  error: {
    color: "#dc3545",
    fontSize: "14px",
    marginBottom: "10px",
    padding: "8px",
    backgroundColor: "#f8d7da",
    borderRadius: "4px",
    border: "1px solid #f5c6cb",
  },
  success: {
    color: "#28a745",
    fontSize: "14px",
    marginBottom: "10px",
    padding: "8px",
    backgroundColor: "#d4edda",
    borderRadius: "4px",
    border: "1px solid #c3e6cb",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    boxSizing: "border-box",
  },
  button: {
    background: "#0b8ef2",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    width: "100%",
    fontWeight: "bold",
    transition: "opacity 0.2s ease",
  },
  switchText: {
    marginTop: "15px",
    fontSize: "14px",
    color: "#666",
  },
  link: {
    color: "#0b8ef2",
    fontWeight: "bold",
    cursor: "pointer",
    textDecoration: "none",
  },
};

export default Login;
