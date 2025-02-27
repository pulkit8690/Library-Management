import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode"; // ✅ FIXED IMPORT
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && token !== "undefined" && token !== "null") {
      try {
        const decoded = jwtDecode(token);
        console.log("✅ Decoded Token:", decoded);
        setUser(decoded);
      } catch (error) {
        console.error("❌ Invalid token detected:", error);
        logout(); // Remove bad token
      }
    }
  }, []);

  const login = (token) => {
    if (!token || token === "undefined") {
      console.error("❌ Login failed: Invalid token received");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(decoded)); // ✅ Store user info for persistence
      setUser(decoded);
      console.log("✅ User logged in:", decoded);
    } catch (error) {
      console.error("❌ Failed to decode token:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // ✅ Clear stored user info
    setUser(null);
    console.log("✅ User logged out");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Add PropTypes validation
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
