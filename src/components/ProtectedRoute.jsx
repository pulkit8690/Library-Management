import { useContext } from "react";
import PropTypes from "prop-types"; // ✅ Import PropTypes
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

// ✅ Add PropTypes validation
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
