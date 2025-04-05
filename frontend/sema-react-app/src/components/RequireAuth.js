import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const RequireAuth = () => {
  const { user } = useAuth();

  console.log("Checking authentication:", user); // ✅ Debugging

  // 🛑 Fix: Prevent flickering by adding a loading state
  if (user === undefined) {
    return <p>Loading...</p>; // Or a spinner component
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default RequireAuth;
