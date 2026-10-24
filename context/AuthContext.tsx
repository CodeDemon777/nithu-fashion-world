"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (name: string, email: string, pass: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalTab: "login" | "signup";
  setAuthModalTab: (tab: "login" | "signup") => void;
  loginAsDemoAdmin: () => void;
  loginAsDemoCustomer: () => void;
  customersList: User[];
  isLoadingCustomers: boolean;
  refreshCustomers: () => Promise<void>;
}

const DEMO_USERS: (User & { password: string })[] = [
  {
    id: "usr-admin",
    name: "Nithu Admin",
    email: "admin@nithufashion.com",
    phone: "7373848555",
    address: "Bazaar Street, Main Tailoring Unit",
    city: "Komarapalayam",
    pincode: "638183",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    joinedDate: "Jan 2024",
    password: "admin123",
    totalOrders: 0,
    totalSpent: 0,
  },
  {
    id: "usr-cust-1",
    name: "Priya Sundaram",
    email: "priya@example.com",
    phone: "9876543210",
    address: "14/B, Gandhi Nagar, Near Saree Market",
    city: "Komarapalayam, Tamil Nadu",
    pincode: "638183",
    role: "customer",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    joinedDate: "Feb 2026",
    password: "user123",
    totalOrders: 3,
    totalSpent: 4296,
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [customersList, setCustomersList] = useState<User[]>(DEMO_USERS);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "signup">("login");

  // Load user session from LocalStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("nithu_auth_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Failed to load user session:", e);
    }
  }, []);

  // Fetch customers from MongoDB Atlas for Admin portal
  const refreshCustomers = useCallback(async () => {
    setIsLoadingCustomers(true);
    try {
      const res = await fetch("/api/customers");
      if (res.ok) {
        const data = await res.json();
        if (data.customers && Array.isArray(data.customers)) {
          setCustomersList(data.customers);
        }
      }
    } catch (e) {
      console.warn("Could not fetch customers from /api/customers:", e);
    } finally {
      setIsLoadingCustomers(false);
    }
  }, []);

  useEffect(() => {
    refreshCustomers();
  }, [refreshCustomers]);

  const saveUserSession = (u: User | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem("nithu_auth_user", JSON.stringify(u));
    } else {
      localStorage.removeItem("nithu_auth_user");
    }
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      // 1. Attempt login against MongoDB Atlas endpoint
      const res = await fetch("/api/customers/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.customer) {
          saveUserSession(data.customer);
          setIsAuthModalOpen(false);
          refreshCustomers();
          return true;
        }
      }
    } catch (e) {
      console.warn("MongoDB login endpoint error, falling back to local list:", e);
    }

    // 2. Fallback to local demo list
    const found = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === pass
    );
    if (found) {
      const { password, ...safeUser } = found;
      saveUserSession(safeUser);
      setIsAuthModalOpen(false);
      return true;
    }

    // Default auto-create user session
    const newUser: User = {
      id: "usr-" + Date.now(),
      name: email.split("@")[0].toUpperCase(),
      email,
      role: email.toLowerCase().includes("admin") ? "admin" : "customer",
      city: "Tamil Nadu",
      joinedDate: "Just now",
      totalOrders: 0,
      totalSpent: 0,
    };
    saveUserSession(newUser);
    setIsAuthModalOpen(false);
    return true;
  };

  const signup = async (
    name: string,
    email: string,
    pass: string,
    phone = ""
  ): Promise<boolean> => {
    try {
      // 1. Attempt registering in MongoDB Atlas
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password: pass,
          phone,
          city: "Komarapalayam, Tamil Nadu",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.customer) {
          saveUserSession(data.customer);
          setIsAuthModalOpen(false);
          refreshCustomers();
          return true;
        }
      }
    } catch (e) {
      console.warn("MongoDB signup error, falling back to local session:", e);
    }

    // 2. Fallback local session
    const newUser: User = {
      id: "usr-" + Date.now(),
      name,
      email,
      phone,
      role: email.toLowerCase().includes("admin") ? "admin" : "customer",
      address: "Tamil Nadu, India",
      city: "Komarapalayam",
      joinedDate: "Just now",
      totalOrders: 0,
      totalSpent: 0,
    };
    saveUserSession(newUser);
    setCustomersList((prev) => [newUser, ...prev]);
    setIsAuthModalOpen(false);
    return true;
  };

  const logout = () => {
    saveUserSession(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    saveUserSession(updated);

    try {
      // Sync with MongoDB Atlas if user ID or email exists
      await fetch(`/api/customers/${user.id || user.email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      refreshCustomers();
    } catch (e) {
      console.warn("Could not sync profile update to MongoDB:", e);
    }
  };

  const loginAsDemoAdmin = () => {
    const admin = DEMO_USERS[0];
    const { password, ...safeUser } = admin;
    saveUserSession(safeUser);
    setIsAuthModalOpen(false);
  };

  const loginAsDemoCustomer = () => {
    const cust = DEMO_USERS[1];
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
        customersList,
        isLoadingCustomers,
        refreshCustomers,
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
