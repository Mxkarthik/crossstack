import { createContext, useContext, useEffect, useState } from "react";
import api from "../apiintercepter.js";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const { data } = await api.get("/api/v1/me");
      setUser(data);
      setIsAuth(true);
    } catch (error) {
      // 401 / 403 is NORMAL → user not logged in
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        console.error("Unexpected auth error:", error);
      }
      setUser(null);
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isAuth,
        setIsAuth,
        loading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const AppData = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppData must be used within AppProvider");
  }
  return context;
};
