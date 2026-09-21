"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => boolean;
  signup: (name: string, email: string, pass: string, phone?: string) => boolean;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalTab: "login" | "signup";
  setAuthModalTab: (tab: "login" | "signup") => void;
  loginAsDemoAdmin: () => void;
  loginAsDemoCustomer: () => void;
}

const DEMO_USERS: (User & { password: string })[] = [
  {
    id: "usr-admin",
    name: "Nithu Admin",
    email: "admin@nithufashion.com",
    phone: "9585477733",
    address: "Bazaar Street, Main Tailoring Unit",
    city: "Komarapalayam",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    joinedDate: "Jan 2024",
    password: "admin123",
  },
  {
    id: "usr-cust-1",
    name: "Priya Sundaram",
    email: "priya@example.com",
    phone: "9876543210",
    address: "14/B, Gandhi Nagar, Near Saree Market",
    city: "Komarapalayam, Tamil Nadu",
    role: "customer",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    joinedDate: "Feb 2026",
    password: "user123",
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [usersList, setUsersList] = useState(DEMO_USERS);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "signup">("login");

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("nithu_auth_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // Default login as customer for immediate demo experience if preferred, or leave null
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveUserSession = (u: User | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem("nithu_auth_user", JSON.stringify(u));
    } else {
      localStorage.removeItem("nithu_auth_user");
    }
  };

  const login = (email: string, pass: string): boolean => {
    const found = usersList.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === pass
    );
    if (found) {
      const { password, ...safeUser } = found;
      saveUserSession(safeUser);
      setIsAuthModalOpen(false);
      return true;
    }
    // Fallback: If unknown email, authenticate as customer
    const newUser: User = {
      id: "usr-" + Date.now(),
      name: email.split("@")[0].toUpperCase(),
      email,
      role: email.includes("admin") ? "admin" : "customer",
      city: "Tamil Nadu",
      joinedDate: "Just now",
    };
    saveUserSession(newUser);
    setIsAuthModalOpen(false);
    return true;
  };

  const signup = (name: string, email: string, pass: string, phone = ""): boolean => {
    const newUser: User & { password: string } = {
      id: "usr-" + Date.now(),
      name,
      email,
      phone,
      role: email.includes("admin") ? "admin" : "customer",
      address: "Tamil Nadu, India",
      city: "Komarapalayam",
      joinedDate: "Just now",
      password: pass,
    };
    setUsersList((prev) => [...prev, newUser]);
    const { password, ...safeUser } = newUser;
    saveUserSession(safeUser);
    setIsAuthModalOpen(false);
    return true;
  };

  const logout = () => {
    saveUserSession(null);
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    saveUserSession(updated);
  };

  const loginAsDemoAdmin = () => {
    const admin = usersList.find((u) => u.role === "admin") || DEMO_USERS[0];
    const { password, ...safeUser } = admin;
    saveUserSession(safeUser);
    setIsAuthModalOpen(false);
  };

  const loginAsDemoCustomer = () => {
    const cust = usersList.find((u) => u.role === "customer") || DEMO_USERS[1];
    const { password, ...safeUser } = cust;
    saveUserSession(safeUser);
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        updateProfile,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        loginAsDemoAdmin,
        loginAsDemoCustomer,
      }}
    >
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
