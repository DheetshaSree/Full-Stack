import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "/api/auth";
// Hardcoded admin credentials (for client-side demo only)
const ADMIN_EMAIL = "admin@foodapp.com";
const ADMIN_PASSWORD = "Admin@123";

export default function useAuth() {
  console.log('useAuth hook called');
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    phone: "",
    countryCode: "+91",
    password: "",
    confirmPassword: "",
  });
  const [view, setView] = useState("login");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Forgot password flow states
  const [forgotPhone, setForgotPhone] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const navigate = useNavigate();

  console.log('useAuth initial state:', { isLoggedIn, isAdmin, user, view, message, isLoading });

  useEffect(() => {
    console.log('useAuth useEffect called');
    const token = localStorage.getItem("token");
    console.log('Token from localStorage:', token);
    if (token) {
      // Verify token with backend
      verifyToken(token);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      console.log('Verifying token...');
      const response = await fetch(`${API_URL}/verify`, {
        method: "GET",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
      });
      
      if (response.ok) {
        const userData = await response.json();
        console.log('Token verification successful:', userData);
        setIsLoggedIn(true);
        setUser(userData);
        // Determine admin from server role or previously stored flag
        const storedAdmin = localStorage.getItem('isAdmin') === 'true';
        const computedIsAdmin = userData?.role === 'admin' || storedAdmin;
        setIsAdmin(computedIsAdmin);
      } else {
        console.log('Token verification failed, removing token');
        // Token is invalid, remove it
        localStorage.removeItem("token");
        localStorage.removeItem('isAdmin');
        setIsLoggedIn(false);
        setUser(null);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      localStorage.removeItem("token");
      localStorage.removeItem('isAdmin');
      setIsLoggedIn(false);
      setUser(null);
      setIsAdmin(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    
    try {
      console.log('Attempting login with:', loginData);
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      
      const data = await response.json();
      console.log('Login response:', data);
      
      if (response.ok) {
        localStorage.setItem("token", data.token);
        setIsLoggedIn(true);
        setUser({
          id: data.id,
          email: data.email,
          username: data.username
        });
        // Decide admin: either server says so, or hardcoded email+password match
        const isAdminLogin = (data?.role === 'admin') || (loginData.email === ADMIN_EMAIL && loginData.password === ADMIN_PASSWORD);
        setIsAdmin(isAdminLogin);
        localStorage.setItem('isAdmin', isAdminLogin ? 'true' : 'false');
        setMessage("Login successful!");
        navigate(isAdminLogin ? "/admin/dashboard" : "/");
      } else {
        setMessage(data.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    
    if (registerData.password !== registerData.confirmPassword) {
      setMessage("Passwords do not match");
      setIsLoading(false);
      return;
    }
    
    try {
      console.log('Attempting registration with:', registerData);
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });
      
      const data = await response.json();
      console.log('Registration response:', data);
      
      if (response.ok) {
        setMessage("Registration successful! Please login.");
        // Clear form data
        setRegisterData({
          username: "",
          email: "",
          phone: "",
          countryCode: "+91",
          password: "",
          confirmPassword: "",
        });
        setView("login");
      } else {
        setMessage(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password: step 1 - send OTP
  const handleForgotPhone = async (e) => {
    e.preventDefault();
    setMessage("");

    const digitsOnly = (forgotPhone || '').replace(/\D/g, '');
    if (digitsOnly.length !== 10) {
      setMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    // Simulate sending OTP (client-side). In production, call backend.
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem('resetOtp', generated);
    localStorage.setItem('resetPhone', digitsOnly);
    console.log('Generated OTP (dev only):', generated);

    // Show OTP to user via alert for testing convenience
    try {
      alert(`Your OTP is ${generated}`);
    } catch (_) {}

    setMessage("OTP sent successfully to your mobile number.");
    navigate('/otp');
  };

  // Forgot password: step 2 - verify OTP
  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    const expected = localStorage.getItem('resetOtp');
    if (!expected) {
      setMessage('OTP session expired. Please request a new OTP.');
      navigate('/forgot');
      return;
    }

    if (otpInput.trim() !== expected) {
      setMessage('Invalid OTP. Please try again.');
      return;
    }

    setMessage('OTP verified successfully.');
    navigate('/reset');
  };

  // Forgot password: step 3 - set new password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");

    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      const phoneDigits = (localStorage.getItem('resetPhone') || '').replace(/\D/g, '');
      const resp = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneDigits, newPassword })
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        setMessage(data.message || 'Could not update password.');
        return;
      }
    } catch (err) {
      console.error('Reset password request failed:', err);
      setMessage('Network error. Please try again.');
      return;
    }

    // Clear temporary data and notify success
    localStorage.removeItem('resetOtp');
    localStorage.removeItem('resetPhone');

    setForgotPhone("");
    setOtpInput("");
    setNewPassword("");
    setConfirmNewPassword("");

    setMessage('Password reset successful! Please login.');
    navigate('/login');
  };

  const handleLogout = () => {
    console.log('Logging out...');
    localStorage.removeItem("token");
    localStorage.removeItem('isAdmin');
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUser(null);
    setLoginData({ email: "", password: "" });
    setView("login");
    setMessage("");
    navigate("/login");
  };

  const goToRegister = () => {
    setView("register");
    setMessage("");
  };
  
  const goToLogin = () => {
    setView("login");
    setMessage("");
    navigate('/login');
  };

  console.log('useAuth returning:', { isLoggedIn, isAdmin, user, view, message, isLoading });

  return {
    isLoggedIn,
    isAdmin,
    user,
    loginData,
    setLoginData,
    registerData,
    setRegisterData,
    handleLogin,
    handleRegister,
    handleLogout,
    view,
    goToRegister,
    goToLogin,
    message,
    setMessage,
    isLoading,

    // Forgot password flow
    forgotPhone,
    setForgotPhone,
    handleForgotPhone,
    otpInput,
    setOtpInput,
    handleOtpSubmit,
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
    handleResetPassword,
  };
}
