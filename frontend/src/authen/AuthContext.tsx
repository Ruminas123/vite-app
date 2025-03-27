import React, { createContext, useState, useContext, useEffect } from "react";
import axios, { AxiosResponse, AxiosError } from 'axios';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  henchman: any;
  login: (userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => localStorage.getItem("isAuthenticated") === "true"
  );
  const [user, setUser] = useState<any>(
    () => JSON.parse(localStorage.getItem("user") || "null")
  );
  const [henchman, setHenchman] = useState<any>(JSON.parse(localStorage.getItem("henchman") || "[]"));

  // Function to get henchman data based on employee_key
  const get_employee_henchman = async (employee_key: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/getHenchman/${employee_key}`);
      return response.data;
    } catch (err: any) {
      console.error('Error fetching employees:', err);
      return [];
    }
  };

  // Fetch and save data when authentication status or user changes
  useEffect(() => {
    const fetchAndSaveData = async () => {
      if (user?.employee_key) {
        const henchmanData = await get_employee_henchman(user.employee_key);
        if (henchmanData.length) {
          localStorage.setItem("henchman", JSON.stringify(henchmanData));
          setHenchman(henchmanData); // Set henchman data in the state
        } else {
          localStorage.removeItem("henchman");
          setHenchman([]); // Clear henchman in state
        }
      }
      localStorage.setItem("isAuthenticated", JSON.stringify(isAuthenticated));
      localStorage.setItem("user", JSON.stringify(user));
    };
    fetchAndSaveData();
  }, [isAuthenticated, user]);

  const login = (userData: any) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    localStorage.removeItem("henchman");
    setHenchman([]); // Clear henchman data in state
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, henchman, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
