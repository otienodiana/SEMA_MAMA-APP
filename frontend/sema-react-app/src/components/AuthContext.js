import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
      setUser(JSON.parse(storedUser));
      console.log("✅ User loaded from localStorage:", JSON.parse(storedUser)); // Debugging
    } else {
      setUser(null);
      console.log("⚠️ No valid user found in localStorage"); // Debugging
    }
  }, []);

  const login = (userData) => {
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      console.log("✅ User logged in and stored:", userData); // Debugging
    } else {
      console.error("❌ login() was called with invalid userData:", userData);
    }
  };
  

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    console.log("🚪 User logged out");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
