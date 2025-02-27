import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginApi, signup as signupApi, verifyOTP as verifyOtpApi } from "../api/authApi"; // ✅ Fix import
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import "../styles/LoginPage.css"; // ✅ Import correct CSS


export default function LoginPage() {
  const { login: setUserAuth } = useContext(AuthContext);
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false); // ✅ Show OTP Input After Signup
  const navigate = useNavigate();

  // Login States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  // Signup States
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [otp, setOtp] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginApi({ email, password, role });
      setUserAuth(data.access_token);
      toast.success("Login successful!");
      navigate(data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid credentials!");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    // ✅ Validate input fields
    if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      toast.error("All fields are required!");
      setLoading(false);
      return;
    }
  
    // ✅ Prepare signup data
    const signupData = {
      name: signupName.trim(),
      email: signupEmail.trim(),
      password: signupPassword.trim(),
      role: "user", // ✅ Always "user"
    };
  
    console.log("📤 Sending Signup Request:", signupData); // ✅ Debugging Log
  
    try {
      const response = await signupApi(signupData);
      console.log("✅ Signup Success:", response);
  
      toast.success("Signup successful! Check your email for OTP.");
      setShowOtpField(true); // ✅ Show OTP input field
    } catch (error) {
      console.error("❌ Signup Failed:", error.response?.data || error);
      toast.error(error?.response?.data?.message || "Signup failed!");
    } finally {
      setLoading(false);
    }
  };
  
  

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const otpData = {
      email: signupEmail.trim(),  
      otp: otp.trim(),            
      name: signupName.trim(),    
      password: signupPassword,   
    };
  
    console.log("🔍 Sending OTP Verification Request:", otpData); 
  
    if (!otpData.email || !otpData.otp || !otpData.name || !otpData.password) {
      toast.error("All fields are required for OTP verification!");
      setLoading(false);
      return;
    }
  
    try {
      const response = await verifyOtpApi(otpData);
      console.log("✅ OTP Verification Success:", response);
  
      // ✅ Store access token and user details
      setUserAuth(response.access_token);
      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("refresh_token", response.refresh_token);
      localStorage.setItem("user", JSON.stringify(response.user));
  
      toast.success("OTP Verified! Redirecting...");
      navigate("/dashboard");
    } catch (error) {
      console.error("❌ OTP Verification Failed:", error.response?.data || error);
      toast.error(error?.response?.data?.message || "Invalid OTP!");
    } finally {
      setLoading(false);
    }
  };
  


  return (
    <div className={`container ${isSignup ? "right-panel-active" : ""}`}>
      {/* ✅ Sign In Form */}
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
          <button type="submit" className="login-btn">
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </form>
      </div>

      {/* ✅ Sign Up Form */}
      <div className="form-container sign-up-container">
        {!showOtpField ? (
          <form onSubmit={handleSignup}>
            <h1>Create Account</h1>
            <input type="text" placeholder="Name" value={signupName} onChange={(e) => setSignupName(e.target.value)} required />
            <input type="email" placeholder="Email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} required />
            <button type="submit" className="signup-btn">
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <h1>Verify OTP</h1>
            <p>Check your email for the OTP code.</p>
            <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
            <button type="submit" className="verify-btn">
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}
      </div>

      {/* ✅ Overlay for Smooth Animation */}
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
