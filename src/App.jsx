import { AuthProvider } from "./context/AuthProvider";
import AppRouter from "./router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <AuthProvider>
      <ToastContainer />
      <AppRouter />
    </AuthProvider>
  );
}
