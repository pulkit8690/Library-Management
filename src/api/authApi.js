import axiosInstance from "./axiosInstance";

// ✅ Signup API
export const signup = async (userData) => {
  try {
    console.log("📤 API Call: Sending Signup Request:", userData); // ✅ Debugging Log
    const response = await axiosInstance.post("/auth/signup", userData);
    console.log("✅ Signup API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Signup API Error:", error.response?.data || error);
    throw error.response?.data?.message || "Signup failed!";
  }
};


// ✅ Ensure this function is correctly formatted
export const verifyOTP = async (otpData) => {
  try {
    console.log("Sending OTP verification request:", otpData); // ✅ Debugging Log
    const response = await axiosInstance.post("/auth/verify_otp", otpData);
    console.log("OTP Verification Success:", response.data); // ✅ Debugging Log
    return response.data;
  } catch (error) {
    console.error("OTP Verification Failed:", error.response?.data || error);
    throw error.response?.data?.message || "OTP verification failed!";
  }
};


// ✅ Login API
export const login = async (credentials) => {
  try {
    const response = await axiosInstance.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Login failed!";
  }
};

// ✅ Forgot Password API
export const forgotPassword = async (emailData) => {
  try {
    const response = await axiosInstance.post("/auth/forgot_password", emailData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to send reset password OTP!";
  }
};

// ✅ Reset Password API
export const resetPassword = async (resetData) => {
  try {
    const response = await axiosInstance.post("/auth/reset_password", resetData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Password reset failed!";
  }
};

// ✅ Fetch Profile API
export const getProfile = async () => {
  try {
    const response = await axiosInstance.get("/auth/profile");
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch user profile!";
  }
};
