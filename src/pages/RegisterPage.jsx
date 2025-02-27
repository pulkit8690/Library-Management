import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginApi, signup as signupApi } from "../api/authApi";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import "../styles/LoginPage.css";

export default function LoginPage() {
  const { login: setUserAuth } = useContext(AuthContext);
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  // Login states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  // Signup states
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupRole, setSignupRole] = useState("user");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields!");
      return;
    }

    try {
      const data = await loginApi({ email, password, role });
      setUserAuth(data.access_token);
      toast.success("Login successful!");
      navigate(data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid credentials!");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!signupName || !signupEmail || !signupPassword) {
      toast.error("Please fill in all fields!");
      return;
    }

    try {
      await signupApi({ name: signupName, email: signupEmail, password: signupPassword, role: signupRole });
      toast.success("Signup successful! Check your email for OTP.");
      setIsSignup(false); // Automatically switch to login page after signup
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed!");
    }
  };

  return (
    <div className={`container ${isSignup ? "right-panel-active" : ""}`}>
      {/* Sign In Form */}
      <div className="form-container sign-in-container">
        <form onSubmit={handleLogin}>
          <h1>Sign In</h1>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="role-select">
            <option value="user">Login as User</option>
            <option value="admin">Login as Admin</option>
          </select>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <a href="#">Forgot your password?</a>
          <button type="submit" className="login-btn">Sign In</button>
        </form>
      </div>

      {/* Sign Up Form */}
      <div className="form-container sign-up-container">
        <form onSubmit={handleSignup}>
          <h1>Create Account</h1>
          <select value={signupRole} onChange={(e) => setSignupRole(e.target.value)} className="role-select">
            <option value="user">Sign Up as User</option>
            <option value="admin">Sign Up as Admin</option>
          </select>
          <input type="text" placeholder="Name" value={signupName} onChange={(e) => setSignupName(e.target.value)} required />
          <input type="email" placeholder="Email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} required />
          <button type="submit">Sign Up</button>
        </form>
      </div>

      {/* Overlay Container */}
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>Already have an account?</p>
            <button className="ghost" onClick={() => setIsSignup(false)}>Sign In</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello, Friend!</h1>
            <p>Dont have an account?</p>
            <button className="ghost" onClick={() => setIsSignup(true)}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
}
