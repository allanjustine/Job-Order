"use client";

import { api } from "@/lib/api";
import { fetchProfile, login, logout } from "@/lib/sanctum";
import { AuthContextType } from "@/types/authContextType";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [branches, setBranches] = useState([]);
  const [error, setError] = useState<any>("");
  const [user, setUser] = useState<any | null>(null);
  const [errors, setErrors] = useState<any>({});
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await api.get("/branches");
        if (response.status === 200) {
          setBranches(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchBranches();
  }, []);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setIsLoading(true);
    try {
      const response = await fetchProfile();
      if (response.status === 200) {
        setUser(response.data);
        setIsAdmin(response.data.is_admin);
        setIsAuthenticated(true);
      }
    } catch (error: any) {
      console.error(error);
      if (error.response.status === 401) {
        setIsAuthenticated(false);
        setUser(null);
        setIsAdmin(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (credentials: any) => {
    try {
      const response = await login(credentials);
      if (response.status === 202) {
        fetchProfileData();
      }
      return response.status;
    } catch (error: any) {
      console.error(error);

      const status = error?.response?.status;

      if (status === 422) {
        setErrors(error.response.data.errors);
        setError("Something went wrong. Please fix the errors.");
      } else if (status === 404 || status === 400) {
        setError(error.response?.data?.message);
        setErrors({});
      } else {
        setError("An unexpected error occurred. Please try again.");
        setErrors({});
      }
    }
  };

  const handleLogout = async () => {
    try {
      const response = await logout();
      if (response.status === 202) {
        setError("");
        setErrors({});
        fetchProfileData();
      }
    } catch (error: any) {
      console.error(error);
      setError(error.response.data);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated,
        handleLogin,
        handleLogout,
        branches,
        error,
        user,
        errors,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthContextProvider");
  }
  return context;
};
