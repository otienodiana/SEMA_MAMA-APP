import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const AllowedUser = ({ allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />; // If not logged in
  if (!allowedRoles.includes(user.role)) return <Navigate to="/dashboard" replace />; // Redirect if role is not allowed

  return <Outlet />; // Render child routes
};

export default AllowedUser;
